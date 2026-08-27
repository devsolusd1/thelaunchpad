/* GERADO por scripts/extract-html.js — nao editar na mao */
export function hiwHtml(DOMAIN: string): string {
  return `<section class="hiw"><div class="wrap">

  <div class="head">
    <div>
      <span class="eyebrow"><i></i>How it works</span>
      <h2>Watch a pad get built: <em>Nounspad</em></h2>
    </div>
    <p class="sub">The real flow, walked through with a made-up pad. <b>Your pad keeps half of every fee it ever produces.</b></p>
  </div>

  <!-- ── stepper ─────────────────────────────── -->
  <div class="tabs" id="tabs" role="tablist" style="--dwell:6.5s">
    <button class="tab" data-i="0" role="tab"><span class="n">01</span><span class="t">Connect wallet</span><i class="prog"></i></button>
    <button class="tab" data-i="1" role="tab"><span class="n">02</span><span class="t">Claim subdomain</span><i class="prog"></i></button>
    <button class="tab" data-i="2" role="tab"><span class="n">03</span><span class="t">Set your curve</span><i class="prog"></i></button>
    <button class="tab" data-i="3" role="tab"><span class="n">04</span><span class="t">Your pad token</span><i class="prog"></i></button>
    <button class="tab" data-i="4" role="tab"><span class="n">05</span><span class="t">Pay &amp; burn</span><i class="prog"></i></button>
    <button class="tab" data-i="5" role="tab"><span class="n">06</span><span class="t">Get paid</span><i class="prog"></i></button>
  </div>

  <div class="stage" id="stage">

    <!-- 01 -->
    <div class="slide" data-i="0">
      <div class="copy">
        <h3>Connect the wallet that gets paid</h3>
        <p>The wallet you connect becomes the owner of the pad — it's the address the payout bot sends your half to.</p>
        <span class="tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>About 10 seconds</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div><span class="mock-title">Select wallet</span></div>
        <div class="mock-body">
          <div class="wrow sel"><span class="glyph" style="background:#7c5cd6">P</span>
            <span><span class="wname">Phantom</span><span class="wmeta">Detected</span></span>
            <span class="check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></span></div>
          <div class="wrow"><span class="glyph" style="background:#e0902b">S</span>
            <span><span class="wname">Solflare</span><span class="wmeta">Detected</span></span></div>
          <div class="wrow"><span class="glyph" style="background:#4b4b4b">B</span>
            <span><span class="wname">Backpack</span><span class="wmeta">Install</span></span></div>
          <div class="connected"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>
            Owner wallet <code>7xKp…9fQa</code></div>
        </div>
      </div>
    </div>

    <!-- 02 -->
    <div class="slide" data-i="1">
      <div class="copy">
        <h3>Claim your subdomain</h3>
        <p>Logo, name, one line of description. The subdomain is checked live and becomes your pad's own address — creators land on your brand, not a shared feed.</p>
        <span class="tag">nounspad.${DOMAIN}</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div><span class="mock-title">Create launchpad</span></div>
        <div class="mock-body">
          <div class="brandrow">
            <div class="logo">
              <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
                <g stroke="#c8560f" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11.5" cy="12" r="4.6"/><path d="M11.5 7.4V5.4"/>
                  <circle cx="28.5" cy="12" r="4.6"/><circle cx="28.5" cy="12" r="1.9"/>
                  <circle cx="9.6" cy="27.4" r="3"/><path d="m11.8 29.6 4.4 4.4"/><path d="m14.4 32.2 1.4-1.4"/>
                  <path d="M23.6 33.4h9.6l-1.7-2.2v-2.5a3.1 3.1 0 0 0-6.2 0v2.5l-1.7 2.2Z"/>
                </g>
              </svg>
            </div>
            <div style="flex:1"><div class="flabel">Launchpad name</div><div class="finput">Nounspad</div></div>
          </div>
          <div class="field" style="margin-top:12px">
            <div class="flabel">Subdomain</div>
            <div class="finput focus"><span id="typed"></span><span class="caret"></span><span class="suffix">.${DOMAIN}</span>
              <span class="avail" id="avail"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>available</span></div>
          </div>
          <div class="field"><div class="flabel">Description</div>
            <div class="finput" style="color:var(--muted);font-weight:700">Plain objects, priced by degens.</div></div>
        </div>
      </div>
    </div>

    <!-- 03 -->
    <div class="slide" data-i="2">
      <div class="copy">
        <h3>Set the rules of your curve</h3>
        <p>Fee, starting market cap, quote token. Every token launched on Nounspad inherits these — the fee is the dial that decides what each trade pays you.</p>
        <span class="tag">2–10% · you choose once</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div><span class="mock-title">Curve settings</span></div>
        <div class="mock-body">
          <div class="curve">
            <svg viewBox="0 0 420 148" role="img" aria-label="Bonding curve from five thousand to sixty-nine thousand market cap">
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#d9631c" stop-opacity=".3"/><stop offset="100%" stop-color="#d9631c" stop-opacity="0"/></linearGradient>
                <linearGradient id="stroke" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stop-color="#f2913c"/><stop offset="100%" stop-color="#d9631c"/></linearGradient>
              </defs>
              <g stroke="var(--line)" stroke-width="1">
                <line x1="36" y1="118" x2="410" y2="118"/><line x1="36" y1="14" x2="36" y2="118"/>
                <line x1="36" y1="84" x2="410" y2="84" stroke-dasharray="3 6" opacity=".7"/>
                <line x1="36" y1="50" x2="410" y2="50" stroke-dasharray="3 6" opacity=".7"/>
              </g>
              <path class="area" d="M36 114 C 150 112, 250 92, 320 56 S 382 22, 402 18 L402 118 L36 118Z" fill="url(#fill)"/>
              <path class="trace" id="curvePath" d="M36 114 C 150 112, 250 92, 320 56 S 382 22, 402 18"
                    fill="none" stroke="url(#stroke)" stroke-width="3" stroke-linecap="round"/>
              <g>
                <circle r="12" fill="var(--accent)" opacity=".15"/>
                <circle r="5" fill="#fff" stroke="var(--accent)" stroke-width="3"/>
                <animateMotion dur="3.4s" repeatCount="indefinite"><mpath href="#curvePath"/></animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.84;1" dur="3.4s" repeatCount="indefinite"/>
              </g>
              <circle cx="36" cy="114" r="4" fill="var(--paper)" stroke="var(--sand)" stroke-width="2.5"/>
              <circle cx="402" cy="18" r="4.5" fill="var(--accent)"/>
              <text x="45" y="108" font-size="9.5" font-weight="800" fill="var(--muted)">start $5.0k</text>
              <text x="394" y="34" text-anchor="end" font-size="10" font-weight="900" fill="var(--accent)">graduates $69.0k →</text>
              <text x="222" y="140" text-anchor="middle" font-size="9" font-weight="800" fill="var(--sand)">every trade moves the price along this curve</text>
            </svg>
          </div>
          <div class="knobs">
            <div class="knob"><div class="k">Trading fee</div><div class="v hot">3.5%</div></div>
            <div class="knob"><div class="k">Start MC</div><div class="v">$5.0k</div></div>
            <div class="knob"><div class="k">Quote</div><div class="seg"><span class="on">SOL</span><span>USDC</span></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 04 -->
    <div class="slide" data-i="3">
      <div class="copy">
        <h3>Give your pad its own token</h3>
        <p>Tick one box and Nounspad launches <b>$NOUNS</b> in the same transaction — on your own curve, sitting right next to the tokens it hosts. Its trading fees pay you the same half.</p>
        <span class="tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>Optional · no extra fee</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div><span class="mock-title">Pad token</span></div>
        <div class="mock-body">
          <div class="tgl-row">
            <span class="tgl"><i></i></span>
            <span><span class="tt">Launch a token for this pad</span><br><span class="ts">Created in the same transaction</span></span>
          </div>
          <div class="tok-fields">
            <div><div class="flabel">Token name</div><div class="finput">Nounspad</div></div>
            <div><div class="flabel">Ticker</div>
              <div class="finput focus"><span class="tkr"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="3"/></svg></span>$NOUNS</div></div>
          </div>
          <div class="callout">
            <span class="ci"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg></span>
            <p>$NOUNS trades on your own curve — so <b>you collect 50% of its fees too</b>, on top of every token others launch here.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 05 -->
    <div class="slide" data-i="4">
      <div class="copy">
        <h3>Pay 0.5 SOL — and watch it burn</h3>
        <p>One transaction, no subscription. The fee doesn't sit in a treasury: it buys the platform token on the market and sends it to a dead address.</p>
        <span class="tag">100% of the fee is burned</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div>
          <span class="urlbar">🔒 <b>nounspad</b>.${DOMAIN}</span><span class="live"><i></i>LIVE</span></div>
        <div class="mock-body">
          <div class="rrow"><span class="m">Launchpad creation fee</span><span>0.5 SOL</span></div>
          <div class="rrow"><span class="m">Network fee</span><span>0.00021 SOL</span></div>
          <div class="down"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m6 13 6 6 6-6"/></svg></div>
          <div class="burnbox"><span class="flame"><svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8c.5 3.1 2.2 4.9 3.9 6.5 1.7 1.7 2.9 3.5 2.9 5.7a6.8 6.8 0 0 1-13.6 0c0-1.5.5-2.8 1.4-3.9.2 1.2.8 2.1 1.8 2.5C5.8 8.8 9.5 5.6 12 2.8Z"/><path d="M12 14.4c1 1.2 2 2 2 3.3a2 2 0 0 1-4 0c0-1.3 1-2.1 2-3.3Z"/></svg></span>
            <div class="big"><span id="burnN">0</span> $PAD</div>
            <div class="sub">bought on the market · sent to a dead address, forever</div></div>
          <div class="status"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>
            Confirmed <code>5Jd8…q2Xk</code></div>
        </div>
      </div>
    </div>

    <!-- 05 -->
    <div class="slide" data-i="5">
      <div class="copy">
        <h3>Get paid on every single trade</h3>
        <p>Creators launch on Nounspad. Every buy and sell pays the fee, a public bot splits it, and half lands in <code>7xKp…9fQa</code>. Tokens that moon, tokens that don't — all of it.</p>
        <span class="tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M17 8H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6"/></svg>50% of all fees, on all volume</span>
      </div>
      <div class="mock">
        <div class="mock-bar"><div class="dots"><i></i><i></i><i></i></div>
          <span class="mock-title">Nounspad · your payouts</span><span class="live" style="margin-left:auto"><i></i>LIVE</span></div>
        <div class="mock-body">
          <div class="total">
            <div><div class="l">Paid to you</div><div class="n" id="total">142.7 SOL</div></div>
            <div style="text-align:right"><div class="l">Tokens on pad</div><div class="n" style="font-size:20px;color:var(--ink)">37</div></div>
          </div>
          <ul class="feed" id="feed"></ul>
        </div>
      </div>
    </div>

  </div>

  <!-- ── split + simulator ───────────────────── -->
  <div class="split">
    <div class="split-l">
      <span class="eyebrow"><i></i>The split</span>
      <h3>One fee in, two payments out</h3>
      <p>The 50/50 isn't a promise buried in a doc — it's the shape of the money. Every trade on your pad feeds the same pipe.</p>

      <div class="diagram desktop-flow">
        <svg viewBox="0 0 660 250" role="img" aria-label="Fees flow from traders through your curve and split fifty-fifty between the platform and your wallet">
          <defs>
            <linearGradient id="coin" x1="0" y1="0" x2=".4" y2="1">
              <stop offset="0%" stop-color="#ffd79b"/><stop offset="55%" stop-color="#f2913c"/><stop offset="100%" stop-color="#c8560f"/>
            </linearGradient>
            <linearGradient id="coinHalf" x1="0" y1="0" x2=".4" y2="1">
              <stop offset="0%" stop-color="#f2e2c9"/><stop offset="100%" stop-color="#bda57f"/>
            </linearGradient>
            <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--ember)"/><stop offset="100%" stop-color="var(--accent)"/>
            </linearGradient>
            <linearGradient id="tileS" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#cbb28c"/><stop offset="100%" stop-color="#a98f68"/>
            </linearGradient>
            <linearGradient id="cardG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fffdf9"/><stop offset="100%" stop-color="#fff4e3"/>
            </linearGradient>
            <linearGradient id="sparkG" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="var(--ember)"/><stop offset="100%" stop-color="var(--accent)"/>
            </linearGradient>
            <filter id="soft" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#8a4a12" flood-opacity=".17"/>
            </filter>
            <filter id="coinShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#8a4a12" flood-opacity=".35"/>
            </filter>
          </defs>

          <!-- canos -->
          <g fill="none" stroke-linecap="round">
            <path id="pIn"   d="M104 126 H212"                        stroke="var(--soft)"   stroke-width="15"/>
            <path id="pUp"   d="M356 126 C 412 126, 422 66, 496 66"   stroke="var(--panel2)" stroke-width="12"/>
            <path id="pDown" d="M356 126 C 412 126, 422 192, 496 192" stroke="var(--soft)"   stroke-width="13"/>
          </g>

          <!-- moedas -->
          <g filter="url(#coinShadow)">
            <g opacity="0">
              <circle r="9" fill="url(#coin)"/><circle r="9" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/>
              <circle cx="-2.6" cy="-3" r="2.4" fill="#fff" fill-opacity=".45"/>
              <animateMotion dur="1.8s" repeatCount="indefinite"><mpath href="#pIn"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.8;1" dur="1.8s" repeatCount="indefinite"/>
            </g>
            <g opacity="0">
              <circle r="9" fill="url(#coin)"/><circle r="9" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/>
              <circle cx="-2.6" cy="-3" r="2.4" fill="#fff" fill-opacity=".45"/>
              <animateMotion dur="1.8s" begin="-.9s" repeatCount="indefinite"><mpath href="#pIn"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.8;1" dur="1.8s" begin="-.9s" repeatCount="indefinite"/>
            </g>
            <g opacity="0">
              <circle r="6.5" fill="url(#coinHalf)"/><circle r="6.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.1"/>
              <animateMotion dur="1.8s" begin="-.55s" repeatCount="indefinite"><mpath href="#pUp"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.82;1" dur="1.8s" begin="-.55s" repeatCount="indefinite"/>
            </g>
            <g opacity="0">
              <circle r="6.5" fill="url(#coinHalf)"/><circle r="6.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.1"/>
              <animateMotion dur="1.8s" begin="-1.45s" repeatCount="indefinite"><mpath href="#pUp"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.82;1" dur="1.8s" begin="-1.45s" repeatCount="indefinite"/>
            </g>
            <g opacity="0">
              <circle r="6.5" fill="url(#coin)"/><circle r="6.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>
              <circle cx="-1.8" cy="-2.2" r="1.8" fill="#fff" fill-opacity=".45"/>
              <animateMotion dur="1.8s" begin="-.55s" repeatCount="indefinite"><mpath href="#pDown"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.82;1" dur="1.8s" begin="-.55s" repeatCount="indefinite"/>
            </g>
            <g opacity="0">
              <circle r="6.5" fill="url(#coin)"/><circle r="6.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>
              <circle cx="-1.8" cy="-2.2" r="1.8" fill="#fff" fill-opacity=".45"/>
              <animateMotion dur="1.8s" begin="-1.45s" repeatCount="indefinite"><mpath href="#pDown"/></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.14;.82;1" dur="1.8s" begin="-1.45s" repeatCount="indefinite"/>
            </g>
          </g>

          <!-- ═══ card: traders ═══ -->
          <g filter="url(#soft)"><rect x="4" y="84" width="152" height="84" rx="18" fill="url(#cardG)" stroke="var(--line2)"/></g>
          <g>
            <circle cx="32" cy="110" r="11" fill="#c4324f" stroke="#fff" stroke-width="2.6"/>
            <circle cx="48" cy="110" r="11" fill="#4a72c4" stroke="#fff" stroke-width="2.6"/>
            <circle cx="64" cy="110" r="11" fill="#79ab5c" stroke="#fff" stroke-width="2.6"/>
            <circle cx="80" cy="110" r="11" fill="var(--panel2)" stroke="#fff" stroke-width="2.6"/>
            <text x="80" y="114" text-anchor="middle" font-size="9" font-weight="900" fill="#8c7860">+9k</text>
          </g>
          <text x="22" y="142" font-size="15" font-weight="800" fill="var(--ink)">Traders</text>
          <text x="22" y="157" font-size="9.5" font-weight="700" fill="var(--muted)">buying and selling, 24/7</text>

          <!-- ═══ card: sua curva ═══ -->
          <g filter="url(#soft)"><rect x="188" y="64" width="184" height="124" rx="20" fill="#fff" stroke="var(--accent)" stroke-width="1.8"/></g>
          <rect x="204" y="80" width="30" height="30" rx="10" fill="url(#tile)"/>
          <g transform="translate(208.0,84.0) scale(0.92)" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="3"/></g>
          <text x="242" y="93" font-size="14" font-weight="800" fill="var(--ink)">Nounspad</text>
          <text x="242" y="106" font-size="9" font-weight="700" fill="var(--muted)">Meteora DBC · on-chain</text>
          <g>
            <path d="M204 145 L226 141 L248 143 L270 133 L292 136 L314 126 L336 121 L356 116"
                  fill="none" stroke="url(#sparkG)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="356" cy="116" r="3.4" fill="var(--accent)"/>
          </g>
          <rect x="204" y="156" width="74" height="21" rx="10.5" fill="var(--soft)"/>
          <text x="241" y="171" text-anchor="middle" font-size="10" font-weight="900" fill="var(--accent)">3.5% fee</text>
          <rect x="284" y="156" width="72" height="21" rx="10.5" fill="var(--bg)" stroke="var(--line)"/>
          <text x="320" y="171" text-anchor="middle" font-size="10" font-weight="900" fill="var(--muted)">SOL quote</text>

          <text x="172" y="112" font-size="9" font-weight="900" fill="var(--muted)">volume</text>

          <!-- ═══ badges 50% ═══ -->
          <g filter="url(#soft)">
            <rect x="392" y="70" width="52" height="22" rx="11" fill="#fff" stroke="var(--line2)"/>
            <rect x="392" y="164" width="52" height="22" rx="11" fill="#fff" stroke="var(--accent)"/>
          </g>
          <text x="418" y="85" text-anchor="middle" font-size="11" font-weight="900" fill="var(--sand)">50%</text>
          <text x="418" y="179" text-anchor="middle" font-size="11" font-weight="900" fill="var(--accent)">50%</text>

          <!-- ═══ card: plataforma ═══ -->
          <g filter="url(#soft)"><rect x="474" y="28" width="182" height="76" rx="18" fill="url(#cardG)" stroke="var(--line2)"/></g>
          <rect x="490" y="44" width="30" height="30" rx="10" fill="url(#tileS)"/>
          <g transform="translate(493.2,47.2) scale(0.9)" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8c.5 3.1 2.2 4.9 3.9 6.5 1.7 1.7 2.9 3.5 2.9 5.7a6.8 6.8 0 0 1-13.6 0c0-1.5.5-2.8 1.4-3.9.2 1.2.8 2.1 1.8 2.5C5.8 8.8 9.5 5.6 12 2.8Z"/><path d="M12 14.4c1 1.2 2 2 2 3.3a2 2 0 0 1-4 0c0-1.3 1-2.1 2-3.3Z"/></g>
          <text x="530" y="57" font-size="13" font-weight="800" fill="var(--ink)">The platform</text>
          <text x="530" y="70" font-size="9" font-weight="700" fill="var(--muted)">buys &amp; burns $PAD</text>
          <text x="530" y="87" font-size="9" font-weight="700" fill="var(--sand)">keeps the lights on</text>

          <!-- ═══ card: sua carteira ═══ -->
          <g filter="url(#soft)"><rect x="474" y="146" width="182" height="90" rx="18" fill="#fff" stroke="var(--accent)" stroke-width="2.2"/></g>
          <rect x="470" y="142" width="190" height="98" rx="21" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0">
            <animate attributeName="opacity" values="0;.4;0" keyTimes="0;.2;1" dur="1.8s" begin="-.1s" repeatCount="indefinite"/>
          </rect>
          <rect x="490" y="162" width="30" height="30" rx="10" fill="url(#tile)"/>
          <g transform="translate(494.0,166.0) scale(0.92)" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.6A2.6 2.6 0 0 1 6.1 5H18a1 1 0 0 1 1 1v2"/><path d="M3.5 7.6V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6a1 1 0 0 0-1-1H6.1a2.6 2.6 0 0 1-2.6-2.4Z"/><circle cx="16.4" cy="14" r="1.3" fill="#fff" stroke="none"/></g>
          <text x="530" y="175" font-size="13.5" font-weight="900" fill="var(--accent)">Your wallet</text>
          <text x="530" y="188" font-size="9.5" font-weight="700" fill="var(--muted)" font-family="ui-monospace,Menlo,monospace">7xKp…9fQa</text>
          <rect x="490" y="200" width="88" height="21" rx="10.5" fill="var(--soft)"/>
          <text x="534" y="215" text-anchor="middle" font-size="10" font-weight="900" fill="var(--accent)">+4.21 SOL</text>
          <text x="588" y="215" font-size="9" font-weight="700" fill="var(--sand)">last payout</text>
        </svg>
      </div>

      <div class="mobile-flow">
        <div class="mnode"><strong>Traders</strong><small>buys · sells · 24/7</small></div>
        <div class="marrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m6 13 6 6 6-6"/></svg><small>volume</small></div>
        <div class="mnode hot"><strong>Nounspad's curve</strong><small>fee 3.5% · Meteora DBC</small></div>
        <div class="marrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m6 13 6 6 6-6"/></svg><small>the fee is split</small></div>
        <div class="msplit">
          <div class="mnode"><strong>Platform</strong><small>50%</small></div>
          <div class="mnode hot"><strong>Your wallet</strong><small>50%</small></div>
        </div>
      </div>
    </div>

    <div class="sim">
      <div class="f"><div class="l">Monthly volume</div><div class="v" id="volOut">$250.0k</div>
        <input id="vol" type="range" min="10000" max="5000000" step="10000" value="250000" aria-label="Monthly volume on your pad"></div>
      <div class="f"><div class="l">Your fee</div><div class="v" id="feeOut">3.5%</div>
        <input id="fee" type="range" min="2" max="10" step="0.5" value="3.5" aria-label="Your trading fee"></div>

      <div class="result">
        <div class="l">Fees collected · <span id="totalOut">$8.8k</span></div>
        <div class="bar"><i class="plat"></i><i class="you"></i></div>
        <div class="barlab"><span>Platform 50%</span><span class="you">You 50%</span></div>
        <div class="l" style="margin-top:18px">Your share</div>
        <div class="big2" id="yourOut">$4.4k</div>
        <a class="cta" href="/create">Create your launchpad (0.5 SOL)
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg></a>
        <p class="fine">Estimate. Real payouts follow on-chain volume and are listed on your pad's dashboard.</p>
      </div>
    </div>
  </div>

</div></section>
`;
}
