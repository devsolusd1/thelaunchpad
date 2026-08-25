import type { Config } from 'tailwindcss';

// Tema "desert halftone": creme + laranja queimado + tinta marrom.
// white/black/gray/red sao REMAPEADOS de proposito — todo o app foi escrito
// com esses nomes e o remap retematiza tudo num lugar so.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#fdf0dc', // areia clara (ceu da arte)
        panel: '#fae7c9',
        panel2: '#f4dcb4',
        line: '#e8c895',
        accent: '#e05f10', // laranja queimado
        accent2: '#b3490c', // laranja profundo (CTAs de token / progresso)
        warn: '#a16207',
        cream: '#fff7e8', // texto sobre laranja/vermelho
        white: '#3b2210', // "white" = tinta marrom (tema claro)
        black: '#fff7e8', // "black" = creme (texto de botao colorido)
        gray: {
          200: '#4a2c17',
          300: '#5d3a1f',
          400: '#7a5230',
          500: '#95693f',
          600: '#b08753',
        },
        red: {
          300: '#9a2c0e',
          400: '#8f280d',
          500: '#bf3411',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
