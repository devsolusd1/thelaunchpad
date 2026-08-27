'use client';

// Secao "how it works" da landing: markup ilustrativo extraido do mockup
// (hiw-html.ts) + logica de tabs/animacoes/simulador portada do mock.
import { useEffect, useRef } from 'react';
import { hiwHtml } from './hiw-html';

export default function HowItWorks({ domain }: { domain: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const $ = (s: string) => root.querySelector(s) as HTMLElement | null;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];

    /* tabs / slides */
    const tabsEl = $('#tabs');
    const tabs = [...root.querySelectorAll('.tab')] as HTMLElement[];
    const slides = [...root.querySelectorAll('.slide')] as HTMLElement[];
    let current = -1;
    let timer = 0;
    const DWELL = 6500;

    function show(i: number) {
      if (i === current) return;
      current = i;
      tabs.forEach((t, k) => t.classList.toggle('on', k === i));
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      if (i === 1) typeSubdomain();
      if (i === 4) countBurn();
    }
    function play() {
      clearInterval(timer);
      if (!reduce)
        timer = window.setInterval(
          () => show((current + 1) % slides.length),
          DWELL
        );
      timers.push(timer);
    }
    tabs.forEach((t) =>
      t.addEventListener('click', () => {
        show(+(t.dataset.i || 0));
        play();
      })
    );
    tabsEl?.addEventListener('mouseenter', () => {
      clearInterval(timer);
      tabsEl.classList.add('paused');
    });
    tabsEl?.addEventListener('mouseleave', () => {
      tabsEl.classList.remove('paused');
      play();
    });

    /* digitacao do subdominio */
    const typed = $('#typed');
    const avail = $('#avail');
    let typing = 0;
    function typeSubdomain() {
      if (!typed || !avail) return;
      const word = 'nounspad';
      clearInterval(typing);
      typed.textContent = '';
      avail.classList.remove('show');
      if (reduce) {
        typed.textContent = word;
        avail.classList.add('show');
        return;
      }
      let i = 0;
      typing = window.setInterval(() => {
        typed.textContent = word.slice(0, ++i);
        if (i === word.length) {
          clearInterval(typing);
          setTimeout(() => avail.classList.add('show'), 400);
        }
      }, 100);
      timers.push(typing);
    }

    /* contador do burn */
    const burnN = $('#burnN');
    const TARGET = 412908;
    function countBurn() {
      if (!burnN) return;
      if (reduce) {
        burnN.textContent = TARGET.toLocaleString('en-US');
        return;
      }
      const t0 = performance.now();
      const dur = 1000;
      (function tick(now: number) {
        const p = Math.min((now - t0) / dur, 1);
        burnN.textContent = Math.round(
          TARGET * (1 - Math.pow(1 - p, 3))
        ).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }

    /* feed de payouts (ilustrativo) */
    const TOKENS = [
      { n: 'APPLE', i: '<circle cx="12" cy="14" r="6.6"/><path d="M12 7.4V4.6"/><path d="M12.4 6.6c1.8 0 3-1.2 3.1-3-1.8 0-3 1.2-3.1 3Z"/>' },
      { n: 'COIN', i: '<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="3"/>' },
      { n: 'KEY', i: '<circle cx="9" cy="9.4" r="4.2"/><path d="m12 12.4 7.4 7.4"/><path d="m16.2 16.6 1.8-1.8"/>' },
      { n: 'BELL', i: '<path d="M6.2 16.6h11.6l-2-2.6v-3a3.8 3.8 0 0 0-7.6 0v3l-2 2.6Z"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/>' },
      { n: 'CACTUS', i: '<path d="M12 20.5V6"/><path d="M8 14.5v-3a2 2 0 0 1 4 0"/><path d="M16 13v-2.6a2 2 0 0 0-4 0"/>' },
      { n: 'ANCHOR', i: '<circle cx="12" cy="5.4" r="2.4"/><path d="M12 7.8v12.4"/><path d="M4.6 13a7.4 7.4 0 0 0 14.8 0"/><path d="M8.4 12H4.6M19.4 12h-3.8"/>' },
    ];
    const feed = $('#feed');
    const totalEl = $('#total');
    let running = 142.7;
    function makeRow() {
      const li = document.createElement('li');
      const buy = Math.random() > 0.42;
      const t = TOKENS[(Math.random() * TOKENS.length) | 0];
      const f = Math.random() * 0.9 + 0.06;
      li.className = 'new';
      li.innerHTML =
        '<span class="tick"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        t.i +
        '</svg></span><span>$' +
        t.n +
        '</span><span class="side ' +
        (buy ? 'buy">buy' : 'sell">sell') +
        '</span><span class="fee">fee ' +
        f.toFixed(3) +
        '</span><span class="cut">+' +
        (f / 2).toFixed(3) +
        ' SOL</span>';
      return { li, cut: f / 2 };
    }
    if (feed && totalEl) {
      for (let i = 0; i < 4; i++) {
        const r = makeRow();
        r.li.classList.remove('new');
        feed.appendChild(r.li);
      }
      if (!reduce) {
        const fi = window.setInterval(() => {
          const r = makeRow();
          feed.prepend(r.li);
          if (feed.children.length > 4) feed.lastElementChild?.remove();
          running += r.cut;
          totalEl.textContent = running.toFixed(1) + ' SOL';
        }, 2400);
        timers.push(fi);
      }
    }

    /* simulador — matematica honesta: dono = 50% do liquido (pos 20% Meteora) */
    const usd = (n: number) =>
      n >= 1e6
        ? '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 2) + 'M'
        : n >= 1e3
          ? '$' + (n / 1e3).toFixed(n >= 1e5 ? 0 : 1) + 'k'
          : '$' + Math.round(n);
    const vol = $('#vol') as HTMLInputElement | null;
    const fee = $('#fee') as HTMLInputElement | null;
    function render() {
      if (!vol || !fee) return;
      const v = +vol.value;
      const f = +fee.value;
      const net = (v * f) / 100 * 0.8;
      $('#volOut')!.textContent = usd(v);
      $('#feeOut')!.textContent = f.toFixed(1) + '%';
      $('#totalOut')!.textContent = usd(net) + ' net';
      $('#yourOut')!.textContent = usd(net / 2);
    }
    vol?.addEventListener('input', render);
    fee?.addEventListener('input', render);
    render();
    const fine = root.querySelector('.fine');
    if (fine)
      fine.textContent =
        "Estimate of your 50% of net fees (Meteora's protocol keeps 20% of the gross fee). Real payouts follow on-chain volume and are listed on your pad's dashboard.";

    if (reduce)
      root.querySelectorAll('animateMotion').forEach((a) => a.remove());

    show(0);
    play();
    return () => timers.forEach((t) => clearInterval(t));
  }, []);

  return (
    <div
      id="how-it-works"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: hiwHtml(domain) }}
    />
  );
}
