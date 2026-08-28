'use client';

// DEV-ONLY (so' roda em localhost): permite recolorir o site via query
// string pra gerar previews de paleta — ?accent=%23c4324f&ember=%23e8657f
// e ?dark=1 forca o tema escuro. Usado pela galeria color-previews.html.
import { useEffect } from 'react';

export default function AccentFromQuery() {
  useEffect(() => {
    if (!location.hostname.includes('localhost')) return;
    const p = new URLSearchParams(location.search);
    const ok = (v: string | null): v is string =>
      !!v && /^#[0-9a-fA-F]{6}$/.test(v);
    const root = document.documentElement;

    const a = p.get('accent');
    if (ok(a)) {
      root.style.setProperty('--accent', a);
      root.style.setProperty('--pad', a);
      root.style.setProperty('--soft', `color-mix(in srgb, ${a} 18%, #fff)`);
      const n = parseInt(a.slice(1), 16);
      root.style.setProperty(
        '--tw-accent',
        `${n >> 16} ${(n >> 8) & 255} ${n & 255}`
      );
    }
    const e = p.get('ember');
    if (ok(e)) {
      root.style.setProperty('--ember', e);
      root.style.setProperty('--pad2', e);
      const n = parseInt(e.slice(1), 16);
      root.style.setProperty(
        '--tw-ember',
        `${n >> 16} ${(n >> 8) & 255} ${n & 255}`
      );
    }
    if (p.get('dark') === '1') root.dataset.theme = 'dark';
  }, []);
  return null;
}
