'use client';

// Calculadora "run the numbers": volume mensal x fee -> quanto o dono ganha.
// Matematica honesta: Meteora fica com 20% da fee; do resto, 50% dono / 50%
// plataforma => dono = 40% da fee total.
import { useState } from 'react';
import { CREATION_FEE_SOL } from '@/lib/env';

const OWNER_SHARE = 0.4;
const PLATFORM_SHARE = 0.4;
const METEORA_SHARE = 0.2;

// slider logaritmico: $10k ... $10M
const MIN_LOG = Math.log10(10_000);
const MAX_LOG = Math.log10(10_000_000);

function sliderToVolume(v: number) {
  const log = MIN_LOG + (v / 1000) * (MAX_LOG - MIN_LOG);
  const raw = Math.pow(10, log);
  // arredonda pra numeros "bonitos"
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.round(raw / (mag / 10)) * (mag / 10);
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return `$${n.toFixed(0)}`;
}

export default function EarningsCalculator() {
  const [vol, setVol] = useState(415); // ~ $250k
  const [feePct, setFeePct] = useState(3.5);

  const volume = sliderToVolume(vol);
  const collected = volume * (feePct / 100);
  const yours = collected * OWNER_SHARE;

  return (
    <div className="card grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <div>
        <h3 className="text-xl font-bold text-white">
          Run the numbers on your own pad
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Drag to see what a month of volume pays you.
        </p>

        <label className="label mt-6">Monthly volume on your pad</label>
        <div className="text-3xl font-black text-white">{fmt(volume)}</div>
        <input
          type="range"
          min={0}
          max={1000}
          value={vol}
          onChange={(e) => setVol(Number(e.target.value))}
          className="mt-2 w-full accent-[#e05f10]"
        />

        <label className="label mt-6">Your trading fee</label>
        <div className="text-3xl font-black text-white">{feePct.toFixed(1)}%</div>
        <input
          type="range"
          min={2}
          max={10}
          step={0.5}
          value={feePct}
          onChange={(e) => setFeePct(Number(e.target.value))}
          className="mt-2 w-full accent-[#e05f10]"
        />
      </div>

      <div className="rounded-2xl border border-line bg-cream/60 p-6">
        <div className="label">Fees collected</div>
        <div className="text-2xl font-black text-white">{fmt(collected)}</div>

        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
          <div
            className="bg-line"
            style={{ width: `${METEORA_SHARE * 100}%` }}
            title="Meteora 20%"
          />
          <div
            className="bg-panel2"
            style={{ width: `${PLATFORM_SHARE * 100}%` }}
            title="Platform 40%"
          />
          <div
            className="bg-accent"
            style={{ width: `${OWNER_SHARE * 100}%` }}
            title="You 40%"
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-gray-500">
          <span>Meteora 20%</span>
          <span>Platform 40%</span>
          <span className="font-bold text-accent">You 40%</span>
        </div>

        <div className="label mt-5">Your share</div>
        <div className="text-5xl font-black text-accent">{fmt(yours)}</div>
        <p className="mt-2 text-xs text-gray-500">
          Estimate. Actual payouts follow real on-chain volume and are listed
          on your pad&apos;s dashboard.
        </p>

        <a href="/create" className="btn-primary mt-5 w-full py-3">
          Create your launchpad ({CREATION_FEE_SOL} SOL)
        </a>
        <p className="mt-2 text-center text-xs text-gray-500">
          The {CREATION_FEE_SOL} SOL fee buys back &amp; burns the main token.
        </p>
      </div>
    </div>
  );
}
