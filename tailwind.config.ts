import type { Config } from 'tailwindcss';

// Paleta casada com o tema dos mockups (src/styles/theme.css).
// white/black/gray/red sao REMAPEADOS de proposito — o app foi escrito com
// esses nomes e o remap retematiza as paginas tailwind num lugar so.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // baseados em CSS vars (theme.css) — trocam junto com o tema dark
        bg: 'rgb(var(--tw-bg) / <alpha-value>)',
        paper: 'rgb(var(--tw-paper) / <alpha-value>)',
        panel: 'rgb(var(--tw-panel) / <alpha-value>)',
        panel2: 'rgb(var(--tw-panel2) / <alpha-value>)',
        line: 'rgb(var(--tw-line) / <alpha-value>)',
        line2: 'rgb(var(--tw-line2) / <alpha-value>)',
        accent: 'rgb(var(--tw-accent) / <alpha-value>)',
        ember: 'rgb(var(--tw-ember) / <alpha-value>)',
        accent2: 'rgb(var(--tw-accent2) / <alpha-value>)', // ok/verde
        warn: 'rgb(var(--tw-warn) / <alpha-value>)',
        cream: 'rgb(var(--tw-cream) / <alpha-value>)',
        white: 'rgb(var(--tw-ink) / <alpha-value>)', // "white" = tinta
        black: 'rgb(var(--tw-cream) / <alpha-value>)', // "black" = creme
        gray: {
          200: 'rgb(var(--tw-gray200) / <alpha-value>)',
          300: 'rgb(var(--tw-gray300) / <alpha-value>)',
          400: 'rgb(var(--tw-gray400) / <alpha-value>)',
          500: 'rgb(var(--tw-gray500) / <alpha-value>)',
          600: 'rgb(var(--tw-gray600) / <alpha-value>)',
        },
        red: {
          300: 'rgb(var(--tw-red300) / <alpha-value>)',
          400: 'rgb(var(--tw-red400) / <alpha-value>)',
          500: 'rgb(var(--tw-red500) / <alpha-value>)',
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
