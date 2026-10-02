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

## Known limitations

Regexes do not understand all quotation, sarcasm, mixed contexts or negation. Unknown wording can be missed. Training data is synthetic and the model is not calibrated. URLs are displayed as text, not fetched, and neither claims nor identities are verified. No flags never means safe.

Before submission: have another Hindi speaker review wording, add independently authored evaluation examples, practise the demo offline, and confirm organiser team/outside-help/IP rules. No prototype or score guarantees a competition win.
