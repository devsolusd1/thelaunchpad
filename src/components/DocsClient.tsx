'use client';

// Docs — mockup docs.html portado: artigos por hash, sidebar com busca,
// TOC com scrollspy e prev/next. Top bar refeita em React.
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { docsHtml } from './docs-html';
import { PadLockup } from './brand';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME, CREATION_FEE_SOL } from '@/lib/env';

const PAGES = ['intro', 'quickstart', 'concepts', 'curve', 'fees', 'owner-create', 'pad-token', 'dashboard', 'creators', 'pad-token-economics', 'analytics', 'attribution', 'security', 'faq', 'legal'];
const TITLES: Record<string, string> = {
  intro: 'Introduction', quickstart: 'Quickstart', concepts: 'Launchpads',
  curve: 'The bonding curve', fees: 'Fees and the 50/50 split',
  'owner-create': 'Creating your pad', 'pad-token': 'Your pad token',
  dashboard: 'Owner dashboard', creators: 'Launching on a pad',
  'pad-token-economics': 'The platform token', analytics: 'Analytics',
  attribution: 'Attribution', security: 'Security and risk', faq: 'FAQ', legal: 'Legal',
};

export default function DocsClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const html = useMemo(() => docsHtml(CREATION_FEE_SOL), []);

  /* rotas por hash + toc + prev/next (portado do mock) */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const arts = [...root.querySelectorAll('article')] as HTMLElement[];
    const links = [...root.querySelectorAll('nav.side a')] as HTMLAnchorElement[];
    const toc = root.querySelector('#toc') as HTMLElement;
    const pn = root.querySelector('#pn') as HTMLElement;

    function buildToc(id: string) {
      const art = arts.find((a) => a.dataset.p === id);
      const hs = [...(art?.querySelectorAll('h2[id]') || [])] as HTMLElement[];
      toc.innerHTML = hs.length
        ? '<div class="tt">On this page</div>' +
          hs.map((h) => `<a href="#${id}" data-h="${h.id}">${h.textContent}</a>`).join('')
        : '';
      toc.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', (e) => {
          e.preventDefault();
          root!.querySelector(`#${CSS.escape(a.dataset.h || '')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
      );
    }
    function buildPn(id: string) {
      const i = PAGES.indexOf(id);
      const prev = PAGES[i - 1];
      const next = PAGES[i + 1];
      pn.innerHTML =
        (prev ? `<a href="#${prev}"><span>Previous</span><b>${TITLES[prev]}</b></a>` : '<span></span>') +
        (next ? `<a class="next" href="#${next}"><span>Next</span><b>${TITLES[next]}</b></a>` : '');
    }
    function show(id: string) {
      if (!PAGES.includes(id)) id = PAGES[0];
      arts.forEach((a) => (a.hidden = a.dataset.p !== id));
      links.forEach((a) => a.classList.toggle('on', a.dataset.p === id));
      buildToc(id);
      buildPn(id);
      window.scrollTo({ top: 0 });
      root!.querySelector('nav.side')?.classList.remove('open');
    }

    const onHash = () => show(location.hash.slice(1));
    addEventListener('hashchange', onHash);
    show(location.hash.slice(1) || PAGES[0]);

    /* copy button dos blocos de codigo */
    const copies = [...root.querySelectorAll('.cp')] as HTMLButtonElement[];
    copies.forEach((b) =>
      b.addEventListener('click', () => {
        const t = b.parentElement?.querySelector('pre')?.innerText || '';
        navigator.clipboard.writeText(t).then(() => {
          b.textContent = 'Copied';
          setTimeout(() => (b.textContent = 'Copy'), 1200);
        });
      })
    );

    /* scrollspy do toc */
    const onScroll = () => {
      const art = root.querySelector('article:not([hidden])');
      if (!art) return;
      const hs = [...art.querySelectorAll('h2[id]')] as HTMLElement[];
      let cur: string | null = null;
      for (const h of hs) if (h.getBoundingClientRect().top < 140) cur = h.id;
      toc.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.dataset.h === cur));
    };
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      removeEventListener('hashchange', onHash);
      removeEventListener('scroll', onScroll);
    };
  }, [html]);

  /* filtro da sidebar */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const v = q.toLowerCase();
    root.querySelectorAll<HTMLAnchorElement>('nav.side a').forEach((a) => {
      a.style.display = (a.textContent || '').toLowerCase().includes(v) ? '' : 'none';
    });
    root.querySelectorAll<HTMLElement>('.grp').forEach((g) => {
      const any = [...g.querySelectorAll('a')].some((a) => a.style.display !== 'none');
      g.style.display = any ? '' : 'none';
    });
  }, [q]);

  return (
    <div className="pg-docs" ref={ref}>
      <header className="top">
        <div className="top-in">
          <button
            className="burger"
            aria-label="Menu"
            onClick={() => ref.current?.querySelector('nav.side')?.classList.toggle('open')}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <Link className="logo" href="/" aria-label={SITE_NAME}>
            <PadLockup height={24} title={SITE_NAME} />
          </Link>
          <span className="ver">Docs</span>
          <div className="search">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input placeholder="Filter pages…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Link className="tlk" href="/">Platform</Link>
          <Link className="tlk" href="/pad">$PAD</Link>
          <Link className="tlk" href="/terms">Terms</Link>
          <a className="tlk" href="https://x.com/padcore_io" target="_blank" rel="noopener" title="Padcore on X" aria-label="Padcore on X" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 6-7Z" /></svg>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
