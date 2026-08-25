// Arte de fundo "desert halftone" — recriacao procedural em SVG da referencia
// visual (montanhas pontilhadas, sol e bandas de areia em laranja sobre creme).
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <pattern id="ht-1" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="0.9" fill="#e05f10" />
          </pattern>
          <pattern id="ht-2" width="5.5" height="5.5" patternUnits="userSpaceOnUse">
            <circle cx="2.75" cy="2.75" r="1.05" fill="#e05f10" />
          </pattern>
          <pattern id="ht-3" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
            <circle cx="2.25" cy="2.25" r="1.25" fill="#e05f10" />
          </pattern>
          <pattern id="ht-sun" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.5" fill="#e05f10" />
          </pattern>
          <pattern id="ht-rows" width="9" height="11" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#e05f10" />
            <circle cx="6.5" cy="7.5" r="0.8" fill="#e05f10" />
          </pattern>
        </defs>

        {/* granulado sutil no ceu inteiro */}
        <rect width="1440" height="900" fill="url(#ht-1)" opacity="0.08" />

        {/* sol */}
        <circle cx="1120" cy="215" r="128" fill="url(#ht-sun)" opacity="0.85" />

        {/* cordilheira distante (esquerda, pico alto) */}
        <path
          d="M0,560 L60,510 L150,420 L230,355 L300,395 L360,440 L430,480 L520,455 L610,505 L700,478 L800,530 L900,505 L1010,555 L1140,528 L1290,575 L1440,558 L1440,900 L0,900 Z"
          fill="url(#ht-2)"
          opacity="0.42"
        />
        {/* serra media */}
        <path
          d="M0,640 L90,600 L180,625 L290,575 L400,630 L520,595 L660,650 L790,615 L930,662 L1080,628 L1230,668 L1350,645 L1440,662 L1440,900 L0,900 Z"
          fill="url(#ht-2)"
          opacity="0.6"
        />
        {/* colinas proximas (direita, mais fortes) */}
        <path
          d="M600,760 L700,715 L790,742 L880,700 L980,738 L1080,690 L1180,725 L1290,682 L1380,715 L1440,700 L1440,900 L600,900 Z"
          fill="url(#ht-3)"
          opacity="0.9"
        />
        <path
          d="M0,780 L120,752 L260,775 L400,748 L540,778 L700,758 L860,788 L1040,762 L1220,792 L1440,768 L1440,900 L0,900 Z"
          fill="url(#ht-3)"
          opacity="0.55"
        />

        {/* planicie: bandas horizontais pontilhadas */}
        <rect x="0" y="800" width="1440" height="100" fill="url(#ht-rows)" opacity="0.5" />
        <rect x="0" y="845" width="1440" height="55" fill="url(#ht-rows)" opacity="0.35" />
      </svg>
    </div>
  );
}
