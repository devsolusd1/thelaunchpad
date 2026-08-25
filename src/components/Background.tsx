'use client';

// Fundo: a arte original bem discreta (opacidade baixa + veu de cor do tema)
// com parallax sutil ao rolar a pagina.
import { useEffect, useRef } from 'react';

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (ref.current)
        ref.current.style.transform = `translate3d(0, ${window.scrollY * -0.05}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* container maior que a viewport pra nao abrir borda com o parallax */}
      <div ref={ref} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg.png"
          alt=""
          className="h-full w-full object-cover object-bottom opacity-25"
        />
      </div>
      {/* veu do tema: forte no topo (legibilidade), suave embaixo */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/45 to-bg/15" />
    </div>
  );
}
