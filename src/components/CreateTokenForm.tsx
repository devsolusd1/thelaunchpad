'use client';

import { useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import BN from 'bn.js';
import ImagePicker from '@/components/ImagePicker';
import {
  DynamicBondingCurveClient,
  deriveDbcPoolAddress,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

type Phase = 'form' | 'preparing' | 'sending' | 'confirming' | 'done';

export default function CreateTokenForm({
  slug,
  configKey,
  quoteMint,
  quoteSymbol,
  quoteDecimals,
  asMain = false,
  padName,
}: {
  slug: string;
  configKey: string;
  quoteMint: string;
  quoteSymbol: string;
  quoteDecimals: number;
  asMain?: boolean;
  padName?: string;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [devBuy, setDevBuy] = useState('');

  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');
  const [mintDone, setMintDone] = useState('');

  const valid = name.trim().length > 0 && /^[A-Za-z0-9$]{1,10}$/.test(symbol);

  async function submit() {
    setError('');
    if (!wallet.publicKey || !wallet.connected) {
      setVisible(true);
      return;
    }
    try {
      setPhase('preparing');
      let imageBase64: string | undefined;
      let imageMime: string | undefined;
      if (image) {
        imageBase64 = await fileToBase64(image);
        imageMime = image.type;
      }
      const prep = await fetch('/api/tokens/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          launchpadSlug: slug,
          name,
          symbol,
          description,
          imageBase64,
          imageMime,
          website,
          twitter,
          telegram,
          asMain,
        }),
      });
      const prepJson = await prep.json();
      if (!prep.ok) throw new Error(prepJson.error || 'failed to prepare metadata');

      setPhase('sending');
      const mintKp = Keypair.generate();
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const createPoolParam = {
        name,
        symbol: symbol.toUpperCase(),
        uri: prepJson.uri,
        payer: wallet.publicKey,
        poolCreator: wallet.publicKey,
        config: new PublicKey(configKey),
        baseMint: mintKp.publicKey,
      };
      const devBuyNum = Number(devBuy);
      // dev buy opcional: pool + primeira compra na MESMA transacao
      const tx =
        devBuyNum > 0
          ? await client.creator.createPoolWithFirstBuy({
              createPoolParam,
              firstBuyParam: {
                buyer: wallet.publicKey,
                buyAmount: new BN(
                  Math.round(devBuyNum * 10 ** quoteDecimals).toString()
                ),
                minimumAmountOut: new BN(1),
                referralTokenAccount: null,
              },
            })
          : await client.creator.createPool(createPoolParam);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash('confirmed');
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;

      const sig = await wallet.sendTransaction(tx, connection, {
        signers: [mintKp],
      });
      setPhase('confirming');
      const conf = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      );
      if (conf.value.err)
        throw new Error(`transaction failed: ${JSON.stringify(conf.value.err)}`);

      const pool = deriveDbcPoolAddress(
        new PublicKey(quoteMint),
        mintKp.publicKey,
        new PublicKey(configKey)
      );
      const res = await fetch('/api/tokens/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prepJson.id,
          mint: mintKp.publicKey.toBase58(),
          pool: pool.toBase58(),
          txSig: sig,
          creatorWallet: wallet.publicKey.toBase58(),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed to confirm');

      setMintDone(mintKp.publicKey.toBase58());
      setPhase('done');
    } catch (e: any) {
      setError(e?.message || String(e));
      setPhase('form');
    }
  }

  if (phase === 'done') {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl">🚀</div>
        <h2 className="mt-4 text-2xl font-bold text-white">Token launched!</h2>
        <p className="mt-2 break-all font-mono text-xs text-gray-500">
          {mintDone}
        </p>
        <a href={`/token/${mintDone}`} className="btn-green mt-6">
          Go to token page
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {asMain && (
        <div className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm">
          <b className="text-accent">Launching as the pad&apos;s MAIN token.</b>{' '}
          <span className="text-gray-400">
            It will be featured on {padName || 'the launchpad'}&apos;s hub.
            Only the launchpad owner&apos;s wallet can set this — for anyone
            else it launches as a regular token.
          </span>
        </div>
      )}
      <div className="card space-y-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label">Name</label>
            <input
              className="input"
              value={name}
              maxLength={32}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Ticker</label>
            <input
              className="input uppercase"
              value={symbol}
              maxLength={10}
              onChange={(e) =>
                setSymbol(e.target.value.replace(/[^A-Za-z0-9$]/g, ''))
              }
            />
          </div>
        </div>
        <div>
          <label className="label">Description (optional)</label>
          <textarea
            className="input"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <ImagePicker
          label="Image (optional, max 1.5MB)"
          file={image}
          onChange={setImage}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          <input className="input" placeholder="Twitter/X" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <input className="input" placeholder="Telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
        </div>
        <div>
          <label className="label">
            Dev buy (optional, {quoteSymbol}) — buy your own token in the same
            transaction as the launch
          </label>
          <input
            className="input"
            type="number"
            min={0}
            step="any"
            placeholder={`0.0 ${quoteSymbol}`}
            value={devBuy}
            onChange={(e) => setDevBuy(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        className="btn-green w-full py-3 text-lg"
        disabled={!valid || phase !== 'form'}
        onClick={submit}
      >
        {phase === 'preparing'
          ? 'Preparing metadata...'
          : phase === 'sending'
            ? 'Confirm in your wallet...'
            : phase === 'confirming'
              ? 'Confirming...'
              : wallet.connected
                ? 'Launch token'
                : 'Connect wallet'}
      </button>
    </div>
  );
}

function fileToBase64(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}
