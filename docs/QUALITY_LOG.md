# Prototype quality checks

## October 2, 2026: context and interface fixes

- Added fictional adversarial regressions for mixed warnings/pitches, investment-advice disclaimers, paid courses, Hinglish, Hindi and full-width text.
- Warning handling is local rather than a blanket sentence exemption. Explicit negation still suppresses that claim. Repeated matches are inspected so an earlier warning does not hide a later pitch.
- Explicit promotions can have zero red flags. Promotion is a content type, not an accusation of fraud. Clear rule-based education is not overwritten by the optional model.
- Editing a message clears the previous result. Older requests cannot overwrite a newer message. Hindi score explanations and engine labels no longer fall back to English.
- Visually inspected actual desktop and 390px Hindi mobile screenshots. No horizontal overflow or missing Hindi glyphs; result, score, explanations and verification steps are readable.
- Full-stack browser checks exercised promotion, education, language switching and stale-result clearing. Backend tests, lint, frontend build and proxy smoke passed with the generated model loaded.

These are developer-authored regression cases, not an independent benchmark. No new accuracy claim is made. The earlier dataset metrics describe the previous hybrid implementation; rule/context changes mean they must not be presented as current-model performance. Keep the previous held-out split untouched rather than repeatedly tuning against it. A new independently reviewed test set is needed for a new score.

## Known limitations

Regexes do not understand all quotation, sarcasm, mixed contexts or negation. Unknown wording can be missed. Training data is synthetic and the model is not calibrated. URLs are displayed as text, not fetched, and neither claims nor identities are verified. No flags never means safe.

Before submission: have another Hindi speaker review wording, add independently authored evaluation examples, practise the demo offline, and confirm organiser team/outside-help/IP rules. No prototype or score guarantees a competition win.
