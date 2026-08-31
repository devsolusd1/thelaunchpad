'use client';

// Terms of Service — template do mockup (rascunho pra revisao juridica),
// com os placeholders da plataforma preenchidos.
import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { termsHtml } from './terms-html';
import { PadLockup } from './brand';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME, DISPLAY_DOMAIN, CREATION_FEE_SOL } from '@/lib/env';

export default function TermsClient() {
  const ref = useRef<HTMLDivElement>(null);

  const html = useMemo(
    () =>
      termsHtml(DISPLAY_DOMAIN)
        .replaceAll('[PLATFORM NAME]', SITE_NAME)
        .replaceAll('[DOMAIN]', DISPLAY_DOMAIN)
        .replaceAll('[0.5 SOL]', `${CREATION_FEE_SOL} SOL`)
        .replaceAll(
          '[50% platform / 50% Pad Owner]',
          '50% platform / 50% Pad Owner (of net partner fees)'
        )
        /* preenchimento padrao (generico e neutro, sujeito a revisao juridica) */
        .replaceAll(
          ', a <span class="ph">[ENTITY TYPE]</span> organized under the laws of <span class="ph">[JURISDICTION]</span>, with registered address at <span class="ph">[ADDRESS]</span>',
          ''
        )
        .replaceAll(
          'the laws of <span class="ph">[JURISDICTION]</span>',
          'the laws of the jurisdiction in which the Company is established'
        )
        .replaceAll('[DATE]', 'August 31, 2026')
        .replaceAll('[LEGAL ENTITY NAME]', SITE_NAME)
        .replaceAll('[ADDRESS]', `legal@${DISPLAY_DOMAIN}`)
        .replaceAll('[OFAC / EU / UN / OTHER]', 'any national or international authority')
        .replaceAll(
          '[LIST OF RESTRICTED JURISDICTIONS]',
          'any jurisdiction subject to comprehensive sanctions'
        )
        .replaceAll('[USD 100]', 'USD 100')
        .replaceAll('[ARBITRAL INSTITUTION]', 'a recognized arbitral institution')
        .replaceAll('[SEAT / CITY]', 'a seat designated by the Company')
        .replaceAll('[LANGUAGE]', 'English')
        .replaceAll('[ONE / THREE]', 'one')
        .replaceAll('[30]', '30')
        .replaceAll('[ENGLISH]', 'English')
        .replaceAll('[SUPPORT EMAIL]', `support@${DISPLAY_DOMAIN}`)
        .replaceAll('[LEGAL EMAIL]', `legal@${DISPLAY_DOMAIN}`)
        .replaceAll(' class="ph"', ''),
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
          <Link className="logo" href="/" aria-label={SITE_NAME}>
            <PadLockup height={24} title={SITE_NAME} />
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
