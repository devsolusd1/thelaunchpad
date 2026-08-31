'use client';

// Pagina do $PAD — markup do mockup injetado + contadores animados.
import { useEffect, useMemo, useRef } from 'react';
import { padTokenHtml, PadStats } from './padtoken-html';
import { PAD_MINT } from '@/lib/env';

export default function PadTokenClient({ stats = null }: { stats?: PadStats }) {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => padTokenHtml(PAD_MINT, stats), [stats]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cp = root.querySelector('#cpca');
    cp?.addEventListener('click', () => {
      navigator.clipboard.writeText(PAD_MINT).then(() => {
        cp.textContent = 'Copied';
        setTimeout(() => (cp.textContent = 'Copy'), 1200);
      });
    });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll<HTMLElement>('[data-to]').forEach((el) => {
      const to = Number(el.dataset.to || 0);
      if (reduce) {
        el.textContent = to.toLocaleString('en-US');
        return;
      }
      const t0 = performance.now();
      const dur = 1500;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, []);

  return (
    <div
      className="pg-padtoken"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
