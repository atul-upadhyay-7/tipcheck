# TipCheck product plan, 9 October 2026

## Product decision

Build a mobile-first, bilingual, voluntary pre-payment decision aid. Not a UPI app, bank fraud engine or verified-scam registry. Preserve the existing paper/ink/terracotta identity and existing message detector. Separate the product into real navigable pages and give users a quick message-check path alongside a guided payment check. Do not force an account or a long profile form before help.

Primary user hypothesis: an English/Hindi-speaking UPI user evaluating an unexpected payment request. Secondary: someone helping a family member, and someone checking a financial pitch. These are proposed cohorts, not interviewed customers. No validated demand, willingness to pay, market share or TAM estimate yet.

## Routes and jobs

| Page | Job | Details collected | Main action |
| --- | --- | --- | --- |
| `/` Start | Choose the right help and language | Choice: message check, before paying, already paid/shared access | Start check or get urgent help |
| `/check/message` Message | Collect only relevant evidence | Optional pasted message/link, reminder to remove secrets | Continue to payment check, or quick message-only analysis |
| `/check/recipient` Recipient context | Ask one clear question | First payment: yes/no/not sure | Continue/back |
| `/check/name` Name comparison | Compare bank-displayed name to intended recipient | Matches: yes/no/not sure, no recipient identity entered | Continue/back |
| `/check/amount` Payment unusualness | Ask about relative amount rather than income/profile | Unusually large for you: yes/no/not sure | Continue/back |
| `/check/pressure` Pressure | Understand coercion | Immediate/secret payment: yes/no/not sure | Continue/back |
| `/check/pin` Receiving-money claim | Detect PIN-to-receive trick | Yes/no/not sure, never the actual PIN | Continue; immediate plain-language stop guidance if yes |
| `/check/access` Remote access | Detect device-control pressure | Screen-share/remote-control request: yes/no/not sure | Continue; immediate stop guidance if yes |
| `/check/review` Review | Correct answers and consent before analysis | Summary + explicit submission of message/context to configured server | Edit any answer; Analyse |
| `/check/result` Decision | Explain the important concerns first | Nothing new | Verify independently; revise; start over |
| `/check/actions` Action plan | Give concrete steps rather than a passive score | Optional voluntary pause, review-only contact note | Pause or prepare note; never "pay now" |
| `/learn` Learn | Keep literacy material out of the urgent flow | Fictional examples/practice, no history | Practice separately |
| `/help` Already paid / help | Prioritise urgent official reporting over a quiz | No complaint details collected | Open official resources; contact bank independently |
| `/about` How it works & privacy | Explain data, sources, limits and contact-provider scope | None | Read methodology and sources |

Use unique headings, progress for guided questions, labelled controls, explicit unknown answers, clear Back/Continue and keyboard focus after navigation. Keep language choice throughout. Entry links to a result without current evidence redirect to start with an explanation; they must never show a fabricated or stale result.

Initial routing can use hash URLs (`/#/check/...`) to make refresh/deep links work on current Vercel and FastAPI static hosting without relying on an unverified host rewrite. These are real separate page views with history/back navigation, not jump links in a long one-page dashboard. Clean pathname routing is a later option after deployment fallbacks are verified. Browser-only draft state is in memory initially: refresh clears private content deliberately, with a clear notice. No localStorage, sessionStorage, analytics or server-side user history by default. Avoid secret-bearing URLs/query strings. Review page explicitly discloses that analysis sends text/context to the server.

## Validation of the plan

- Google Pay already warns about screen sharing and documents actual blocked payments for suspicious active accessibility apps. TipCheck cannot claim first-of-its-kind protection or equal bank/device powers. Its proposed distinction is a portable, bilingual message-plus-self-reported-context decision workflow.
- Truecaller already offers free phone/URL checks, community evidence and unknown outcomes, without login for basic checks. ScamAdviser offers multi-signal website trust reports and admits unverifiable inputs. Generic URL scoring alone is not a defensible gap. Neither database is silently integrated or scraped.
- A 2026 ACM UPI study used scenario-based interviews with 46 Indian participants and found trust in recipients and perceived transaction need affect multi-stage decision making; trust badges were perceived as useful. This is qualitative/scenario evidence, not field loss prevention. Do NOT imitate a verified badge when identity is unknown.
- NCAER's July 2025 commentary describes the gap between access and financial/digital understanding. This supports simple bilingual design, but is not a customer interview or a representative demand measurement for TipCheck. Numeric literacy claims are excluded from product copy.
- GOV.UK recommends starting with one question per page and a review page for checking answers. This is established design guidance, not proof that a ten-step TipCheck flow will convert. Preserve the quick message path; measure comprehension and abandonment before adding more questions.
- RBI's 9 April 2026 paper discusses time lags, trusted-person authentication and customer controls. It is a discussion paper, not proof that its options became mandatory. Standalone voluntary pause and contact-note preview are the feasible scope; bank enforcement requires a partner.
- APP-warning research supports considering actions/postponement and targeted information. The current 30-second duration is arbitrary prototype behaviour, not clinically or financially established protection. Timer completion never marks safe. Urgent help is available without waiting.
- W3C WCAG 2.2 target-size guidance, labels/focus and non-colour warnings shape acceptance checks. Aim for 44px touch controls, but do not claim a full conformance audit.

## Data collection boundaries

"User details" means task-relevant context, not identity harvesting. First release does not need name, mobile number, age, income, exact balance, bank account, UPI ID, contact address or login. Ask no credentials. Never read WhatsApp automatically. Independent payee lookup is a visible external/manual option only; unknown is never treated as verified.

The new UI sends the original six answers to the existing tested `/api/preflight`, preserving current score semantics. New purpose labels route the experience; they do not silently create new risk weights. Defer extra scoring fields until rule semantics and tests are defined.

## Build sequence, after review

1. Route/state shell, start/message pages, preserved old quick-check behaviour and Back navigation.
2. Six question pages, review/edit flow, explicit submission and cancellation handling.
3. Result/action split, separate learn/help/about pages and consistent English/Hindi copy.
4. Regression, malicious/malformed-input tests, no-persistence inspection, keyboard/zoom/mobile checks and actual desktop/mobile screenshots for each UI stage.
5. Commit under Atul's identity. No push until owner approval. Publish backend first, confirm `/api/preflight`, then frontend and deployed e2e. Local build evidence is not production proof.

## Acceptance criteria

- Browser Back/Forward, refresh, direct links and route changes never resurrect a stale analysis or private message.
- Edits invalidate results and timers; network failure, invalid JSON and old backend endpoint absence are errors, never zero-risk evidence.
- Every signal shows provenance and whether it is observed text, user report or structural hint; no probability/verified-sender language.
- Unknown/skip defaults remain visible; first-payment-alone and legitimate paid-course controls unchanged.
- Real backend e2e with high-risk, ordinary, unknown, malformed URL, Hindi and context-only inputs. Optional deployed ML verified separately.
- Keyboard flow and focus, screen-reader labels, 200% zoom, 320/390px mobile, 1440px desktop, no overlap or horizontal overflow, screenshots inspected at every stage.

## Beyond a working prototype

A market-ready claim needs more than pages: consensual usability interviews with representative Hindi/English users; false-positive/false-negative evaluation on consented anonymised real messages, incident support ownership, privacy/retention review, uptime/rate limiting/abuse controls, security review and a maintained fraud-source/update process. Proposed interviews and testing targets are next-step hypotheses, not scheduled or completed research. Paid monetisation and bank/PSP integrations require separate decisions. No guarantee of loss prevention.

## Pacing

Treat 16-23 October 2026 as the user's one-to-two-week planning window, not a guarantee to finish all market-readiness work. First checkpoint is plan review. A sensible second checkpoint is paper/prototype usability with consenting participants, before a full guided-flow implementation. Build stages should follow evidence, not idle timer wakes. Interviews, partner access and operational support require decisions from the owner. No interviews are scheduled or messages sent by this plan.

## Supporting sources

All primary claims above were checked against fetched pages. Vendor feature/accuracy claims remain vendor-authored. Research abstractions remain research observations, not deployment validation.

- Google Pay screen sharing: https://support.google.com/pay/india/answer/10768310?hl=en
- Google Pay real transaction blocks: https://support.google.com/pay/india/answer/17165523?hl=en
- Truecaller feature/unknown-result scope: https://www.truecaller.com/scam-checker/faq
- ScamAdviser methodology/limits: https://www.scamadviser.com/FAQ
- Indian qualitative UPI study, ACM, 4 Jun 2026: https://dl.acm.org/doi/10.1145/3779208.3785285
- NCAER commentary, 4 Jul 2025: https://ncaer.org/publication/from-access-to-awareness-why-india-needs-to-boost-digital-financial-literacy/
- RBI discussion, 9 Apr 2026: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23810
- GOV.UK one-question guidance: https://design-system.service.gov.uk/patterns/question-pages/
- GOV.UK review guidance: https://design-system.service.gov.uk/patterns/check-answers/
- W3C touch target guidance: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- APP-warning preliminary experiments, Feb 2021: https://www.openbanking.org.uk/wp-content/uploads/Preliminary-Analysis-Effective-Warning-20210201.pdf
- PSR APP research, Oct 2025: https://www.psr.org.uk/media/efpdiwpk/using-behavioural-economics-to-understand-and-prevent-app-fraud.pdf
- Official cybercrime portal and public suspect-repository description: https://cybercrime.gov.in/
- Official immediate financial-fraud helpline 1930: https://www.pib.gov.in/PressReleasePage.aspx?PRID=1814120&lang=2&reg=3

The public suspect repository is a possible manual resource, not an API entitlement or a lookup performed by TipCheck. Absence in a repository never proves safety. Older helpline number 155260 appears in old sources; use the confirmed 1930 source, not the superseded number.
