# Before-you-pay check: research and scope

Reviewed 9 October 2026. This extends TipCheck, not a payment gateway.

## What is real

The UI posts to `/api/preflight`. The backend combines existing message rules, six explicitly user-entered answers and local URL structure hints. Every answer defaults to unknown. A first payment alone does not raise risk. Name mismatch, pressure, PIN-to-receive, remote access and first-payment-plus-unusual-amount get explanations. Context contributions cap at 60; URL structure contributes at most 10; total caps at 100. Correlated PIN, pressure and remote-access cues already counted in message rules do not get counted again. No answer reduces a message flag.

These weights are design heuristics, not probabilities, held-out accuracy or learned fraud estimates. Name matching is the user's assessment of the name in their own bank/UPI app, not a bank lookup. Amount unusualness is also self-reported, not behavioural surveillance. No amount, account number, payee name, contact address or credential field is collected.

A 30-second voluntary pause is a reminder, not an enforced bank hold or an evidence-backed optimal duration. Its end never clears risk. A bilingual contact-note preview excludes the original message, link and payment details; the user reviews and sends it themselves. No automatic alerts occur.

## Source-to-decision ledger

| Source | Grounded finding | Implementation decision |
| --- | --- | --- |
| NPCI, 24 Apr 2025 [beneficiary name circular](https://www.npci.org.in/uploads/UPI_OC_No_101_A_FY_2025_26_Strengthening_beneficiary_name_verification_and_display_during_UPI_transactions_eb7bd7ed72.pdf) | UPI apps must display the ultimate beneficiary banking name from Validate Address, rather than QR/user-defined names. | Ask users to compare the name shown in their own UPI app. TipCheck has no Validate Address integration. |
| RBI, 28 Jan 2022 [cyber threats and frauds](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185) | PIN-to-receive, unknown links, remote-access downloads and credentials sharing are documented scam methods; access official banking channels independently. | Context questions and independent-verification instructions. Never ask for PIN/OTP. |
| SEBI [spot a scam](https://investor.sebi.gov.in/spot-any-scam.html) | Assured/quick returns and pushy sales tactics warrant caution; check entities independently. | Keep existing message analysis and manual registry verification. No false registration claim. |
| PIB/DoT, 4 Feb 2026 [FRI and DIP](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2223257&lang=1&reg=3) | DIP is a secure stakeholder-sharing platform; banks/UPI providers use FRI in their own analysis. | Explicitly show reputation/bank data not connected. No public FRI access assumed. |
| Open Banking, Feb 2021 [preliminary experiments](https://www.openbanking.org.uk/wp-content/uploads/Preliminary-Analysis-Effective-Warning-20210201.pdf) | Warning designs were tested in hypothetical incentivised payment journeys. | Make postponement and independent verification visible, without claiming Indian real-world loss prevention. |
| UK PSR, Oct 2025 [behavioural economics and APP fraud](https://www.psr.org.uk/media/efpdiwpk/using-behavioural-economics-to-understand-and-prevent-app-fraud.pdf) | Targeted warnings and decision-action design matter; repeated generic warnings may create fatigue. | Optional preflight, contextual explanations, a pause action. No forced warning on every original message check. |
| OWASP [SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) | User-supplied destinations can reach private/internal resources; redirect and address validation require care. | Never fetch arbitrary pasted URLs, resolve DNS or follow redirects. Structural checks only. |
| Google [appropriate usage](https://developers.google.com/safe-browsing/reference/Appropriate.Usage) and [terms](https://developers.google.com/safe-browsing/terms) | Safe Browsing has non-commercial restrictions; submitted URL data has usage/sharing terms. | Do not silently bolt on a third-party URL reputation lookup. A future integration needs provider choice, credentials, terms and clear privacy consent. |

## URL limits

At most five HTTP(S)/www links are parsed locally. The UI displays the actual destination host, not a clickable launch button. Embedded credentials, numeric IPs, known shortener domains, internationalized hosts, HTTP and malformed URLs create structural cautions. APK is shown but not scored twice over the existing message rule. Internationalized domains and short links are not inherently malicious. HTTPS and absence of hints do not mean safe. No domain age, page content, redirects, blacklist, brand authenticity or registration check occurs.

## Against the PauseGuard problem statement

- Message content: implemented, with unchanged existing tests and optional ML labelling.
- URL content/reputation: structure only; content and reputation unavailable.
- Payee reputation: not connected, displayed as unknown. No fabricated reports or synthetic lookup.
- Payment context: real submitted answers, not transaction interception.
- Behaviour: explicit first-payment/amount/pressure answers, no hidden tracking or stored history.
- Explainable fusion: implemented with bounded, deduplicated heuristic contributions.
- Cooling-off: real voluntary timer, not a payment-provider block.
- Trusted contact: real draft preview, no automatic dispatch.

Bank-side integration would need a participating PSP/bank, approved data access, a defined interception point and privacy/security review. This standalone web app cannot read WhatsApp automatically or stop UPI authorization. No payment deep link or real-money checkout is created. Fraud statistics and absolute novelty claims in the original problem statement are not republished as product facts.

## Privacy and rollout

Production sends pasted content to the configured API server. This code does not intentionally log request content, persist answers, add telemetry or send data to a new third party. Hosting infrastructure policies are separate; this is not a guarantee of zero infrastructure retention. Existing `/analyze` behavior stays compatible. The frontend should be deployed only after the backend's `/api/preflight` endpoint is ready; older backends produce an honest error, never a fallback safe result.
