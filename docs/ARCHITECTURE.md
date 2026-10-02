# Architecture

TipCheck takes a pasted financial message and returns a transparent red-flag check. It is an educational tool, not a fraud detector or investment advice.

```
React (Vite)  --POST /api/analyze-->  FastAPI  -->  analyzer
 frontend/                            backend/app     |- rules.py  (SEBI-based red-flag regexes, EN + HI text)
                                                      |- model.py  (optional TF-IDF + LogReg, ml/model.joblib)
```

## Backend (`backend/app`)

| Module | Job |
|---|---|
| `main.py` | App factory, optional CORS from env |
| `api/routes.py` | `GET /health`, `POST /analyze` (thin, no logic) |
| `schemas.py` | Pydantic request/response models and input limits (5-2000 chars) |
| `services/rules.py` | Rule table: id, regex, weight, English and Hindi explanation, SEBI source |
| `services/analyzer.py` | Splits text into sentences, applies rules, suppresses local protective/negated matches without blanket-hiding later sales claims, sums score (cap 100) |
| `services/model.py` | Loads the optional model; if absent the API runs in `rules-only` mode |
| `ml/train.py` | Trains from `ml/data/dataset.csv` with group-aware splits; writes `ml/model.joblib` (git-ignored) |

Risk level: `high` at score >= 50, `some` at 1-49, `none_detected` at 0. Model label is `uncertain` below 0.65 confidence. In rules-only mode the label is `promotion` (explicit active call to participate, or score >= 50), `education` (no flags and education wording) or `uncertain`.

## Frontend (`frontend/src`)

`App.jsx` holds state. `api/client.js` is the only place that calls the backend. Components: `Header`, `ExampleList`, `MessageForm`, `ResultPanel`, `VerdictBadge`, `RiskMeter`, `FlagList`. All UI text lives in `i18n.js` (English and Hindi). Hindi/English text is picked from each flag's `en`/`hi` field.

## Literacy coach

`lib/learning.js` creates three deterministic prompts from the result: matched phrase or no-signal limits, score interpretation, and independent identity verification. `LiteracyCoach` owns temporary answers and bilingual feedback. No extra API call, persistent score or claim of improved real-world learning. A new analysis resets practice.

## Privacy rules

- Never log request bodies; no third-party analytics.
- Links in a message are listed as text and never fetched.
- Examples and datasets use fictional or team-written text only.

## Adding a rule

Add a tuple to `RULES` in `services/rules.py` with both English and Hindi text, then add a case in `backend/tests/test_rules.py`.

## Known limits

Rules and the model are illustrative. No flags does not mean a message is safe. No registration or financial claim is verified.

## Verdict logic

Rules lead. If the rules say `promotion` or `education`, that stands. Only uncertain rule cases can use a model label whose top score is >= 0.65. If the model is missing or unsure, the rules label stands (`promotion`, `education` or `uncertain`). See `decide_label` in `services/analyzer.py`. `ml/evaluate.py` scores rules-only, model-only and hybrid on the held-out split.

## Production single-origin route

When `frontend/dist` exists, FastAPI mounts those static files last. `/api/health` and `/api/analyze` aliases bypass the static mount; existing `/health`, `/analyze` and `/docs` remain. No Vite proxy or CORS needed on one origin. See DEPLOYMENT.md for commands and host caveats.
