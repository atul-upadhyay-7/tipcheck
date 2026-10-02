# Dataset

`dataset.csv` has 286 labeled messages, `promotion` or `education`. Columns: `text`, `label`, `group_id`, `split`, `source`.

## Provenance (read this before quoting any number)

**Every row is synthetic.** No real chats, names, numbers or scam messages are copied in.

- `hand_written_synthetic` (40 rows): written by us to mimic patterns SEBI describes in its investor-awareness material (guaranteed returns, pay-first, fake trading apps, "sure shot" tips, urgency). Includes hard cases on purpose: promotions with few trigger words, and education that quotes scam phrases as warnings.
- `template_generated_synthetic` (246 rows): filled-in sentence templates (14 variations each), so rows from one template are near-duplicates.

Reference pages used for the patterns: https://investor.sebi.gov.in/spot-any-scam.html and https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf

Regenerate with `python -m ml.build_dataset` (from `backend/`). It is seeded, so the output is stable.

## Split

`group_id` = the template or hand-written message a row came from. A group is only ever in `train` or `test`, never both (`train.py` asserts this). Test is about 29% of rows (82 rows, 45 promotion / 37 education).

## Results (historical baseline, before October 2 context fixes)

The rule/context implementation has since changed. These numbers describe the earlier baseline, not the current API. New adversarial tests are regression tests, not an independent benchmark. See `docs/QUALITY_LOG.md` at the repository root.

Train-only grouped CV macro-F1 for logistic regression: 0.90. Final held-out test, run once (`python -m ml.train`, then `python -m ml.evaluate`):

| System | Macro-F1 on test | Promotion recall | Education recall |
|---|---|---|---|
| Rules only | 0.43 | 0.20 | 0.35 |
| Model only | 0.71 | 0.29 | 0.97 |
| Hybrid (what the API does) | 0.81 | 0.47 | 0.97 |

("uncertain" counts as a miss.) What this means:

- The model has never seen the test templates, and it misses more than half of the new promotion styles. It is a baseline, not a scam detector.
- Precision is high (it rarely calls education a promotion) mostly because the data is clean and synthetic. Real chat text is messier, so expect worse.
- The way to improve it is more varied, real-world-like examples written by the team (different wording, Hinglish, subtle pitches), not tuning on the test split. If you add data, keep groups intact and do not tune on `test`.

## Rules for adding data

- Fictional or team-written examples only. No real names, phone numbers, account details or copied chat data.
- Paraphrases of one message share a `group_id`; a group never appears in both splits.
- Use `test` once, at the end.
