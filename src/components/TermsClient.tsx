'use client';

// Terms of Service — template do mockup (rascunho pra revisao juridica),
// com os placeholders da plataforma preenchidos.
import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { termsHtml } from './terms-html';
import { FlameMark } from './Nav';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME, ROOT_DOMAIN, CREATION_FEE_SOL } from '@/lib/env';

export default function TermsClient() {
  const ref = useRef<HTMLDivElement>(null);

  const html = useMemo(
    () =>
      termsHtml(ROOT_DOMAIN)
        .replaceAll('[PLATFORM NAME]', SITE_NAME)
        .replaceAll('[DOMAIN]', ROOT_DOMAIN)
        .replaceAll('[0.5 SOL]', `${CREATION_FEE_SOL} SOL`)
        .replaceAll(
          '[50% platform / 50% Pad Owner]',
          '50% platform / 50% Pad Owner (of net partner fees)'
        ),
    []
  );

  /* scrollspy da TOC (portado do mock) */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const links = [...root.querySelectorAll('.toc a')] as HTMLAnchorElement[];
    const secs = links
      .map((a) => root.querySelector(a.getAttribute('href') || ''))
      .filter(Boolean) as Element[];
    const obs = secs.map(
      (s) =>
        new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (!e.isIntersecting) return;
              const i = secs.indexOf(e.target);
              links.forEach((l, k) => l.classList.toggle('on', k === i));
            }),
          { rootMargin: '-12% 0px -75% 0px' }
        )
    );
    obs.forEach((o, i) => o.observe(secs[i]));
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="pg-terms" ref={ref}>
      <div className="bgfx"></div>

      <nav className="nav">
        <div className="nav-in">
          <Link className="logo" href="/">
            <span className="mark">
              <FlameMark size={15} />
            </span>
            {SITE_NAME}
          </Link>
          <button className="print" onClick={() => window.print()}>
            Print / save PDF
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <div dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="foot">
        <div className="foot-in">
          <span>© 2026 {SITE_NAME}</span>
          <span>
            <Link href="/docs">Docs</Link> · <Link href="/">Home</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
