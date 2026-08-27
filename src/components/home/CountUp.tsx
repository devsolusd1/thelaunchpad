'use client';

import { useEffect, useRef } from 'react';

// Numero que sobe ate o valor real ao montar (estilo mock da landing).
export default function CountUp({
  to,
  dec = 0,
  prefix = '',
  suffix = '',
  className,
}: {
  to: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) =>
      prefix + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suffix;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = fmt(to);
      return;
    }
    const t0 = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, dec, prefix, suffix]);

  return (
    <div ref={ref} className={className}>
      {prefix}
      {dec ? to.toFixed(dec) : Math.round(to).toLocaleString('en-US')}
      {suffix}
    </div>
  );
}
