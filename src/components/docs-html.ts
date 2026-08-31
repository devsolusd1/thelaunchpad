/* Conteudo do docs — portado do mockup docs.html do John.
 * Top bar e logica (rotas por hash, TOC, busca) ficam no DocsClient. */

export function docsHtml(FEE: number | string): string {
  return `
<div class="shell">
  <nav class="side"><div class="grp"><span class="gt">Start here</span><a href="#intro" data-p="intro">Introduction</a><a href="#quickstart" data-p="quickstart">Quickstart</a></div><div class="grp"><span class="gt">Core concepts</span><a href="#concepts" data-p="concepts">Launchpads</a><a href="#curve" data-p="curve">The bonding curve</a><a href="#fees" data-p="fees">Fees and the 50/50 split</a></div><div class="grp"><span class="gt">For pad owners</span><a href="#owner-create" data-p="owner-create">Creating your pad</a><a href="#pad-token" data-p="pad-token">Your pad token</a><a href="#dashboard" data-p="dashboard">Owner dashboard</a></div><div class="grp"><span class="gt">For token creators</span><a href="#creators" data-p="creators">Launching on a pad</a></div><div class="grp"><span class="gt">$PAD</span><a href="#pad-token-economics" data-p="pad-token-economics">The platform token</a></div><div class="grp"><span class="gt">Guides</span><a href="#analytics" data-p="analytics">Analytics</a><a href="#attribution" data-p="attribution">Attribution</a></div><div class="grp"><span class="gt">Reference</span><a href="#security" data-p="security">Security and risk</a><a href="#faq" data-p="faq">FAQ</a><a href="#legal" data-p="legal">Legal</a></div></nav>
  <main>
    <article data-p="intro" hidden><div class="crumb">Start here<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Introduction</div><h1>Introduction</h1><p class="sub">What Padcore is, and what it is not</p>
<p class="lead">Padcore is a launchpad for launchpads. Instead of launching your token on someone else's platform and paying them a fee, you create your own launchpad — your subdomain, your brand, your curve — and you keep half of every trading fee that every token launched on it ever produces.</p>

<div class="note info"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-5"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>One sentence version</b>Anyone can spin up a token launchpad in a single transaction, and the person who created it earns 50% of the trading fees generated on it, forever.</div></div>

<h2 id="who">Who this is for</h2>
<div class="cards"><a class="card" href="#owner-create"><b>Pad owners</b><p>You have an audience, a community or a niche. You want the platform economics instead of the user economics.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg></span></a><a class="card" href="#creators"><b>Token creators</b><p>You want to launch a token on a curve, on a pad whose rules you can read before you commit.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg></span></a><a class="card" href="#fees"><b>Everyone else</b><p>You want to understand how the fees, the split and the $PAD burn actually work.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg></span></a></div>

<h2 id="stack">What it runs on</h2>
<p>Padcore is a front-end and a coordination layer. The economics live in audited third-party contracts.</p>
<div class="tw"><table><thead><tr><th>Layer</th><th>What it does</th><th>Who operates it</th></tr></thead><tbody><tr><td>Solana</td><td>Settlement. Every action is a transaction you can inspect.</td><td>Solana validators</td></tr><tr><td>Meteora DBC</td><td>The dynamic bonding curve each token trades on until graduation.</td><td>Meteora</td></tr><tr><td>DAMM v2</td><td>The pool liquidity migrates into at graduation, with the LP locked.</td><td>Meteora</td></tr><tr><td>Padcore</td><td>Configuration, subdomains, dashboards, fee accounting and payouts.</td><td>Padcore</td></tr></tbody></table></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>Padcore is non-custodial</b>We never hold your keys, your tokens or your funds. Every action is signed by you, in your wallet, and cannot be reversed by us afterwards.</div></div>

<h2 id="not">What Padcore is not</h2>
<ul>
<li>Not an exchange, broker or trading venue. We do not match orders or take the other side of trades.</li>
<li>Not an issuer. Every token you see was created by a user, not by us.</li>
<li>Not an endorsement. A pad or token appearing in the directory means nothing about its quality or the honesty of its creator.</li>
<li>Not investment advice. Nothing anywhere in this documentation is a recommendation to buy or sell anything.</li>
</ul>
</article><article data-p="quickstart" hidden><div class="crumb">Start here<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Quickstart</div><h1>Quickstart</h1><p class="sub">From wallet to live launchpad in about five minutes</p>
<p class="lead">Creating a launchpad takes one transaction. Everything below happens on a single screen at <code>/create</code>.</p>

<ol class="steps"><li><span class="sn">1</span><div><b>Connect the wallet that gets paid</b><p>Whatever wallet you connect becomes the pad owner. It is the address the payout process sends your half to, so connect the one you actually want the money in — this cannot be changed casually later.</p></div></li><li><span class="sn">2</span><div><b>Claim a subdomain</b><p>Lowercase letters, numbers and dashes. The subdomain is checked live and becomes your pad's permanent public address. Pick carefully: it is not editable, so existing links never break.</p></div></li><li><span class="sn">3</span><div><b>Set the curve</b><p>Trading fee, quote token, starting market cap and graduation market cap. These are written on-chain and become immutable.</p></div></li><li><span class="sn">4</span><div><b>Optionally launch a pad token</b><p>One checkbox creates your own token on your own curve, in the same transaction. Its trading fees pay you the same 50%.</p></div></li><li><span class="sn">5</span><div><b>Add branding and links</b><p>Logo, primary colour, description, socials, and a Google Analytics ID if you want the traffic in your own property. All editable at any time, no signature required.</p></div></li><li><span class="sn">6</span><div><b>Sign once</b><p>You pay the creation fee plus on-chain rent. Your pad is live at its subdomain immediately, though the subdomain can take a few minutes to propagate everywhere.</p></div></li></ol>

<div class="note ok"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/></svg></span><div><b>What you get</b>A public page at your subdomain, an owner dashboard, and a wallet that starts receiving half of every trading fee the moment the first token launches on your pad.</div></div>

<h2 id="cost">What it costs</h2>
<div class="tw"><table><thead><tr><th>Item</th><th>Amount</th><th>Where it goes</th></tr></thead><tbody><tr><td>Launchpad creation fee</td><td>Dynamic — currently ${FEE} SOL</td><td>100% into buying $PAD on the market and burning it</td></tr><tr><td>On-chain config rent</td><td>~0.03 SOL</td><td>Solana, to store your curve configuration</td></tr><tr><td>Network fees</td><td>Fractions of a cent</td><td>Solana validators</td></tr><tr><td>Pad token</td><td>Included</td><td>No additional fee if you create it in the same transaction</td></tr></tbody></table></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>The creation fee is non-refundable</b>Under all circumstances, including if you stop using the pad, if the pad is removed from our directory, or if the service is discontinued.</div></div>
</article><article data-p="concepts" hidden><div class="crumb">Core concepts<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Launchpads</div><h1>Launchpads</h1><p class="sub">The unit everything else hangs off</p>
<p class="lead">A launchpad — a "pad" — is a configured space where anyone can launch a token. It has an owner, a permanent address, a set of curve rules, and a fee split.</p>

<h2 id="anatomy">Anatomy of a pad</h2>
<div class="props"><div class="prop"><code>subdomain</code><span class="tag">permanent</span><p>Your public address, <code>yourname.padcore.io</code>. Chosen at creation, never changes.</p></div><div class="prop"><code>owner</code><span class="tag">wallet</span><p>The address that receives 50% of every trading fee. Changing it is possible but requires a signature and only affects future payouts.</p></div><div class="prop"><code>fee</code><span class="tag">2–10%, immutable</span><p>The trading fee every token on your pad charges.</p></div><div class="prop"><code>quote</code><span class="tag">SOL or USDC, immutable</span><p>What tokens on your pad trade against.</p></div><div class="prop"><code>startMc</code><span class="tag">$1,000–$20,000, immutable</span><p>Where each token's curve begins.</p></div><div class="prop"><code>graduationMc</code><span class="tag">≥ 1.5× start, immutable</span><p>Where the curve fills and liquidity migrates.</p></div><div class="prop"><code>branding</code><span class="tag">editable</span><p>Name, description, logo, primary colour, links, analytics.</p></div><div class="prop"><code>padToken</code><span class="tag">optional</span><p>Your own token, launched on your own curve.</p></div></div>

<div class="note info"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-5"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>Why some fields are immutable</b>The curve is written to an on-chain configuration when the pad is created. Nobody — including you, including us — can change the rules under a token that already launched. That is what makes a pad safe to launch on, and it is the reason the fee is a one-time decision.</div></div>

<h2 id="second">One wallet, many pads</h2>
<p>If you want different terms — a lower fee for a friendlier community, a higher one for a premium niche — create a second pad. There is no limit, and each one is an independent configuration with its own subdomain, branding and payouts.</p>
</article><article data-p="curve" hidden><div class="crumb">Core concepts<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>The bonding curve</div><h1>The bonding curve</h1><p class="sub">How price moves, and what graduation means</p>
<p class="lead">Every token on Padcore trades on a Meteora dynamic bonding curve. There is no order book and no market maker: price is a function of how much has been bought.</p>

<h2 id="life">The life of a token</h2>
<ol class="steps"><li><span class="sn">1</span><div><b>Launch</b><p>A creator picks a name, ticker and image. The token starts at your pad's starting market cap with no liquidity to seed and no presale.</p></div></li><li><span class="sn">2</span><div><b>The curve</b><p>Every buy moves price up along the curve, every sell moves it back down. The fee is charged on both sides.</p></div></li><li><span class="sn">3</span><div><b>Graduation</b><p>When the market cap reaches your pad's graduation target, the curve is complete.</p></div></li><li><span class="sn">4</span><div><b>Migration</b><p>Liquidity migrates into a DAMM v2 pool and the LP position is permanently locked. Nobody can pull it — not the creator, not the pad owner, not Padcore.</p></div></li></ol>

<div class="note ok"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/></svg></span><div><b>Why locked LP matters</b>The most common exit scam in this category is the creator withdrawing liquidity. On a graduated Padcore token that is structurally impossible, because the LP is locked at migration.</div></div>

<h2 id="choosing">Choosing your numbers</h2>
<div class="tw"><table><thead><tr><th>Setting</th><th>Range</th><th>How to think about it</th></tr></thead><tbody><tr><td>Trading fee</td><td>2–10%</td><td>The dial that decides your income per trade. High fees earn more per trade but push volume elsewhere; low fees attract traders but pay less. Most pads sit between 2% and 4%.</td></tr><tr><td>Starting market cap</td><td>$1,000 – $20,000</td><td>Lower starts feel cheaper and move faster. Higher starts filter out the least serious launches.</td></tr><tr><td>Graduation market cap</td><td>≥ 1.5× start</td><td>How far a token has to travel before liquidity locks. Further means more fee-generating volume on the way, but fewer tokens ever get there.</td></tr><tr><td>Quote token</td><td>SOL or USDC</td><td>SOL is the default for memecoins. USDC keeps prices legible when SOL itself is moving.</td></tr></tbody></table></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>There is no right answer</b>Anyone who tells you the optimal fee is guessing. The fee that works depends on your audience, and you cannot change it later — so decide before you sign, not after.</div></div>
</article><article data-p="fees" hidden><div class="crumb">Core concepts<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Fees and the 50/50 split</div><h1>Fees and the 50/50 split</h1><p class="sub">Where every cent goes</p>
<p class="lead">Every trade on a Padcore token pays the fee configured by the pad it launched on. That fee is split before it reaches anyone.</p>

<h2 id="split">The split</h2>
<div class="tw"><table><thead><tr><th>Share</th><th>Recipient</th><th>What happens to it</th></tr></thead><tbody><tr><td>50%</td><td>The launchpad owner</td><td>Paid to the owner's wallet. It is theirs. It never reaches Padcore for any purpose.</td></tr><tr><td>50%</td><td>Padcore</td><td>100% of it is spent buying $PAD on the open market and sending it to a dead address.</td></tr></tbody></table></div>

<div class="note info"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-5"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>Worked example</b>A token on a pad with a 3.5% fee does $100,000 of volume in a week. The fee generated is $3,500. The pad owner receives $1,750. The remaining $1,750 becomes $PAD bought on the market and burned. Illustrative only — real amounts depend entirely on real volume.</div></div>

<h2 id="payouts">How payouts reach you</h2>
<p>Fees accrue on-chain as partner fees. A public process splits and distributes them on a schedule, and every payout is an ordinary transaction with a signature listed in your pad's public fee history.</p>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>Amounts are not guaranteed</b>Fee income depends entirely on trading activity, which nobody controls or forecasts. It can be, and for most pads at some point will be, zero. Distribution can also be delayed by network congestion or third-party outages.</div></div>

<h2 id="creation">The creation fee</h2>
<p>Separate from trading fees, creating a pad costs a dynamic fee — currently ${FEE} SOL. 100% of it goes into buying and burning $PAD. It is not held in a treasury and is not refundable.</p>
</article><article data-p="owner-create" hidden><div class="crumb">For pad owners<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Creating your pad</div><h1>Creating your pad</h1><p class="sub">Every field on the create screen, explained</p>
<p class="lead">The create screen is one page with four sections. Only the curve section is permanent.</p>

<h2 id="identity">Identity</h2>
<div class="props"><div class="prop"><code>Subdomain</code><span class="tag">permanent</span><p>Lowercase letters, numbers and dashes, up to 32 characters. Checked live for availability.</p></div><div class="prop"><code>Name</code><span class="tag">editable</span><p>Display name shown on your page and in the directory.</p></div><div class="prop"><code>Description</code><span class="tag">editable</span><p>One line. Shown under your name and in the directory card.</p></div><div class="prop"><code>Logo</code><span class="tag">editable</span><p>Up to 1.5 MB. Square images work best; anything else is cropped to a square with rounded corners.</p></div><div class="prop"><code>Primary colour</code><span class="tag">editable</span><p>Repaints your pad's public page — header, buttons, curve, highlights. It does not affect Padcore itself.</p></div></div>

<h2 id="curve-fields">Curve</h2>
<div class="note danger"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span><div><b>This section cannot be edited after you sign</b>Fee, quote token, starting market cap and graduation market cap are written to an immutable on-chain configuration. Read them twice.</div></div>

<h2 id="extras">Links and tracking</h2>
<p>Twitter/X, Telegram and a website, plus an optional Google Analytics measurement ID. All editable at any time, none of them requires a signature.</p>

<h2 id="domain">Your own domain</h2>
<div class="note info"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-5"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>Coming soon</b>Pointing a domain you already own at your pad is not live yet. When it ships it will be a single CNAME record, the certificate will be issued automatically, and your subdomain will keep working as a mirror so existing links never break.</div></div>
</article><article data-p="pad-token" hidden><div class="crumb">For pad owners<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Your pad token</div><h1>Your pad token</h1><p class="sub">The optional token on your own curve</p>
<p class="lead">When you create a pad you can create a token for it in the same transaction, at no additional fee.</p>

<h2 id="why">Why it exists</h2>
<p>A pad token trades on your own curve like any other token on your pad — which means <b>its trading fees pay you the same 50%</b>. It is the only token on your pad whose launch you fully control, and it gives your pad a face beyond its branding.</p>

<div class="note ok"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/></svg></span><div><b>It is pinned</b>While it is on the curve, your pad token is displayed above the grid on your public page, marked as the pad token.</div></div>

<h2 id="fields">What you set</h2>
<div class="props"><div class="prop"><code>Token name</code><span class="tag">editable before signing</span><p>Usually the same as the pad, but it does not have to be.</p></div><div class="prop"><code>Ticker</code><span class="tag">editable before signing</span><p>Up to 8 characters, letters and numbers, automatically uppercased.</p></div></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>It is still a token on a curve</b>Your pad token is subject to exactly the same risks as every other token on Padcore. Creating one does not make it valuable, and nothing about it is guaranteed.</div></div>

<h2 id="skip">Skipping it</h2>
<p>Turn the toggle off and the pad is created without a token. There is currently no way to add one to an existing pad in the same transaction, so if you are unsure, it costs nothing to include it.</p>
</article><article data-p="dashboard" hidden><div class="crumb">For pad owners<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Owner dashboard</div><h1>Owner dashboard</h1><p class="sub">What you can change, what you cannot</p>
<p class="lead">Your dashboard is where you manage branding and tracking — those update instantly and for free. Anything touching money or the chain requires a signature.</p>

<div class="tw"><table><thead><tr><th>Section</th><th>Editable</th><th>Requires signature</th></tr></thead><tbody><tr><td>Overview and stats</td><td>—</td><td>No</td></tr><tr><td>Fees and payouts</td><td>View history</td><td>No</td></tr><tr><td>Branding, colour, logo, links</td><td>Yes</td><td>Yes, one message</td></tr><tr><td>Curve</td><td><b>No — immutable</b></td><td>N/A</td></tr><tr><td>Pad token</td><td>View only</td><td>N/A</td></tr><tr><td>Featured token</td><td>Yes</td><td>Yes, one message</td></tr><tr><td>Subdomain</td><td><b>No — permanent</b></td><td>N/A</td></tr><tr><td>Analytics ID</td><td>Yes</td><td>Yes, one message</td></tr><tr><td>X verification</td><td>Yes</td><td>Yes, one message</td></tr></tbody></table></div>

<h2 id="fees-tab">Fees and payouts</h2>
<p>Shows the full payout history with transaction signatures, on your pad's public dashboard. Payouts run automatically on a schedule.</p>

<div class="note info"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-5"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>Hiding is not deleting</b>Removing a pad from the Padcore directory does not affect on-chain state. The subdomain keeps working and tokens keep trading regardless of anything in this dashboard.</div></div>
</article><article data-p="creators" hidden><div class="crumb">For token creators<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Launching on a pad</div><h1>Launching on a pad</h1><p class="sub">What to check before you commit</p>
<p class="lead">Launching a token means picking a pad and accepting its rules. Read them first — they are printed on every pad page and cannot be changed afterwards.</p>

<h2 id="check">Check these four things</h2>
<div class="tw"><table><thead><tr><th>What</th><th>Where</th><th>Why it matters</th></tr></thead><tbody><tr><td>Trading fee</td><td>The chip on the pad's header</td><td>It is charged on every buy and every sell, on your token, forever.</td></tr><tr><td>Quote token</td><td>Same header</td><td>Determines what your token trades against.</td></tr><tr><td>Curve range</td><td>Same header</td><td>Start and graduation market caps decide how far the token has to travel.</td></tr><tr><td>Who owns the pad</td><td>Footer of the pad page</td><td>Half of every fee your token generates goes to that wallet.</td></tr></tbody></table></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>The pad owner earns from your token</b>That is the model, and it is not hidden. What you get in exchange is a curve with locked LP at graduation and a pad that has an incentive to bring traffic.</div></div>

<h2 id="after">After graduation</h2>
<p>Liquidity migrates to a DAMM v2 pool with the LP locked permanently. Your token continues to trade there, outside the curve.</p>

<div class="note danger"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span><div><b>Most tokens go to zero</b>This is not pessimism, it is the base rate in this category. Launch with money you can afford to lose entirely, and never tell anyone else otherwise.</div></div>
</article><article data-p="pad-token-economics" hidden><div class="crumb">$PAD<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>The platform token</div><h1>The platform token</h1><p class="sub">Supply, buyback and burn</p>
<p class="lead">$PAD has one job: to absorb the revenue Padcore makes. Every fee that reaches the platform is spent buying it on the open market and sending it somewhere unreachable.</p>

<div class="tw"><table><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody><tr><td>Total supply</td><td>1,000,000,000, fixed</td></tr><tr><td>Mint authority</td><td>Revoked — supply cannot increase</td></tr><tr><td>Contract address</td><td>Published at launch</td></tr><tr><td>Revenue burned</td><td>100% of what reaches Padcore</td></tr><tr><td>Burn destination</td><td>An address with no known private key</td></tr></tbody></table></div>

<h2 id="sources">Where the burned revenue comes from</h2>
<ol class="steps"><li><span class="sn">1</span><div><b>The creation fee</b><p>100% of every launchpad creation fee.</p></div></li><li><span class="sn">2</span><div><b>The platform's half of trading fees</b><p>From tokens launched by third parties, on launchpads owned by third parties. The launchpad owner's half is theirs and never reaches Padcore.</p></div></li></ol>

<h2 id="how">How a burn happens</h2>
<ol class="steps"><li><span class="sn">1</span><div><b>Only our share arrives</b><p>The launchpad owner's half is paid straight to their wallet and never touches this account.</p></div></li><li><span class="sn">2</span><div><b>A bot buys on the open market</b><p>No treasury allocation, no minted tokens, no private deal. The buy competes for the same liquidity as anyone else's.</p></div></li><li><span class="sn">3</span><div><b>It goes somewhere unreachable</b><p>The $PAD is sent to a dead address, and every swap and transfer leaves a public signature listed in the burn ledger.</p></div></li></ol>

<div class="note danger"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span><div><b>What $PAD is not</b>It is not a share, not a claim on revenue, not a yield product, not governance and not a promise about price. Burning is a use of revenue, not a distribution of it. No holder is entitled to any payment because they hold $PAD, and the token may lose all of its value.</div></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>Beware of anything claiming to be $PAD before launch</b>The contract address will be published on this site. Anything circulating before then is not ours.</div></div>
</article><article data-p="analytics" hidden><div class="crumb">Guides<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Analytics</div><h1>Analytics</h1><p class="sub">Putting your pad's traffic in your own property</p>
<p class="lead">Pad owners can connect their own Google Analytics property. Padcore does not inject any third-party script on your behalf.</p>

<ol class="steps"><li><span class="sn">1</span><div><b>Create a GA4 property</b><p>In Google Analytics, create a property for your pad and copy its measurement ID.</p></div></li><li><span class="sn">2</span><div><b>Paste it into your dashboard</b><p>Analytics section, measurement ID field. It looks like G-XXXXXXXXXX.</p></div></li><li><span class="sn">3</span><div><b>Save</b><p>gtag.js starts loading on your pad's pages. Clearing the field removes it.</p></div></li></ol>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>You become the data controller</b>If you connect analytics, you are responsible for your own privacy notice and for any consent your users' jurisdictions require, including under the GDPR and the LGPD. See the Terms.</div></div>

<div class="code"><span class="lang">html</span><button class="cp">Copy</button><pre>&lt;!-- what gets injected, and nothing else --&gt;
&lt;script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"&gt;&lt;/script&gt;</pre></div>
</article><article data-p="attribution" hidden><div class="crumb">Guides<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Attribution</div><h1>Attribution</h1><p class="sub">The Powered by Padcore badge</p>
<p class="lead">Pages served on Padcore subdomains display a "Powered by Padcore" badge in the corner. It links back to the platform.</p>

<div class="note danger"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span><div><b>Removing it is a breach</b>Removing, obscuring or misrepresenting the attribution violates the Terms of Service and can result in your pad being removed from our interfaces.</div></div>

<p>Both a light and a dark version are provided; use whichever contrasts with your pad's primary colour.</p>
</article><article data-p="security" hidden><div class="crumb">Reference<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Security and risk</div><h1>Security and risk</h1><p class="sub">Read this before you commit anything</p>
<div class="note danger"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span><div><b>You can lose everything you commit</b>Tokens on bonding curves are highly speculative, frequently illiquid, and routinely go to zero. Do not commit funds you cannot afford to lose entirely.</div></div>

<h2 id="risks">Risks that apply to everyone</h2>
<div class="tw"><table><thead><tr><th>Risk</th><th>What it means</th></tr></thead><tbody><tr><td>Total loss</td><td>Most tokens in this category end worthless. This is the base rate, not a worst case.</td></tr><tr><td>Bad actors</td><td>Creators may abandon projects, sell their holdings, impersonate brands or run coordinated schemes. Padcore does not screen for this.</td></tr><tr><td>Smart contract risk</td><td>Audits reduce but never eliminate the possibility of a vulnerability in any contract in the stack.</td></tr><tr><td>Irreversibility</td><td>Signed transactions cannot be cancelled, reversed or refunded by anyone.</td></tr><tr><td>Regulatory risk</td><td>Rules applying to tokens are unsettled and change. Access may become restricted where you live.</td></tr><tr><td>Front-end risk</td><td>Interfaces can be spoofed. Always verify the domain and read what a transaction does before signing.</td></tr></tbody></table></div>

<h2 id="hygiene">Basic hygiene</h2>
<ul>
<li>Check the domain character by character before connecting a wallet.</li>
<li>Read the transaction in your wallet. If it asks for permissions the action does not need, reject it.</li>
<li>Use a separate wallet for launching and trading than the one holding anything you care about.</li>
<li>Nobody at Padcore will ever ask for your seed phrase, for any reason.</li>
</ul>
</article><article data-p="faq" hidden><div class="crumb">Reference<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>FAQ</div><h1>FAQ</h1><p class="sub">The questions that come up most</p>
<h2 id="pads">Pads</h2>
<details><summary>Can I change my fee after creating the pad?</summary><p>No. The fee, quote token and market cap range are immutable on-chain configuration. Create a second pad if you need different terms — one wallet can own many.</p></details>
<details><summary>Can I change my subdomain?</summary><p>No. It is permanent so existing links, shared charts and embeds never break.</p></details>
<details><summary>What happens if I stop using my pad?</summary><p>Nothing changes on-chain. Tokens keep trading and you keep receiving your half of the fees they generate, whether or not you ever open the dashboard again.</p></details>
<details><summary>Can Padcore take my pad away?</summary><p>We can remove it from our directory and interfaces under the Terms. We cannot touch on-chain state: the configuration, the tokens and the fee split continue to exist regardless.</p></details>

<h2 id="money">Money</h2>
<details><summary>When do I get paid?</summary><p>Automatically, on a schedule, whenever your accrued fees pass the minimum payout amount. Every payout appears in your pad's public fee history.</p></details>
<details><summary>Is the creation fee refundable?</summary><p>No, under any circumstances.</p></details>
<details><summary>Who pays gas?</summary><p>Whoever signs the transaction. Padcore does not sponsor transactions.</p></details>
<details><summary>Do I owe taxes on fee income?</summary><p>Almost certainly, and it is entirely your responsibility to determine, report and pay it. Padcore does not provide tax advice or documentation.</p></details>

<h2 id="token-faq">$PAD</h2>
<details><summary>Does holding $PAD entitle me to anything?</summary><p>No. It carries no claim on revenue, profit, assets or governance.</p></details>
<details><summary>Can the supply increase?</summary><p>No. It is fixed at 1,000,000,000 with the mint authority revoked.</p></details>
<details><summary>What if the burn process fails?</summary><p>Nothing is lost. Fees stay in the account until the next successful run, and failed attempts are visible on-chain like any other transaction.</p></details>
</article><article data-p="legal" hidden><div class="crumb">Reference<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>Legal</div><h1>Legal</h1><p class="sub">Policies and where to find them</p>
<p class="lead">Your use of Padcore is governed by the <a href="/terms">Terms of Service</a>. This documentation explains how things work; the Terms govern what you agree to.</p>

<div class="tw"><table><thead><tr><th>Document</th><th>Covers</th><th>Status</th></tr></thead><tbody><tr><td>Terms of Service</td><td>Eligibility, obligations, fees, disclaimers, liability, disputes</td><td>Published</td></tr><tr><td>Privacy Policy</td><td>What data is collected and how it is handled</td><td>Coming soon</td></tr><tr><td>Risk Disclosure</td><td>The risks of using bonding curves and speculative tokens</td><td>Coming soon</td></tr></tbody></table></div>

<h2 id="highlights">Clauses worth reading twice</h2>
<div class="tw"><table><thead><tr><th>Topic</th><th>Why it matters to you</th></tr></thead><tbody><tr><td>Pad owner obligations</td><td>You are responsible for your pad, its content and your users. You must not describe it as an investment or claim we endorse it.</td></tr><tr><td>Fees and the revenue split</td><td>Figures in simulators and examples are illustrative, never projections.</td></tr><tr><td>Risk disclosure</td><td>The full list of ways this can go wrong.</td></tr><tr><td>Attribution</td><td>Removing the Powered by badge is a breach.</td></tr><tr><td>Analytics</td><td>If you connect analytics, you become the data controller.</td></tr><tr><td>Limitation of liability</td><td>There is a cap, and you should know what it is.</td></tr></tbody></table></div>

<div class="note warn"><span class="ni"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span><div><b>Nothing here is legal advice</b>This documentation is descriptive. Where it conflicts with the Terms of Service, the Terms govern.</div></div>
</article>
    <div class="pn" id="pn"></div>
  </main>
  <aside class="toc"><div id="toc"></div></aside>
</div>
`;
}
