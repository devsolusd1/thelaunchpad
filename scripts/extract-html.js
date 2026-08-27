// Extrai trechos dos mockups como template strings TS (usados com
// dangerouslySetInnerHTML nos componentes ilustrativos da landing).
// Marcadores simples sem aspas (PowerShell 5.1 engole aspas internas);
// busca so no <body> e recua ate a tag que abre o trecho.
// Uso: node scripts/extract-html.js <mock.html> <startMarker> <startTag> <endMarker> <endTag> <out.ts> <exportName>
const fs = require('fs');
const [, , htmlPath, startMarker, startTag, endMarker, endTag, outPath, exportName] =
  process.argv;
const html = fs.readFileSync(htmlPath, 'utf8');
const bodyAt = html.indexOf('</head>');

const si = html.indexOf(startMarker, bodyAt);
const ei = html.indexOf(endMarker, si + startMarker.length);
if (si === -1 || ei === -1) {
  console.error('markers not found', si, ei);
  process.exit(1);
}
const start = html.lastIndexOf('<' + startTag, si);
const end = html.lastIndexOf('<' + endTag, ei);
let chunk = html.slice(start, end);
chunk = chunk
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${')
  .replace(/nomedeteste\.fun/g, '${DOMAIN}');
const out =
  `/* GERADO por scripts/extract-html.js — nao editar na mao */\n` +
  `export function ${exportName}(DOMAIN: string): string {\n  return \`` +
  chunk +
  `\`;\n}\n`;
fs.writeFileSync(outPath, out);
console.log(`ok: ${outPath} (${out.length} bytes)`);
