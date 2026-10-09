# Prototype quality checks

## October 2, 2026: context and interface fixes

- Added fictional adversarial regressions for mixed warnings/pitches, investment-advice disclaimers, paid courses, Hinglish, Hindi and full-width text.
- Warning handling is local rather than a blanket sentence exemption. Explicit negation still suppresses that claim. Repeated matches are inspected so an earlier warning does not hide a later pitch.
- Explicit promotions can have zero red flags. Promotion is a content type, not an accusation of fraud. Clear rule-based education is not overwritten by the optional model.
- Editing a message clears the previous result. Older requests cannot overwrite a newer message. Hindi score explanations and engine labels no longer fall back to English.
- Visually inspected actual desktop and 390px Hindi mobile screenshots. No horizontal overflow or missing Hindi glyphs; result, score, explanations and verification steps are readable.
- Full-stack browser checks exercised promotion, education, language switching and stale-result clearing. Backend tests, lint, frontend build and proxy smoke passed with the generated model loaded.

These are developer-authored regression cases, not an independent benchmark. No new accuracy claim is made. The earlier dataset metrics describe the previous hybrid implementation; rule/context changes mean they must not be presented as current-model performance. Keep the previous held-out split untouched rather than repeatedly tuning against it. A new independently reviewed test set is needed for a new score.

## October 2 evening: demo reliability

- API requests abort after 15 seconds instead of leaving the interface stuck. Bilingual failure copy tells the presenter to check the backend and retry.
- Five Node-native client tests cover JSON requests, HTTP failures, offline errors, invalid JSON and a stalled-request abort. `make test` runs backend and frontend tests.
- Example buttons now have meaningful English/Hindi names rather than numbers. Long untrusted URL text wraps on phones; keyboard focus is visible.
- Browser regression checks cover every fictional demo seed, mobile long URLs, backend failure/retry and late-response protection. Desktop and 390px Hindi screenshots were visually inspected.

## October 2 evening: UI redesign

Tailwind CSS, Motion and Lucide icons now support an original navy/teal workspace with flat surfaces, editorial headline, clear input/evidence separation and stacked mobile layout. No paid assets, copied React Bits components, WebGL, remote fonts or images. System reduced-motion preferences are respected. Developer checks exercised all demo examples, language switching, errors/retry and stale-response protection; actual desktop and Hindi mobile pixels were inspected after transitions settled. See UI_DESIGN.md and UI_LICENSE_NOTICES.md for sources and notices.

## October 2: palette revision after user feedback

Replaced rejected navy/teal colors with warm paper, near-black ink and terracotta. Removed pointer glow entirely. Preserved layout, bilingual content, motion preferences and guardrails. Settled desktop and Hindi phone screenshots inspected; full regression checks rerun. This is a visual change, not a new analyzer or accuracy claim.

## October 2: phone result navigation and accessibility checks

Phone checks now focus and scroll to the new analysis, rather than leaving results below a long input panel. Language switching updates the document language for assistive tools. The untouched empty panel says nothing has been checked, rather than reporting no flags. Darkened borderline footer text contrast. An axe automated check on the Hindi phone result reported no violations after the fix; this is not a full accessibility certification. All normal regression checks and settled screenshots were checked again.

## October 2: result-based literacy coach and documentation

Added an opt-in bilingual three-question coach: matched warning phrase (or no-signal limits), heuristic-score meaning and independent identity checking. Feedback uses the current result's explanation and fixed official links, with no answer storage or safety certificate. Two lesson-builder tests plus browser flows check wrong/right answers, completion, Hindi, reset and no-flags cases. No learning-impact claim is made without a user study. README now covers verified setup, file architecture, demo path, API flow, model/data limits, configuration, privacy and contribution. Architecture doc corrected to match current rule precedence.

## Tonight freeze: single-service deployment path

FastAPI now serves a built frontend and /api aliases on the same origin, removing production dependence on the Vite dev proxy. Two route/static tests added. Local production server on port 8001 passed proxy-free smoke and English/Hindi coach flows; actual production screenshots inspected. Added a platform-neutral checklist and a Render candidate with verified official limits. No cloud service or account was created and no public deployment has been verified. Final count: 33 backend + 7 frontend tests.

## Known limitations

Regexes do not understand all quotation, sarcasm, mixed contexts or negation. Unknown wording can be missed. Training data is synthetic and the model is not calibrated. URLs are displayed as text, not fetched, and neither claims nor identities are verified. No flags never means safe.

Before submission: have another Hindi speaker review wording, add independently authored evaluation examples, practise the demo offline, and confirm organiser team/outside-help/IP rules. No prototype or score guarantees a competition win.

## Expanded ML sanity check, October 2 overnight

Added 90 synthetic multilingual training rows in 30 scenario groups; total fit uses 294 rows in 75 groups. Frozen new evaluation before fitting (48 variants, 16 scenarios). Structural split/duplicate guards add four tests, bringing backend 37 + frontend 7. Logistic regression train-only grouped CV macro-F1 0.907. New hybrid synthetic macro-F1 0.609 versus starter 0.480 on the same slice, with 25/48 abstentions; promotion recall 0.333. Raw argmax 0.873 is not API accuracy. Threshold unchanged, no tuning against new evaluation. Same-author data and correlated translations, independent review still needed. See `backend/ml/data/EVALUATION_V2.md` and JSON reports.

User requested removal of the standalone deployment guide after the previous push. Removed it and its README links; retained the tested production routing itself. No hosting work performed.

## Validation privacy hardening

Rejected input can contain personal information. Replaced the default FastAPI/Pydantic error serialization with location/message/type only; no raw input or error context is echoed. Added over-limit private-marker and malformed-JSON regressions. Backend now 39 tests, frontend 7. This does not promise that a hosting provider never logs data; no request-body logging was added.

## Overnight automation review

CI now runs frontend unit tests (previously build only), plus a fresh model training and ml+rules API smoke job. Smoke requests have finite timeouts and an optional bounded startup wait/mode assertion. These commands pass locally; GitHub Actions execution must be checked separately after push. Corrected evaluation prose direction: the confusion matrix has one promotion predicted education, not education predicted promotion. No metrics, threshold or rules changed.

## October 4 literal payout-claim fix

Live reported input `PLEASE invest 499 I give you 1600` matched no fixed phrase rule, so the meter was 0 and content type uncertain. Added a narrow amount-aware signal: explicit invest/pay/send/deposit followed by an I/we give/pay/return-you amount at least twice the positive stake. Weight 60 yields high; exact matched phrase and bilingual explanation remain inspectable. Capitalization/PLEASE alone is not scored. Protective warning/example/math/quoted-warning context is suppressed; unrelated numbers, ordinary modest repayments and share/unit/point amounts do not trigger this new signal. Not an exhaustive fraud detector or safety verdict. No model/threshold changes. Existing frozen hybrid metrics are historical, not re-measured or tuned against this change. 24 fictional regression cases add to the prior suite (63 backend + 7 frontend). Existing demo seeds unchanged.

## 2026-10-04: decorated payout-slot and multiline regression

The supplied Telegram money-booster message returned 0 on the deployed API. NFKC already normalized fullwidth and mathematical-bold letters, but the matcher required a personal "I/we give you" promise and split at line wraps. Added rule-only removal of format controls, decorative-symbol spacing, collapsed whitespace, and explicit monetary "invest/pay X get Y" or currency payout-tier syntax. Indian and Western comma grouping and /- notation are parsed with Decimal. All nine supplied tiers match; the amount-payout flag remains deduplicated at 60, not multiplied per tier. Model training and weights are unchanged. Protective warnings and classroom examples covering a whole slot list remain suppressed.

This is still a bounded heuristic, not general scam detection or proof of readiness for every message. Paraphrases outside the payment/payout syntax can be missed, and a real financial offer with matching syntax can be flagged. No score is a fraud probability. The existing urgency rules are unchanged.

## 2026-10-04: official-advisory hardening review

Reviewed SEBI and RBI guidance, added eight explained bilingual patterns plus financially scoped urgency phrases. Synthetic development battery improves from 4/24 flagged risk scenarios on deployed 0122bc3 to 24/24, while 24/24 genuine/protective controls remain zero. These tests informed implementation, so they do not measure independent accuracy. Six demo seeds unchanged. Full research sources, weights and limitations in RED_FLAG_REVIEW.md. No model retrain or evaluation-data tuning.

## 2026-10-04: cold-start tolerance (local, pending publication)

A phone check reported a request-timeout error near a 15-minute idle boundary. The exact 503-character input returned HTTP 200 / 60 High in 0.16 seconds during investigation, so no input error was reproduced. The service is confirmed Free in Render's dashboard; official https://render.com/docs/free says it sleeps after 15 idle minutes and typically takes about a minute to wake. This is consistent with cold start, not proof of the user's specific failure.

Frontend attempt timeout raised from 15 to 90 seconds, with a possible-server-wake status after 10 seconds and one automatic retry only for an aborted timeout. A permanently stalled service stops after at most two 90-second attempts. Validation, bad JSON and ordinary network errors do not loop or become zero-risk results. New tests use scaled timing to simulate slow success, timeout retry, permanent stall and cleaned-up progress timers. No keepalive pings, paid hosting or scoring changes.

## 2026-10-09: voluntary before-you-pay workflow

- Grounded against NPCI beneficiary-display rules, RBI scam cautions, SEBI investment warnings, DoT FRI scope, APP warning research and URL privacy/security guidance. Full source ledger: `PREFLIGHT_RESEARCH.md`.
- Added `/api/preflight` with strict yes/no/unknown context, local URL parsing, bounded explainable fusion and correlated-signal deduplication. Existing `/analyze` response stays compatible.
- Added bilingual optional payment-context form, actual voluntary 30-second pause and review-only trusted-contact note; no money, payment interception, payee lookup or external alerts.
- Corrected the old "Local analysis" hero label to hosted analysis because production sends text to its backend.
- 169 backend tests, 14 frontend unit tests, Ruff, production Vite build. Extra backend tests cover input privacy, unknowns, first-payment false-positive control, context polarity, caps, URL hosts/malformed URLs and correlated evidence.
- Real local Chromium e2e against both Vite dev and the built production bundle served by FastAPI at desktop 1440x1050 and mobile 390x844, calling the real FastAPI server: scored message+context+URL, actual 30-second expiry, note privacy, bilingual empty/context-only checks, no horizontal overflow, stale-response rejection and HTTP errors. Desktop/mobile screenshots visually checked after the UI pass. Local server ran rules-only because the optional trained model artifact is not committed; production health currently reports ml+rules. ML files/logic unchanged.
- Regression coverage is implementation testing, not held-out real-world accuracy. No Indian field study, scam-loss reduction claim or optimal-timer claim.
- Local commit only, pending owner approval before push. Backend must be deployed before frontend; confirm `/api/preflight` after publication.

## 2026-10-09: Stage 1 route/state foundation, local only

- Start, message, payment context and result are now distinct hash-route page views. Preserved original palette, quick message-only check and the first preflight pass.
- Private draft is memory-only. Route changes cancel stale response acceptance; edits invalidate results; refresh drops private content. Direct result links without evidence return to message entry with an explanation. Unknown routes fall back to Start.
- Added route tests and real built-bundle e2e at 320, 390 and 1440px covering quick and guided checks, browser Back after edits, refresh/privacy, direct/unknown routes, Hindi and no storage/overflow/page errors. Desktop/mobile screenshots inspected after fixing screenshot animation timing and mobile layout.
- First preflight e2e adapted to routes and still passes real 30-second timer, fusion, note privacy, edits, stale requests and error handling at desktop/mobile. 169 backend + 16 frontend unit tests, Ruff and production build passed.
- This is the foundation milestone, not the completed rebuild: six separate question pages, review consent, separate actions/learn/help/about and accessibility/security hardening remain. Full research plan is PRODUCT_PLAN.md. Market gap is a hypothesis, not validated demand. No accounts/history or market-ready claims.

## 2026-10-09: Stage 2 guided questions and explicit submission, local only

- Replaced combined context form with six individual question routes, progress, large radio answer rows and unknown defaults. No credentials/recipient identity collected. PIN-to-receive and remote access answers show immediate caution before submission.
- Added bilingual review page with editable message and each answer. Edit returns straight to review. Both quick and guided checks now submit only from the explicit "Send details and analyse" action, beside the server/data limitations notice.
- Old context route redirects to first question. Context-only direct question flow works, including after refresh. Memory-only state and edit/stale-result protections preserved.
- Actual built-bundle + FastAPI e2e at 320/390/1440px: all six routes in English/Hindi, unknown defaults, zero POST requests until explicit submit, payload values after review edit, quick/guided/context-only results, real timer expiry, note privacy, refresh/direct-result protection, stale requests, 503 failures and no storage/overflow/page errors. Desktop/mobile screenshots for every question and review inspected; adjusted spacing between cautions and actions after pixel checks.
- 169 backend + 17 frontend tests pass; Ruff and production build pass. No detection/ML changes, no claim of real-user efficacy, no publication. Separate actions/learn/help/about and wider accessibility/security hardening still pending.

## 2026-10-09: Stage 3 results, actions and resource pages, local only

- Split result explanation, action plan and fictional Learn exercise into separate routes. Actions require current evidence; direct links and refresh cannot restore private results. Moved voluntary timer and user-reviewed contact note to actions. No note is sent.
- Added bilingual urgent help from Start and all pages: independent bank contact, India's official 1930 number and cybercrime portal, preserve evidence, no complaint filing or recovery guarantee. RBI/MHA/portal sources rechecked. Added how-it-works/privacy explaining heuristic scores, server submission, hosting retention limits and unmeasured real-world efficacy.
- Fictional Learn does not reuse private results or make API submissions. Removed the old claimed 60-second exercise duration. Existing paper/ink/terracotta identity preserved.
- 169 backend + 18 frontend unit tests, Ruff, Vite production build and diff checks pass. Actual built-bundle/FastAPI Chromium suites pass at 320/390/1440px: resources in English/Hindi, all three lesson questions, official link targets, action separation/guards, no extra POST/storage/overflow/page errors. Full guided/quick/review/edit/privacy/stale-request/error suite passes, including actual 30-second expiry at 390px.
- Visually inspected desktop/mobile/Hindi result, actions, help, about and learn screenshots. Fixed source-button spacing, return-action spacing, ordered-list rendering and screenshot language labels after inspection. Local server rules-only; optional production ML unchanged. These are implementation checks, not user trials or measured detection accuracy.
- No push/publication. Accessibility/security hardening, real-user evaluation and launch support/privacy ownership remain next-stage work.
