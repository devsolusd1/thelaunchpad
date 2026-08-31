'use client';

// Pagina do $PAD — markup do mockup injetado + contadores animados.
import { useEffect, useRef } from 'react';
import { padTokenHtml } from './padtoken-html';

export default function PadTokenClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
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
      dangerouslySetInnerHTML={{ __html: padTokenHtml }}
    />
  );
}
