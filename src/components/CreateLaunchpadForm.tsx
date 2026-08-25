'use client';

import { useEffect, useState } from 'react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { buildLaunchpadCurve, validateLaunchpadCurve } from '@/lib/dbc';
import {
  QUOTES,
  QuoteSymbol,
  TREASURY_WALLET,
  CREATION_FEE_SOL,
  ROOT_DOMAIN,
  MIN_INITIAL_MC_USD,
  MAX_INITIAL_MC_USD,
  MIN_MIGRATION_RATIO,
  MIN_FEE_BPS,
  MAX_FEE_BPS,
  SLUG_RE,
  launchpadUrl,
} from '@/lib/env';

type Phase = 'form' | 'sending' | 'registering' | 'done';

export default function CreateLaunchpadForm() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const [slug, setSlug] = useState('');
  const [slugFree, setSlugFree] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quoteSymbol, setQuoteSymbol] = useState<QuoteSymbol>('SOL');
  const [feePct, setFeePct] = useState(2);
  const [initialMc, setInitialMc] = useState(5000);
  const [migrationMc, setMigrationMc] = useState(69000);
  const [logo, setLogo] = useState<File | null>(null);
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');

  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');
  const [doneUrl, setDoneUrl] = useState('');

  // checagem de disponibilidade do subdominio (debounce)
  useEffect(() => {
    setSlugFree(null);
    if (!SLUG_RE.test(slug)) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/launchpads/check?slug=${slug}`);
        const j = await r.json();
        setSlugFree(!!j.available);
      } catch {
        setSlugFree(null);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [slug]);

  const feeBps = Math.round(feePct * 100);
  const validForm =
    SLUG_RE.test(slug) &&
    slugFree === true &&
    name.trim().length > 0 &&
    feeBps >= MIN_FEE_BPS &&
    feeBps <= MAX_FEE_BPS &&
    initialMc >= MIN_INITIAL_MC_USD &&
    initialMc <= MAX_INITIAL_MC_USD &&
    migrationMc >= initialMc * MIN_MIGRATION_RATIO;

  async function submit() {
    setError('');
    if (!wallet.publicKey || !wallet.connected) {
      setVisible(true);
      return;
    }
    if (!TREASURY_WALLET) {
      setError('NEXT_PUBLIC_TREASURY_WALLET nao configurada no servidor');
      return;
    }
    try {
      setPhase('sending');
      const quote = QUOTES[quoteSymbol];

      // preco do quote em USD (curva e' construida na unidade do quote)
      let quoteUsd = 1;
      if (quoteSymbol === 'SOL') {
        const r = await fetch('/api/price');
        const j = await r.json();
        if (!j.solUsd) throw new Error('nao consegui o preco do SOL');
        quoteUsd = j.solUsd;
      }

      const curve = buildLaunchpadCurve({
        feeBps,
        quoteDecimals: quote.decimals,
        initialMcUsd: initialMc,
        migrationMcUsd: migrationMc,
        quoteUsdPrice: quoteUsd,
      });
      const treasury = new PublicKey(TREASURY_WALLET);
      validateLaunchpadCurve(curve, treasury);

      const configKp = Keypair.generate();
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const tx = await client.partner.createConfig({
        ...(curve as any),
        config: configKp.publicKey,
        feeClaimer: treasury,
        leftoverReceiver: treasury,
        quoteMint: new PublicKey(quote.mint),
        payer: wallet.publicKey,
      });

      // taxa de criacao anti-flood -> treasury (mesma tx)
      tx.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasury,
          lamports: Math.round(CREATION_FEE_SOL * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash('confirmed');
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;

      const sig = await wallet.sendTransaction(tx, connection, {
        signers: [configKp],
      });
      const conf = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      );
      if (conf.value.err)
        throw new Error(`transacao falhou on-chain: ${JSON.stringify(conf.value.err)}`);

      setPhase('registering');
      let logoBase64: string | undefined;
      let logoMime: string | undefined;
      if (logo) {
        logoBase64 = await fileToBase64(logo);
        logoMime = logo.type;
      }
      const res = await fetch('/api/launchpads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          description,
          ownerWallet: wallet.publicKey.toBase58(),
          configKey: configKp.publicKey.toBase58(),
          quoteSymbol,
          feeBps,
          initialMcUsd: initialMc,
          migrationMcUsd: migrationMc,
          logoBase64,
          logoMime,
          twitter,
          telegram,
          website,
          txSig: sig,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'falha ao registrar');

      setDoneUrl(launchpadUrl(slug));
      setPhase('done');
    } catch (e: any) {
      setError(e?.message || String(e));
      setPhase('form');
    }
  }

  if (phase === 'done') {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 text-2xl font-bold text-white">
          Launchpad criada!
        </h2>
        <p className="mt-2 text-gray-400">
          Sua launchpad esta no ar em{' '}
          <a href={doneUrl} className="text-accent underline">
            {slug}.{ROOT_DOMAIN}
          </a>
        </p>
        <a href={doneUrl} className="btn-primary mt-6">
          Abrir minha launchpad
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Subdominio</label>
          <div className="flex items-center gap-2">
            <input
              className="input"
              placeholder="prosperity"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
              }
              maxLength={32}
            />
            <span className="whitespace-nowrap text-sm text-gray-500">
              .{ROOT_DOMAIN}
            </span>
          </div>
          {slug && !SLUG_RE.test(slug) && (
            <p className="mt-1 text-xs text-warn">3–32 caracteres, a-z, 0-9 e hifen</p>
          )}
          {slugFree === false && (
            <p className="mt-1 text-xs text-red-400">ja esta em uso</p>
          )}
          {slugFree === true && (
            <p className="mt-1 text-xs text-accent2">disponivel ✓</p>
          )}
        </div>

        <div>
          <label className="label">Nome</label>
          <input
            className="input"
            placeholder="Prosperity Launchpad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
        </div>

        <div>
          <label className="label">Descricao (opcional)</label>
          <textarea
            className="input"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <label className="label">Logo (opcional, max 1.5MB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="text-sm text-gray-400"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-white">Curva (vale pra todos os tokens da sua launchpad)</h3>

        <div>
          <label className="label">Quote token</label>
          <div className="flex gap-2">
            {(['SOL', 'USDC'] as QuoteSymbol[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuoteSymbol(q)}
                className={
                  quoteSymbol === q
                    ? 'btn bg-accent text-white'
                    : 'btn-outline'
                }
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">
            Fee de trade: <b className="text-white">{feePct.toFixed(1)}%</b>{' '}
            <span className="text-gray-500">
              (voce recebe {(feePct / 2).toFixed(2)}% de todo volume, antes da
              parte da Meteora)
            </span>
          </label>
          <input
            type="range"
            min={MIN_FEE_BPS / 100}
            max={MAX_FEE_BPS / 100}
            step={0.5}
            value={feePct}
            onChange={(e) => setFeePct(Number(e.target.value))}
            className="w-full accent-[#7c5cff]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">MC inicial (USD)</label>
            <input
              type="number"
              className="input"
              min={MIN_INITIAL_MC_USD}
              max={MAX_INITIAL_MC_USD}
              value={initialMc}
              onChange={(e) => setInitialMc(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-gray-500">
              ${MIN_INITIAL_MC_USD.toLocaleString()} – $
              {MAX_INITIAL_MC_USD.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="label">MC de graduacao (USD)</label>
            <input
              type="number"
              className="input"
              min={initialMc * MIN_MIGRATION_RATIO}
              value={migrationMc}
              onChange={(e) => setMigrationMc(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-gray-500">
              minimo {MIN_MIGRATION_RATIO}x o inicial; sem teto
            </p>
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-white">Links (opcional)</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" placeholder="Twitter/X" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <input className="input" placeholder="Telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
          <input className="input" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        className="btn-primary w-full py-3 text-lg"
        disabled={!validForm || phase !== 'form'}
        onClick={submit}
      >
        {phase === 'sending'
          ? 'Confirme na wallet...'
          : phase === 'registering'
            ? 'Registrando...'
            : wallet.connected
              ? `Criar launchpad — ${CREATION_FEE_SOL} SOL`
              : 'Conectar wallet'}
      </button>
      <p className="text-center text-xs text-gray-500">
        A taxa de {CREATION_FEE_SOL} SOL vira buyback & burn do token da
        plataforma. + ~0.03 SOL de rent da config on-chain.
      </p>
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
