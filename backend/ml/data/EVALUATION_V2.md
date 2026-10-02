# October 2 expanded synthetic benchmark

This is a prototype sanity check, not real-world accuracy. All examples were authored synthetically during the same development session. They have not had independent label or native-language review. Translations are correlated: 48 rows are **16 scenarios**, not 48 independent trials. Do not use these numbers to claim scam detection, calibrated confidence or a competition advantage.

## What changed

- Kept the starter CSV unchanged. Use only its 204 train rows for fitting. Its 82 historical test rows remain excluded.
- Added 90 authored train rows: 30 scenarios, each with English, Hinglish and Hindi wording. Includes subtle memberships, affiliate offers, paid education, mixed warnings plus pitches, ordinary definitions and protective warnings.
- Corrected the training-only label for starter group `h_e17`: a paid course invitation is promotion, regardless of its subject. Promotion does not mean fraud. The source CSV is retained for historical reproducibility.
- Froze `overnight_eval.json` before fitting: 16 new scenarios, 8 per label, with 3 language variants each. SHA-256: `6322aaec8d003c81cbb0f573705ac97e901b4adafa718ab1c17272351942161b`.
- Exact case-folded text and scenario groups may not cross splits. These checks do not prove semantic independence; related concepts and vocabulary remain.
- Model architecture and top-score threshold (0.65) are unchanged. Do not adjust them on these evaluation results. Train-only three-fold grouped CV selects between available classifiers. LightGBM was not installed, so logistic regression was the only candidate.

Total training: **294 rows, 75 groups**, 165 promotion / 129 education. New-language counts: 30 English, 30 Hinglish, 30 Hindi; 204 legacy rows have no reliable language annotation. Train grouped CV macro-F1: **0.907**, folds 0.906 / 0.885 / 0.930. This is still synthetic CV, not an external test.

## Evaluation, first report

The starter model was saved before expanded training and scored on this same frozen evaluation slice. It is not the historical starter test score. Expanded-model evaluation happened once after fitting; no changes were selected using the outcome. Re-running for reproducibility does not create a fresh independent benchmark.

| System | Starter macro-F1 | Expanded macro-F1 | Expanded abstentions / 48 |
| --- | ---: | ---: | ---: |
| Rules only | 0.211 | 0.211 | 41 |
| Model raw argmax | 0.515 | 0.873 | 0 |
| Model at API threshold | 0.308 | 0.480 | 31 |
| Hybrid/API decision | 0.480 | 0.609 | 25 |

Raw argmax is an experiment, **not how the API labels text**. Abstentions count as misses in class recall and the two-class macro-F1. Precision includes only predictions of that class. A high precision with very low recall is not evidence of reliability.

| Expanded hybrid class | Precision | Recall | Support |
| --- | ---: | ---: | ---: |
| Education | 0.933 | 0.583 | 24 |
| Promotion | 1.000 | 0.333 | 24 |

Hybrid coverage is 23/48 (47.9%). It misses or abstains on two thirds of promotions. One education example is labeled promotion. No predicted promotion was false on this small synthetic set, which does **not** establish zero false-positive risk.

| Language | Hybrid macro-F1 | Education recall | Promotion recall | Abstentions / 16 |
| --- | ---: | ---: | ---: | ---: |
| English | 0.585 | 0.625 | 0.250 | 9 |
| Hinglish | 0.545 | 0.375 | 0.375 | 10 |
| Hindi | 0.673 | 0.750 | 0.375 | 6 |

Eight examples per class per language are too few for broad language-quality claims. Hinglish remains weak. Quoted claims, legitimate finance-course discussion, subtle commercial wording and mixed intent need independent review. Confidence scores are uncalibrated model scores, not probabilities that a tip is safe or a scam.

## Reproduce

From `backend/`, with dependencies installed:

```bash
.venv/bin/python -m ml.train
.venv/bin/python -m ml.evaluate
```

Training writes the ignored model and tracked `training_report.json`; evaluation writes `evaluation_report.json`. Start/restart the API after training, then confirm health mode. JSON reports include class metrics, confusion matrices, language slices, hashes and abstentions. `baseline_evaluation_report.json` preserves the old-model comparison; its old binary is intentionally not shipped. Use only trusted locally produced joblib files.

Before another improvement selected using this report, retire this slice as a development diagnostic and reserve a separately reviewed new evaluation set. Real-world validation requires permitted, privacy-reviewed data and reviewers who did not author the training examples. Do not scrape private chats.
