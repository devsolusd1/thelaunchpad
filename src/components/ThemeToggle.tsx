'use client';

// Botao de tema claro/escuro — persiste em localStorage e aplica
// data-theme no <html> (os tokens CSS fazem o resto).
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const d = localStorage.getItem('theme') === 'dark';
      setDark(d);
      document.documentElement.dataset.theme = d ? 'dark' : 'light';
    } catch {
      /* storage bloqueado */
    }
  }, []);

  function toggle() {
    const d = !dark;
    setDark(d);
    // transicao suave: liga a classe de animacao so' durante a troca
    const root = document.documentElement;
    root.classList.add('theme-anim');
    root.dataset.theme = d ? 'dark' : 'light';
    window.setTimeout(() => root.classList.remove('theme-anim'), 500);
    try {
      localStorage.setItem('theme', d ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.4" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.4A8.2 8.2 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4Z" />
        </svg>
      )}
    </button>
  );
}
