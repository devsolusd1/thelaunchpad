// Extrai o <style> de cada mockup HTML e gera CSS com escopo .pg-<page>,
// pra todas as paginas coexistirem no mesmo app sem colisao de classes.
// Uso: node scripts/scope-css.js <mock.html> <pageClass> <out.css>
const fs = require('fs');

const [, , htmlPath, pageClass, outPath] = process.argv;
const html = fs.readFileSync(htmlPath, 'utf8');
const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)]
  .map((m) => m[1])
  .join('\n');

function scopeBlock(css, prefix) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    // pula comentarios
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }
    const brace = css.indexOf('{', i);
    if (brace === -1) break;
    const selector = css.slice(i, brace).trim();

    if (selector.startsWith('@keyframes') || selector.startsWith('@font-face')) {
      // copia bloco inteiro sem prefixar
      const end = matchBrace(css, brace);
      out += css.slice(i, end + 1) + '\n';
      i = end + 1;
      continue;
    }
    if (selector.startsWith('@media') || selector.startsWith('@supports')) {
      const end = matchBrace(css, brace);
      const inner = css.slice(brace + 1, end);
      out += selector + '{\n' + scopeBlock(inner, prefix) + '}\n';
      i = end + 1;
      continue;
    }

    const end = css.indexOf('}', brace);
    const body = css.slice(brace + 1, end);
    const scoped = selector
      .split(',')
      .map((s) => {
        s = s.trim();
        if (!s) return s;
        if (s === ':root') return null; // tokens ficam no theme.css global
        if (s === 'html') return null;
        if (s === 'body') return `.${prefix}`; // body -> wrapper da pagina
        if (s === '*') return `.${prefix} *`;
        return `.${prefix} ${s}`;
      })
      .filter(Boolean)
      .join(',');
    if (scoped) out += scoped + '{' + body + '}\n';
    i = end + 1;
  }
  return out;
}

function matchBrace(css, openIdx) {
  let depth = 0;
  for (let j = openIdx; j < css.length; j++) {
    if (css[j] === '{') depth++;
    else if (css[j] === '}') {
      depth--;
      if (depth === 0) return j;
    }
  }
  return css.length - 1;
}

const result =
  `/* GERADO por scripts/scope-css.js a partir de ${htmlPath.split(/[\\/]/).pop()} — nao editar na mao */\n` +
  scopeBlock(styles, pageClass);
fs.writeFileSync(outPath, result);
console.log(`ok: ${outPath} (${result.length} bytes)`);
