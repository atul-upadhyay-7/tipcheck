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
