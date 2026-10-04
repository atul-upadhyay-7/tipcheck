# Advisory-based red-flag hardening, October 4, 2026

This review broadens a bounded financial-message heuristic. It is not a fraud verdict, real-world accuracy study or guarantee that arbitrary scams will be detected. No ML model was retrained. Weights are product choices, not RBI/SEBI ratings.

## Scenario checks

The 24 risk scenarios and 24 genuine/protective controls are author-written synthetic tests derived from advisory categories. They were used while developing these rules, so the results are regression coverage, not held-out accuracy. Baseline is deployed commit 0122bc3, not the unpublished slot fix.

| Check | Baseline | Hardened |
|---|---:|---:|
| Risk scenarios with at least one flag | 4/24 | 24/24 |
| Risk scenarios scoring High | 3/24 | 19/24 |
| Controls incorrectly flagged in this battery | 0/24 | 0/24 |

| Scenario | Before | After | Signals |
|---|---:|---:|---|
| payout | 60 | 75 | amount_payout, urgency |
| slot | 0 | 60 | amount_payout |
| guarantee | 90 | 90 | guarantee, quick_return, urgency, payment |
| fixed_return | 0 | 35 | risk_free_return |
| quick_return | 0 | 40 | short_term_return, urgency |
| credential | 0 | 60 | credential_request |
| credential | 0 | 60 | credential_request |
| credential | 0 | 60 | credential_request |
| credential_hi | 0 | 60 | credential_request |
| upi_receive | 0 | 60 | upi_receive |
| advance_fee | 0 | 60 | advance_fee |
| withdrawal_fee | 0 | 60 | advance_fee |
| prize_fee | 0 | 60 | advance_fee |
| regulator | 0 | 60 | advance_fee |
| fake_app | 75 | 75 | guarantee, apk, payment |
| institutional | 0 | 35 | institutional_access |
| credential_format | 0 | 60 | credential_request |
| credential_zw | 0 | 60 | credential_request |
| advance_wrapped | 0 | 60 | advance_fee |
| pressure | 0 | 15 | urgency |
| recruitment | 0 | 35 | risk_free_return |
| romance_investment | 15 | 75 | secret, amount_payout |
| kyc_link | 0 | 50 | kyc_threat |
| remote_access | 0 | 50 | remote_access |

## Evidence and design choices

- SEBI How to Spot a Scam: high/quick returns, guarantees, pushy sales. https://investor.sebi.gov.in/spot-any-scam.html
- SEBI fake-trading-app advisory: social media hooks, private payments, APKs, withdrawal fees. https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf
- SEBI August 22, 2025 FPI advisory: institutional-access and guaranteed IPO-allotment pitches. https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1755862022145.pdf
- RBI January 28, 2022 cyber-fraud advisory: OTP/PIN requests, KYC-block threats, remote access, UPI PIN to receive money. https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185
- RBI August 29, 2024 impersonation advisory: fees to release lottery/remittance funds and regulator-name claims. https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=58595
- RBI FAME February 2024: regulated lenders and agents offering loan assistance for fees. https://www.rbi.org.in/commonman/images/FAME202426022024.pdf
- SEBI May 21, 2025 social media stock-market scam notice reviewed as supplementary context. https://www.sebi.gov.in/media-and-notifications/press-releases/may-2025/caution-to-investors-on-stock-market-scams-through-social-media-platforms_94064.html

Only official primary sources are used for the shipped warnings. Community scam messages are not evidence of identities or permission. The test fixture from the user contains offer text only, no personal identifiers.

New strong credential/UPI/advance-fee patterns use weight 60; KYC-link/remote-access patterns use 50; risk-free/IPO-access use 35; short-period return 25; financially scoped urgency 15. Existing signal IDs deduplicate; sums cap at 100. Existing demo seeds retain 90/0/0/0/90/0. The 499-to-1500-in-3-hours example now scores 75 (payout 60 + urgency 15); the Telegram slot list scores 60.

## Limits

A legitimate disclosed fee may be flagged when phrased as an upfront payment to release funds. Merely mentioning RBI, OTP or Telegram does not establish fraud. A registration claim alone is not flagged or verified. Warnings and examples are locally suppressed, but mixed messages, obfuscated spelling, unknown languages, historical quotation and paraphrases can still defeat or confuse the rules. Bare investment promotion can still score 0; no flags does not mean safe. Detection never opens links or checks identities.
