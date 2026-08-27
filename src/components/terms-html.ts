/* GERADO por scripts/extract-html.js — nao editar na mao */
export function termsHtml(DOMAIN: string): string {
  return `<div class="wrap">
  <div class="head">
    <span class="eyebrow"><i></i>Legal</span>
    <h1>Terms of Service</h1>
    <div class="meta">
      <span>Last updated: <span class="ph">[DATE]</span></span>
      <span>Effective: <span class="ph">[DATE]</span></span>
      <span>Version 1.0</span>
    </div>
  </div>

  <div class="alert">
    <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span>
    <div>
      <h3>Draft — not legal advice</h3>
      <p>This document is a starting template. It has not been reviewed by a lawyer and is not tailored to any jurisdiction. Every field marked in yellow must be filled in, and the whole text must be reviewed by counsel licensed where your entity operates before you publish it. Delete this box before going live.</p>
    </div>
  </div>

  <div class="cols">
    <nav class="toc" id="toc">
      <div class="t">Contents</div>
      <a href="#s1">1. Who we are</a>
      <a href="#s2">2. What the Service is</a>
      <a href="#s3">3. What the Service is not</a>
      <a href="#s4">4. Eligibility</a>
      <a href="#s5">5. Wallets &amp; on-chain actions</a>
      <a href="#s6">6. Creating a launchpad</a>
      <a href="#s7">7. Pad Owner obligations</a>
      <a href="#s8">8. Tokens created by users</a>
      <a href="#s9">9. Fees &amp; the revenue split</a>
      <a href="#s10">10. Third-party protocols</a>
      <a href="#s11">11. Risk disclosure</a>
      <a href="#s12">12. Prohibited conduct</a>
      <a href="#s13">13. Content &amp; IP</a>
      <a href="#s14">14. Attribution</a>
      <a href="#s15">15. Analytics &amp; privacy</a>
      <a href="#s16">16. Suspension &amp; removal</a>
      <a href="#s17">17. Disclaimers</a>
      <a href="#s18">18. Limitation of liability</a>
      <a href="#s19">19. Indemnification</a>
      <a href="#s20">20. Taxes</a>
      <a href="#s21">21. Disputes &amp; arbitration</a>
      <a href="#s22">22. Changes</a>
      <a href="#s23">23. General</a>
      <a href="#s24">24. Contact</a>
    </nav>

    <article class="doc">

      <section id="s1">
        <h2><span>01</span>Who we are</h2>
        <p>These Terms of Service (the "<b>Terms</b>") are a binding agreement between you and <span class="ph">[LEGAL ENTITY NAME]</span>, a <span class="ph">[ENTITY TYPE]</span> organized under the laws of <span class="ph">[JURISDICTION]</span>, with registered address at <span class="ph">[ADDRESS]</span> ("<b>we</b>", "<b>us</b>", "<b>the Company</b>"), governing your access to and use of <span class="ph">[PLATFORM NAME]</span>, the website at <span class="ph">[DOMAIN]</span>, its subdomains, and any related interfaces (together, the "<b>Service</b>").</p>
        <p>By accessing the Service, connecting a wallet, or signing any transaction through it, you accept these Terms in full. If you do not accept them, do not use the Service.</p>
      </section>

      <section id="s2">
        <h2><span>02</span>What the Service is</h2>
        <p>The Service is a <b>front-end software interface</b> that helps users create and configure their own token launchpads ("<b>Pads</b>") on the Solana blockchain, and helps other users launch tokens on those Pads. Configuration is written to public smart contracts operated by third parties, including dynamic bonding curve contracts provided by Meteora.</p>
        <p>We provide software. We do not operate a marketplace, exchange, broker-dealer, or trading venue; we do not match orders; and we do not participate in transactions between users.</p>
      </section>

      <section id="s3">
        <h2><span>03</span>What the Service is not</h2>
        <ul>
          <li><b>Not custodial.</b> We never hold, control, or have access to your private keys, seed phrases, tokens, or funds at any time.</li>
          <li><b>Not financial advice.</b> Nothing on the Service is investment, legal, tax, or accounting advice, or a recommendation to buy, sell, or hold anything.</li>
          <li><b>Not an issuer or promoter.</b> Tokens launched through the Service are created by users, on their own initiative, with their own parameters and their own content.</li>
          <li><b>Not an endorsement.</b> A Pad or token appearing on the Service does not mean we reviewed, verified, approved, or vouch for it, its creator, or its claims.</li>
          <li><b>Not a guarantee of value.</b> We make no representation that any token has, will have, or will retain any value whatsoever.</li>
        </ul>
      </section>

      <section id="s4">
        <h2><span>04</span>Eligibility</h2>
        <p>By using the Service you represent and warrant that you:</p>
        <ul>
          <li>are at least 18 years old and have full legal capacity to enter into these Terms;</li>
          <li>are not a resident of, located in, or organized under the laws of any country subject to comprehensive sanctions, and are not listed on any sanctions list, including those maintained by <span class="ph">[OFAC / EU / UN / OTHER]</span>;</li>
          <li>are not accessing the Service from a jurisdiction where doing so would be unlawful, including <span class="ph">[LIST OF RESTRICTED JURISDICTIONS]</span>;</li>
          <li>will not use the Service on behalf of any person or entity that fails to meet the above.</li>
        </ul>
        <p>We may block access from any jurisdiction at any time, with or without notice, including in response to legal or regulatory developments.</p>
      </section>

      <section id="s5">
        <h2><span>05</span>Wallets and on-chain actions</h2>
        <p>You interact with the Service through a self-custodial wallet you control. You are solely responsible for the security of your wallet, device, and credentials. Loss of a private key means permanent loss of access, and we cannot recover it.</p>
        <p><b>Blockchain transactions are irreversible.</b> Once you sign, neither we nor anyone else can cancel, reverse, refund, or modify the transaction. This includes transactions sent to a wrong address, transactions with parameters you later regret, and transactions that fail after fees have been consumed.</p>
        <p>Network fees ("gas") and any third-party protocol fees are paid by you and are outside our control.</p>
      </section>

      <section id="s6">
        <h2><span>06</span>Creating a launchpad</h2>
        <p>Creating a Pad requires paying a creation fee of <span class="ph">[0.5 SOL]</span> plus on-chain rent and network fees. <b>The creation fee is non-refundable</b> under all circumstances, including if you later stop using the Pad, if the Pad is removed from our directory, or if the Service is discontinued.</p>
        <p>Certain parameters, including the trading fee, quote token, starting market cap and graduation market cap, are written to an on-chain configuration and are <b>immutable</b>. Verify them before signing; we cannot change them afterwards.</p>
        <p>Subdomains are assigned on a first-come basis and remain subject to sections 12, 13 and 16. We may reclaim a subdomain that infringes a third party's rights, impersonates another person or brand, or violates these Terms.</p>
      </section>

      <section id="s7">
        <h2><span>07</span>Pad Owner obligations</h2>
        <p>If you create a Pad, you are the "<b>Pad Owner</b>" and you additionally represent, warrant and agree that:</p>
        <ul>
          <li>you are solely responsible for your Pad, its branding, its description, its links, any token you launch on it, and any statement you make to your users;</li>
          <li>you will comply with all laws applicable to you and to your users, including securities, consumer protection, advertising, anti-money-laundering, sanctions, and tax laws, and you will obtain any licence or registration your activity requires;</li>
          <li>you will not describe your Pad or any token as an investment, a security, a share of profits, a yield-bearing instrument, or as being endorsed, guaranteed, audited or partnered with us;</li>
          <li>you are responsible for any claim brought by your users, and you will not represent that we are responsible for it;</li>
          <li>you accept that we may remove your Pad from our directory and interfaces at any time under section 16.</li>
        </ul>
        <p>You act on your own behalf. Nothing in these Terms creates a partnership, joint venture, employment, agency, or fiduciary relationship between you and us.</p>
      </section>

      <section id="s8">
        <h2><span>08</span>Tokens created by users</h2>
        <p>All tokens accessible through the Service are created by users. We do not create, issue, underwrite, sponsor, audit, endorse, or guarantee any of them, and we do not verify the identity, statements, intentions or solvency of their creators.</p>
        <p>You acknowledge that token creators may abandon a project, sell their holdings at any time, act dishonestly, or lose interest, and that neither we nor the Pad Owner has any obligation to prevent that or to compensate you if it happens.</p>
      </section>

      <section id="s9">
        <h2><span>09</span>Fees and the revenue split</h2>
        <p>Trading fees generated by tokens on a Pad accrue on-chain as partner fees and are split according to the parameters published on the Service, currently <span class="ph">[50% platform / 50% Pad Owner]</span>. Distribution is executed by an automated process. You acknowledge that:</p>
        <ul>
          <li>fee amounts depend entirely on trading activity, which we neither control nor forecast, and may be <b>zero</b>;</li>
          <li>any figure, chart, simulator or example shown on the Service is illustrative only and is not a projection, promise or guarantee of earnings;</li>
          <li>distribution may be delayed, interrupted or fail due to network congestion, protocol changes, bugs, or third-party outages, and we are not liable for such delays or failures;</li>
          <li>we may change the split, the creation fee, or any other fee prospectively, with notice published on the Service; changes do not affect the immutable on-chain configuration of Pads already created;</li>
          <li>you are solely responsible for reporting and paying taxes on any amount you receive.</li>
        </ul>
      </section>

      <section id="s10">
        <h2><span>10</span>Third-party protocols and services</h2>
        <p>The Service depends on third parties we do not control, including the Solana network and its validators, wallet providers, RPC providers, bonding curve and liquidity contracts operated by Meteora, price and data providers, and hosting and DNS providers.</p>
        <p>Your use of those third parties is governed by their own terms. We make no representation about their security, availability, or correctness, and <b>we are not liable for any loss caused by them</b>, including smart contract bugs, exploits, oracle failures, forks, reorganizations, network halts, or discontinuation of a protocol.</p>
      </section>

      <section id="s11">
        <h2><span>11</span>Risk disclosure</h2>
        <div class="caps"><p>You may lose all funds you commit through the service. Do not commit funds you cannot afford to lose entirely.</p></div>
        <p>Without limiting the above, you acknowledge the following risks:</p>
        <ul>
          <li><b>Total loss.</b> Tokens launched through the Service are typically highly speculative, illiquid, and frequently go to zero.</li>
          <li><b>Volatility.</b> Prices on a bonding curve can move violently in either direction within seconds.</li>
          <li><b>Bad actors.</b> Creators may abandon projects, dump holdings, impersonate brands or people, or run coordinated schemes. We do not screen for this.</li>
          <li><b>Smart contract risk.</b> Contracts may contain vulnerabilities. Audits reduce but do not eliminate risk.</li>
          <li><b>Regulatory risk.</b> Laws applicable to tokens are unsettled and change. A token or the Service may become restricted or unlawful in your jurisdiction.</li>
          <li><b>Technical risk.</b> Front-end interfaces can be unavailable, out of date, spoofed, or compromised. Always verify the domain and the contents of any transaction before signing.</li>
          <li><b>No recourse.</b> There is no deposit insurance, no chargeback, no clearing house, and no authority that can reverse a transaction for you.</li>
        </ul>
      </section>

      <section id="s12">
        <h2><span>12</span>Prohibited conduct</h2>
        <p>You must not use the Service to:</p>
        <ul>
          <li>break any law, or facilitate money laundering, terrorist financing, sanctions evasion, or tax evasion;</li>
          <li>defraud anyone, including through fake teams, fake partnerships, fake audits, fake volume, wash trading, spoofing, or coordinated manipulation;</li>
          <li>impersonate any person, brand, project or public figure, or use a name, ticker, logo or subdomain that infringes a third party's trade mark or is designed to confuse;</li>
          <li>publish content that is unlawful, defamatory, hateful, harassing, sexually explicit, or that exploits or endangers minors;</li>
          <li>launch a token that represents equity, debt, revenue share, profit rights, or any other claim on an enterprise, or that is marketed as an investment;</li>
          <li>upload malware, phishing links, drainer contracts, or code intended to compromise users' wallets;</li>
          <li>scrape, mirror, reverse engineer, overload, or circumvent any technical restriction of the Service;</li>
          <li>interfere with the fee distribution process or attempt to redirect funds not owed to you.</li>
        </ul>
      </section>

      <section id="s13">
        <h2><span>13</span>Content and intellectual property</h2>
        <p>The Service, its interfaces, design, code, and marks are owned by us or our licensors and are protected by intellectual property laws. Except as expressly permitted, you may not copy, modify, distribute, sell, or create derivative works from them.</p>
        <p>You retain ownership of the content you submit (logos, names, descriptions, links). By submitting it, you grant us a worldwide, non-exclusive, royalty-free licence to host, reproduce, resize and display that content for the purpose of operating and promoting the Service. You represent that you hold all rights necessary to grant this licence.</p>
        <p>If you believe content on the Service infringes your rights, contact us at <span class="ph">[LEGAL EMAIL]</span> with the material, your claim of ownership, and your contact details. We may remove content from our interfaces, but <b>we cannot remove or alter anything already recorded on the blockchain</b>.</p>
      </section>

      <section id="s14">
        <h2><span>14</span>Attribution</h2>
        <p>Pages served on subdomains provided by us display a "Powered by <span class="ph">[PLATFORM NAME]</span>" attribution. Removing, obscuring, or misrepresenting that attribution is a breach of these Terms and may result in removal of the Pad from our interfaces.</p>
      </section>

      <section id="s15">
        <h2><span>15</span>Analytics and privacy</h2>
        <p>Our handling of personal data is described in our <a href="#">Privacy Policy</a>, which forms part of these Terms.</p>
        <p>If you are a Pad Owner and you configure a third-party analytics identifier (for example a Google Analytics measurement ID) for your Pad, <b>you become the controller of the data collected through it</b>. You are responsible for your own privacy notice, for any consent required in your users' jurisdictions (including under the GDPR, LGPD, or equivalent), and for your relationship with that analytics provider. You will indemnify us for any claim arising from your use of it.</p>
        <p>Wallet addresses and on-chain activity are public by nature. We may analyse public blockchain data and may be required to disclose information in response to lawful requests.</p>
      </section>

      <section id="s16">
        <h2><span>16</span>Suspension and removal</h2>
        <p>We may, at our sole discretion and without liability, restrict or remove any Pad, token, subdomain, content or user from our interfaces, with or without notice, including where we believe there is a violation of these Terms, a legal or regulatory risk, a security threat, or a risk of harm to users.</p>
        <p>You acknowledge that removal from our interfaces does not affect on-chain state: contracts continue to exist and tokens may continue to trade elsewhere. We may also discontinue the Service, in whole or in part, at any time.</p>
      </section>

      <section id="s17">
        <h2><span>17</span>Disclaimers</h2>
        <div class="caps"><p>The service is provided "as is" and "as available", without warranty of any kind, express or implied, including any warranty of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, availability, or uninterrupted or error-free operation.</p></div>
        <p>We do not warrant that the Service will be secure, that defects will be corrected, that data displayed is accurate or current, or that any transaction will succeed. Some jurisdictions do not allow certain exclusions, so parts of this section may not apply to you.</p>
      </section>

      <section id="s18">
        <h2><span>18</span>Limitation of liability</h2>
        <div class="caps"><p>To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for any loss of profits, revenue, tokens, data, goodwill or opportunity, arising out of or related to the service, whether based on contract, tort, strict liability or any other theory, even if advised of the possibility.</p></div>
        <div class="caps"><p>Our total aggregate liability for all claims relating to the service will not exceed the greater of (a) the total fees you paid us in the three months preceding the event giving rise to the claim, or (b) <span class="ph">[USD 100]</span>.</p></div>
        <p>Nothing in these Terms excludes liability that cannot be excluded under applicable law, including for fraud, wilful misconduct, or death or personal injury caused by negligence.</p>
      </section>

      <section id="s19">
        <h2><span>19</span>Indemnification</h2>
        <p>You agree to defend, indemnify and hold harmless the Company, its affiliates, and their officers, directors, employees and agents from any claim, demand, loss, liability, damage, fine, or expense (including reasonable legal fees) arising out of or related to: your use of the Service; any Pad or token you create; any content you submit; your breach of these Terms or of any law; your tax obligations; any analytics or tracking you configure; or any dispute between you and another user.</p>
      </section>

      <section id="s20">
        <h2><span>20</span>Taxes</h2>
        <p>You are solely responsible for determining, reporting and paying any tax arising from your use of the Service, including on fees you receive as a Pad Owner and on any disposal of tokens. We do not provide tax advice and do not issue tax documentation unless required by law.</p>
      </section>

      <section id="s21">
        <h2><span>21</span>Governing law, disputes and class action waiver</h2>
        <p>These Terms are governed by the laws of <span class="ph">[JURISDICTION]</span>, without regard to conflict of law rules.</p>
        <p>Any dispute arising out of or relating to these Terms or the Service will be finally settled by binding arbitration administered by <span class="ph">[ARBITRAL INSTITUTION]</span> under its rules, seated in <span class="ph">[SEAT / CITY]</span>, in <span class="ph">[LANGUAGE]</span>, before <span class="ph">[ONE / THREE]</span> arbitrator(s). Judgment on the award may be entered in any court of competent jurisdiction.</p>
        <div class="caps"><p>You and we agree to bring claims only in an individual capacity, and not as a plaintiff or class member in any class, collective, or representative proceeding.</p></div>
        <p>Before commencing arbitration, you agree to attempt to resolve the dispute informally by contacting us at <span class="ph">[LEGAL EMAIL]</span> and allowing <span class="ph">[30]</span> days for a response.</p>
        <div class="note"><p>Consumer protection law in some jurisdictions — including Brazil, the EU and several US states — limits or invalidates mandatory arbitration and class waivers for consumers. Have counsel confirm what is enforceable for your user base before relying on this section.</p></div>
      </section>

      <section id="s22">
        <h2><span>22</span>Changes to these Terms</h2>
        <p>We may update these Terms at any time. The updated version takes effect when published on the Service, with the "last updated" date revised. Material changes will be signalled on the Service where reasonably practicable. Continued use after that date is acceptance. If you do not accept, stop using the Service.</p>
      </section>

      <section id="s23">
        <h2><span>23</span>General</h2>
        <p><b>Entire agreement.</b> These Terms and any documents referenced in them are the entire agreement between you and us regarding the Service.</p>
        <p><b>Severability.</b> If any provision is held unenforceable, the rest remains in force and the unenforceable provision is modified to the minimum extent necessary.</p>
        <p><b>No waiver.</b> Failure to enforce a provision is not a waiver of it.</p>
        <p><b>Assignment.</b> You may not assign these Terms. We may assign them in connection with a merger, acquisition, or sale of assets.</p>
        <p><b>Force majeure.</b> We are not liable for failures caused by events beyond our reasonable control, including network outages, protocol failures, regulatory action, or acts of God.</p>
        <p><b>Language.</b> If these Terms are translated, the <span class="ph">[ENGLISH]</span> version prevails in case of conflict.</p>
        <p><b>Survival.</b> Sections 3, 8 through 13 and 17 through 23 survive termination.</p>
      </section>

      <section id="s24">
        <h2><span>24</span>Contact</h2>
        <p><span class="ph">[LEGAL ENTITY NAME]</span><br>
        <span class="ph">[ADDRESS]</span><br>
        General: <span class="ph">[SUPPORT EMAIL]</span><br>
        Legal and IP notices: <span class="ph">[LEGAL EMAIL]</span></p>
      </section>

    </article>
  </div>
</div>

`;
}
