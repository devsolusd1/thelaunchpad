/* Conteudo da pagina $PAD — portado do mockup token (2).html do John.
 * Nav e contadores ficam no React (PadTokenClient); CSS em pg-padtoken.css. */

export const padTokenHtml = `
<div class="bgfx"></div>

<div class="wrap">

<section class="hero">
  <span class="eyebrow">The platform token</span>
  <h1><em>$PAD</em></h1>
  <p class="lede">Padcore earns in two ways: a fee when someone creates a launchpad, and a share of the trading fees from tokens that <b>other people</b> launch on those launchpads. <b>100% of what reaches Padcore is spent buying $PAD on the open market and burning it.</b> The other half of every trading fee never reaches us — it belongs to whoever created that launchpad.</p>
  <div class="ca">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/></svg>
    Contract address published at launch — beware of anything claiming to be $PAD before then
  </div>
  <div class="stats">
    <div><div class="n">1,000,000,000</div><div class="l">Fixed supply</div></div>
    <div><div class="n hot" data-to="4182904">0</div><div class="l">$PAD burned</div></div>
    <div><div class="n" data-to="995817096">0</div><div class="l">In circulation</div></div>
    <div><div class="n">141.5 SOL</div><div class="l">Spent buying it back</div></div>
  </div>
  <span class="demo">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>
    Figures on this page are illustrative until launch
  </span>
</section>

<section>
  <span class="eyebrow">Where the revenue comes from</span>
  <h2>Half is never ours to begin with</h2>
  <p class="sub">Tokens on Padcore are created by third parties, on launchpads created by other third parties. Every trade pays a fee, and that fee is split before it reaches anyone: half goes to the person who created the launchpad, half reaches the platform. All of the platform's half is burned.</p>

  <div class="diagram">
    <svg viewBox="0 0 1040 430" role="img" aria-label="Creation fees and the platform half of trading fees are burned; the other half belongs to the launchpad creator">
      <defs>
        <linearGradient id="coin" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0%" stop-color="#ffd79b"/><stop offset="55%" stop-color="#f2913c"/><stop offset="100%" stop-color="#c8560f"/></linearGradient>
        <linearGradient id="hot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f2913c"/><stop offset="100%" stop-color="#d9631c"/></linearGradient>
        <filter id="soft" x="-45%" y="-45%" width="190%" height="190%">
          <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#8a4a12" flood-opacity=".16"/></filter>
      </defs>
      <g fill="none" stroke-linecap="round">
        <path id="p1" d="M312 96 C 470 96, 520 176, 690 176" stroke="var(--soft)" stroke-width="16"/>
        <path id="p2" d="M312 300 H 404" stroke="var(--soft)" stroke-width="16"/>
        <path id="p3" d="M436 300 C 540 300, 560 202, 690 202" stroke="var(--soft)" stroke-width="16"/>
        <path d="M436 300 C 520 300, 540 366, 636 366" stroke="var(--panel2)" stroke-width="14"/>
      </g>
      <g>
        <circle r="9" fill="url(#coin)"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#p1"/></animateMotion></circle>
        <circle r="9" fill="url(#coin)"><animateMotion dur="2.6s" begin="-1.3s" repeatCount="indefinite"><mpath href="#p1"/></animateMotion></circle>
        <circle r="9" fill="url(#coin)"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p2"/></animateMotion></circle>
        <circle r="9" fill="url(#coin)"><animateMotion dur="2.4s" repeatCount="indefinite"><mpath href="#p3"/></animateMotion></circle>
        <circle r="9" fill="url(#coin)"><animateMotion dur="2.4s" begin="-1.2s" repeatCount="indefinite"><mpath href="#p3"/></animateMotion></circle>
      </g>
      <circle cx="516" cy="330" r="8" fill="var(--sand)"/><circle cx="578" cy="356" r="8" fill="var(--sand)"/>
      <g filter="url(#soft)"><rect x="14" y="52" width="298" height="88" rx="20" fill="#fff" stroke="var(--line2)"/></g>
      <text x="40" y="88" font-size="15" font-weight="900" fill="var(--accent)">100%</text>
      <text x="98" y="88" font-size="15" font-weight="800" fill="var(--ink)">of the creation fee</text>
      <text x="40" y="114" font-size="12.5" font-weight="700" fill="var(--muted)">paid once, when a launchpad is created</text>
      <g filter="url(#soft)"><rect x="14" y="246" width="298" height="106" rx="20" fill="#fff" stroke="var(--line2)"/></g>
      <text x="40" y="282" font-size="15" font-weight="800" fill="var(--ink)">Trading fees</text>
      <text x="40" y="306" font-size="12.5" font-weight="700" fill="var(--muted)">on tokens launched by third parties,</text>
      <text x="40" y="326" font-size="12.5" font-weight="700" fill="var(--muted)">on launchpads owned by third parties</text>
      <circle cx="420" cy="300" r="15" fill="var(--paper)" stroke="var(--accent)" stroke-width="3"/>
      <text x="420" y="258" text-anchor="middle" font-size="11.5" font-weight="900" fill="var(--muted)">SPLIT</text>
      <text x="566" y="234" text-anchor="middle" font-size="14" font-weight="900" fill="var(--accent)">50% platform</text>
      <text x="520" y="404" font-size="14" font-weight="900" fill="var(--sand)">50% launchpad owner</text>
      <g filter="url(#soft)"><rect x="636" y="336" width="270" height="60" rx="18" fill="var(--panel)" stroke="var(--line2)"/></g>
      <text x="771" y="362" text-anchor="middle" font-size="13.5" font-weight="900" fill="#6f5c46">Never reaches Padcore</text>
      <text x="771" y="382" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)">paid straight to the pad's creator</text>
      <g filter="url(#soft)"><circle cx="800" cy="188" r="86" fill="url(#hot)"/></g>
      <g stroke="#2b1e13" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"
         transform="translate(776,156) scale(2)">
        <path d="M12 2.8c.5 3.1 2.2 4.9 3.9 6.5 1.7 1.7 2.9 3.5 2.9 5.7a6.8 6.8 0 0 1-13.6 0c0-1.5.5-2.8 1.4-3.9.2 1.2.8 2.1 1.8 2.5C5.8 8.8 9.5 5.6 12 2.8Z"/>
        <path d="M12 14.4c1 1.2 2 2 2 3.3a2 2 0 0 1-4 0c0-1.3 1-2.1 2-3.3Z"/>
      </g>
      <text x="800" y="300" text-anchor="middle" font-size="14" font-weight="900" fill="var(--accent)">BOUGHT &amp; BURNED</text>
      <text x="800" y="322" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)">100% of what reaches us</text>
    </svg>
  </div>

  <div class="mflow">
    <div class="mnode"><strong>100% of the creation fee</strong><small>paid when a launchpad is created</small></div>
    <div class="marrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m6 13 6 6 6-6"/></svg></div>
    <div class="mnode"><strong>Trading fees</strong><small>on tokens launched by third parties</small></div>
    <div class="marrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m6 13 6 6 6-6"/></svg></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="mnode"><strong>50%</strong><small>launchpad owner · never ours</small></div>
      <div class="mnode hot"><strong>50%</strong><small>platform · 100% burned</small></div>
    </div>
  </div>
</section>

<section>
  <span class="eyebrow">The mechanism</span>
  <h2>How a burn actually happens</h2>
  <p class="sub">Nothing here is discretionary, and nothing is taken from anyone's share. Three steps, all ordinary transactions you can look up yourself.</p>
  <div class="steps" style="grid-template-columns:repeat(3,1fr)">
        <div class="step"><span class="n">01</span><h3>Only our share arrives</h3>
          <p>The launchpad owner's half is paid straight to their wallet and never touches this account. What lands here is the creation fee plus the platform's half.</p></div>
        <div class="step"><span class="n">02</span><h3>A bot buys on the open market</h3>
          <p>No treasury allocation, no minted tokens, no private deal. The buy competes for the same liquidity as anyone else's.</p></div>
        <div class="step"><span class="n">03</span><h3>It goes somewhere unreachable</h3>
          <p>The $PAD is sent to an address with no private key, and every swap and transfer leaves a public signature.</p></div>
      </div>
</section>

<section>
  <span class="eyebrow">Supply</span>
  <h2>One direction only</h2>
  <p class="sub">Supply is fixed at 1,000,000,000 with the mint authority revoked, so the only movement possible is downward. Each step below is one burn.</p>
  <div class="chart">
    <svg viewBox="0 0 1160 260" role="img" aria-label="Step chart showing circulating supply decreasing with each burn">
      <g stroke="var(--line)" stroke-width="1" stroke-dasharray="4 8">
        <line x1="90" y1="60" x2="1110" y2="60"/><line x1="90" y1="120" x2="1110" y2="120"/>
        <line x1="90" y1="180" x2="1110" y2="180"/>
      </g>
      <text x="76" y="64" text-anchor="end" font-size="12" font-weight="800" fill="var(--muted)">1.000B</text>
      <text x="76" y="124" text-anchor="end" font-size="12" font-weight="800" fill="var(--muted)">0.997B</text>
      <text x="76" y="184" text-anchor="end" font-size="12" font-weight="800" fill="var(--muted)">0.994B</text>
      <g fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M90 60 H236"/><path d="M236 60 V86"/><path d="M236 86 H381"/><path d="M381 86 V104"/><path d="M381 104 H527"/><path d="M527 104 V130"/><path d="M527 130 H673"/><path d="M673 130 V152"/><path d="M673 152 H819"/><path d="M819 152 V176"/><path d="M819 176 H964"/><path d="M964 176 V198"/><path d="M964 198 H1110"/>
      </g>
      <circle cx="1110" cy="198" r="7" fill="var(--accent)"/>
      <text x="1096" y="228" text-anchor="end" font-size="12.5" font-weight="900" fill="var(--accent)">995,817,096 today</text>
      <line x1="90" y1="230" x2="1110" y2="230" stroke="var(--line2)"/>
    </svg>
    <div class="legend"><span><i></i>Circulating supply</span><span>Each vertical drop is one executed burn · never reverses</span></div>
  </div>
</section>

<section>
  <span class="eyebrow">Proof</span>
  <h2>The burn ledger</h2>
  <p class="sub">Every execution, with its signature. If it is not in this list with a hash next to it, it did not happen.</p>
  <div class="tbl">
    <div class="tr"><span>Date</span><span>SOL spent</span><span>$PAD burned</span><span>Transaction</span></div>
    <div class="tr"><span>Mar 22</span><span>11.4 SOL</span><span class="amt">341,208</span><a href="#"><code>5Jd8…q2Xk</code></a></div>
        <div class="tr"><span>Mar 15</span><span>9.8 SOL</span><span class="amt">294,517</span><a href="#"><code>9Kmt…4Vbn</code></a></div>
        <div class="tr"><span>Mar 08</span><span>14.2 SOL</span><span class="amt">428,940</span><a href="#"><code>2Wne…8Rdq</code></a></div>
        <div class="tr"><span>Mar 01</span><span>8.1 SOL</span><span class="amt">243,662</span><a href="#"><code>7Ftz…Lp4x</code></a></div>
        <div class="tr"><span>Feb 22</span><span>12.6 SOL</span><span class="amt">379,104</span><a href="#"><code>4Rty…9Nbx</code></a></div>
        <div class="tr"><span>Feb 15</span><span>7.3 SOL</span><span class="amt">219,880</span><a href="#"><code>6Lkm…1Qzv</code></a></div>
  </div>
</section>

</div>

<section class="notband"><div class="wrap" style="padding-top:0;padding-bottom:0">
  <span class="eyebrow">Read this part</span>
  <h2>What $PAD is not</h2>
  <p class="sub">We would rather be blunt here than let anyone assume something we never said.</p>
  <div class="nots">
    <div class="not"><h4>Not a share</h4><p>It carries no ownership, equity or claim on the company or its assets.</p></div>
        <div class="not"><h4>Not a claim on revenue</h4><p>Burning is a use of revenue, not a distribution of it. No holder receives fees, profit or proceeds.</p></div>
        <div class="not"><h4>Not a yield product</h4><p>There is no staking, no interest, no return promised, offered or implied.</p></div>
        <div class="not"><h4>Not a promise about price</h4><p>Reducing supply is a mechanism, not a forecast. The token may be worth nothing.</p></div>
        <div class="not"><h4>Not governance</h4><p>Holding it grants no vote and no control over the platform or its parameters.</p></div>
  </div>
  <div class="legal">
    <p><b>$PAD is not offered as an investment.</b> It is a freely tradable token with no rights attached. Buying it is not a subscription, a deposit, a loan or an investment contract, and nothing on this page is an offer or solicitation to buy or sell any security or financial instrument in any jurisdiction.</p>
    <p><b>The revenue burned is Padcore's own.</b> It comes from fees the platform earns on activity created by independent third parties. The launchpad owner's half of every trading fee is theirs, is paid directly to them, and is never available to Padcore for any purpose.</p>
    <p><b>Burning is a use of revenue, not a distribution of it.</b> Fees are spent on the open market like any other buyer would spend them. No holder receives fees, dividends, profit or proceeds, and no one is entitled to any payment because they hold $PAD.</p>
    <p><b>No promise is made about value.</b> Reducing supply is a mechanism, not a forecast. The token may lose all of its value. Do not commit funds you cannot afford to lose entirely.</p>
    <p><b>Nothing here is financial, legal or tax advice.</b> Availability may be restricted in your jurisdiction and it is your responsibility to check. Your use of Padcore is governed by our <a href="/terms">Terms of Service</a>.</p>
  </div>
</div></section>

<div class="wrap">
<section>
  <span class="eyebrow">Questions</span>
  <h2>The parts people ask about</h2>
  <div style="margin-top:26px">
    <details><summary>Who runs the buyback bot?</summary><p>It is a public process: the fees accrue to an on-chain account and the swap and transfer are ordinary transactions anyone can inspect. We publish every signature in the ledger above.</p></details>
      <details><summary>What happens if it fails?</summary><p>Nothing is lost. Fees stay in the account until the next successful run. Failed attempts are visible on-chain like any other transaction.</p></details>
      <details><summary>Can the supply ever increase?</summary><p>No. The supply is fixed at 1,000,000,000 and the mint authority is revoked. There is no function to create more.</p></details>
      <details><summary>Does holding $PAD entitle me to anything?</summary><p>No. It carries no claim on revenue, profit, assets or governance. See the section below.</p></details>
  </div>
</section>
</div>

<footer class="foot"><div class="foot-in">
  <span>© 2026 Padcore · <a href="/terms">Terms</a></span>
  <span>Solana Mainnet · Meteora DBC</span>
</div></footer>
`;
