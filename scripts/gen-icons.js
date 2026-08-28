// Gera os PNGs do brand kit (apple touch icon, OG image, avatar) a partir
// dos SVGs. Rodar uma vez: node scripts/gen-icons.js
const sharp = require('sharp');
const path = require('path');

const GRAD = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f2913c"/><stop offset="100%" stop-color="#d9631c"/></linearGradient>`;

const MARK_CREAM = `<rect x="-31.0" y="20.5" width="62" height="11" rx="5.5" fill="#fffaf1"/><rect x="-21.5" y="2.5" width="43" height="11" rx="5.5" fill="#fffaf1"/><rect x="-12.0" y="-15.5" width="24" height="11" rx="5.5" fill="#fffaf1"/><circle cx="0" cy="-35" r="13" fill="#fffaf1"/>`;

const WORD = (grad) =>
  `<g fill="none" stroke="#fffaf1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="50" r="20"/><path d="M0 30V92"/><circle cx="70" cy="50" r="20"/><path d="M90 30V70"/><circle cx="120" cy="50" r="20"/><path d="M140 8V70"/><path d="M181.5 66.4A20 20 0 1 1 181.5 33.6"/><circle cx="213" cy="50" r="20"/><circle cx="213" cy="50" r="7" fill="url(#${grad})" stroke="none"/><path d="M245 30V70"/><path d="M245 45A16 16 0 0 1 269 32"/><path d="M281 50H321"/><path d="M321.0 50.0A20 20 0 1 0 310.4 67.7"/></g>`;

const APPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs>${GRAD('g')}<pattern id="tp" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.47" fill="#fff" fill-opacity=".26"/></pattern></defs><rect width="180" height="180" rx="39.6" fill="url(#g)"/><rect width="180" height="180" rx="39.6" fill="url(#tp)"/><g transform="translate(90,90) scale(1.332) translate(0,8.25)">${MARK_CREAM}</g></svg>`;

const OG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><defs>${GRAD('g')}<pattern id="bp" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.7" fill="#fffaf1" fill-opacity=".26"/></pattern><radialGradient id="bgl" cx="80%" cy="2%" r="70%"><stop offset="0%" stop-color="#f2913c" stop-opacity=".5"/><stop offset="100%" stop-color="#f2913c" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#2b1e13"/><rect width="1200" height="630" fill="url(#bp)"/><rect width="1200" height="630" fill="url(#bgl)"/><g transform="translate(376,262) scale(1.05)"><g transform="translate(33.3,50) scale(0.88) translate(0,8.25)"><rect x="-31.0" y="20.5" width="62" height="11" rx="5.5" fill="#fffaf1"/><rect x="-21.5" y="2.5" width="43" height="11" rx="5.5" fill="#fffaf1"/><rect x="-12.0" y="-15.5" width="24" height="11" rx="5.5" fill="#fffaf1"/><circle cx="0" cy="-35" r="13" fill="url(#g)"/></g><g transform="translate(94.1,0)">${WORD('g')}</g></g></svg>`;

const AVATAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>${GRAD('g')}<pattern id="ap" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#fff" fill-opacity=".26"/></pattern></defs><circle cx="256" cy="256" r="256" fill="url(#g)"/><circle cx="256" cy="256" r="256" fill="url(#ap)"/><g transform="translate(256,256) scale(3.5) translate(0,8.25)">${MARK_CREAM}</g></svg>`;

const out = (f) => path.join(__dirname, '..', 'public', f);

(async () => {
  await sharp(Buffer.from(APPLE), { density: 300 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
  console.log('ok apple-touch-icon.png (180x180)');
  await sharp(Buffer.from(OG), { density: 300 }).resize(1200, 630).png().toFile(out('og.png'));
  console.log('ok og.png (1200x630)');
  await sharp(Buffer.from(AVATAR), { density: 300 }).resize(1024, 1024).png().toFile(out('avatar.png'));
  console.log('ok avatar.png (1024x1024)');
})().catch((e) => {
  console.error('[X]', e.message);
  process.exit(1);
});
