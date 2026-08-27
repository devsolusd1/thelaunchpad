import type { Config } from 'tailwindcss';

// Paleta casada com o tema dos mockups (src/styles/theme.css).
// white/black/gray/red sao REMAPEADOS de proposito — o app foi escrito com
// esses nomes e o remap retematiza as paginas tailwind num lugar so.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#fdf4e5',
        paper: '#fffaf1',
        panel: '#faecd4',
        panel2: '#f6e3c3',
        line: '#ecdcbe',
        line2: '#dcc39a',
        accent: '#d9631c',
        ember: '#f2913c',
        accent2: '#4f8a45', // ok/verde (buy, sucesso)
        warn: '#a16207',
        cream: '#fffaf1',
        white: '#2b1e13', // "white" = tinta
        black: '#fffaf1', // "black" = creme (texto em botao colorido)
        gray: {
          200: '#4a3928',
          300: '#5d4830',
          400: '#8c7860',
          500: '#8c7860',
          600: '#bda57f',
        },
        red: {
          300: '#9a2c0e',
          400: '#8f280d',
          500: '#c4324f',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
