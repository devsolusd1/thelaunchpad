'use client';

import { useEffect, useState } from 'react';
import { shortAddr } from '@/lib/format';

interface FeeData {
  quoteSymbol: string;
  ownerWallet: string;
  unclaimedRaw: string;
  lifetimeRaw: string;
  paidToOwnerRaw: string;
  payouts: { amountRaw: string; txSig: string; createdAt: string }[];
}

export default function FeeDashboard({ slug }: { slug: string }) {
  const [data, setData] = useState<FeeData | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`/api/launchpads/${slug}/fees`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'erro');
        setData(j);
      })
      .catch((e) => setErr(e.message));
  }, [slug]);

  if (err)
    return <div className="card p-6 text-sm text-red-300">{err}</div>;
  if (!data)
    return <div className="card p-6 text-sm text-gray-400">Loading on-chain fees...</div>;

  const dec = data.quoteSymbol === 'USDC' ? 1e6 : 1e9;
  const unclaimed = Number(data.unclaimedRaw) / dec;
  const lifetime = Number(data.lifetimeRaw) / dec;
  const paid = Number(data.paidToOwnerRaw) / dec;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card label="Lifetime fees" value={`${lifetime.toFixed(4)} ${data.quoteSymbol}`} />
        <Card label="Unclaimed (pools)" value={`${unclaimed.toFixed(4)} ${data.quoteSymbol}`} />
        <Card label="Paid to owner" value={`${paid.toFixed(4)} ${data.quoteSymbol}`} accent />
      </div>

      <div className="card p-5">
        <div className="mb-3 text-sm text-gray-400">
          Owner: <span className="font-mono text-white">{shortAddr(data.ownerWallet, 6)}</span>
        </div>
        <h3 className="mb-3 font-bold text-white">Payouts</h3>
        {data.payouts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No payouts yet — the bot runs periodically and pays out once
            accrued fees pass the minimum.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {data.payouts.map((p, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="py-2 text-gray-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 font-bold text-accent2">
                    {(Number(p.amountRaw) / dec).toFixed(4)} {data.quoteSymbol}
                  </td>
                  <td className="py-2 text-right">
                    <a
                      className="text-accent underline"
                      href={`https://solscan.io/tx/${p.txSig}`}
                      target="_blank"
                    >
                      tx
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-lg font-black ${accent ? 'text-accent2' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}
