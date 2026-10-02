# TipCheck

**Read the tip. Not the hype.**

A bilingual financial-content literacy prototype for Sangyan Track E. Paste a fictional stock tip or investment pitch, inspect its likely content type and matched warning phrases, then practise how to question the message before trusting it.

> Educational prototype, not a fraud detector, fact-checker or investment adviser. Promotion does not mean fraud. No flags does not mean safe. Sources and identities are not verified.

## What works

- **Paste and check:** 5-2000 characters, promotion / education / unclear verdict.
- **Explainable red-flag meter:** unique rule weights summed and capped at 100, with the exact phrase, English/Hindi explanation and official SEBI reference. This is a design heuristic, not scam probability or a SEBI rating.
- **Independent verification checklist:** compare the claimed entity and contacts against official resources. Detected message URLs stay inert text and are never fetched.
- **Spot the signal literacy coach:** three short questions tied to the result. Learn the meaning of a matched phrase, the limits of the score and why a registration number is not proof of identity. Immediate bilingual feedback; no answers saved or safety certificate issued.
- **Phone-first interface:** paper/ink/terracotta palette, responsive input/evidence layout, full Hindi text, keyboard focus and reduced-motion support.
- **Reliable local demo:** six fictional seeds, optional local model, 15-second request timeout, error/retry handling, stale-result prevention and phone result navigation.

## Quick start

### Requirements

Node.js 22.12+ is recommended (Vite also supports compatible 20.19+ releases). Python 3.10-3.12 works with the current project; CI uses 3.12. Have both runtimes installed before setup. There is no API key, subscription, hosted service or GPU requirement.

### macOS / Linux

From the repository root:

```bash
make install
# Optional: generate the model before starting the backend
make train
```

Keep two terminals running:

```bash
# Terminal 1, repository root
make backend
```

```bash
# Terminal 2, repository root
make frontend
```

Open the address Vite prints, normally `http://localhost:5173`. The browser calls `/api/analyze`; Vite proxies it to FastAPI on port 8000. API docs: `http://127.0.0.1:8000/docs`.

### Windows PowerShell / manual setup

```powershell
# Terminal 1
cd backend
py -3 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
# Optional: train before starting the server
.venv\Scripts\python.exe -m ml.train
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

```powershell
# Terminal 2, start from repository root
cd frontend
npm ci
npm run dev
```

Directly invoking the virtual environment avoids needing to change PowerShell execution policy. On macOS/Linux, the equivalent interpreter is `backend/.venv/bin/python`.

## Demo in about three minutes

1. Choose **Guaranteed returns**. Show the promotion verdict, matched promises/pressure and heuristic score. Explain that this is not proof of fraud.
2. Choose **Scam warning**. Show why protective warning context does not get treated like the pitch it warns against.
3. Choose **Paid course**. Explain that something can be promotional with zero red flags. Zero is not a safety endorsement.
4. Switch to Hindi and choose the Hindi pressure tip. Show the same explanations and verification steps.
5. Open **Spot the signal** and answer a question. Show the feedback teaching a reusable distinction rather than simply issuing a label.

Use only fictional examples. After installation and optional model training, the local analysis and coach work offline; opening official source links needs internet. Practise on the actual presentation laptop before recording.

## File architecture

```text
tipcheck/
├── backend/
│   ├── app/
│   │   ├── main.py                FastAPI app factory and optional CORS
│   │   ├── config.py              Model path and input limits
│   │   ├── schemas.py             Request / response validation
│   │   ├── api/routes.py          GET /health and POST /analyze
│   │   └── services/
│   │       ├── analyzer.py        Normalization, context and hybrid verdict
│   │       ├── rules.py           Bilingual rule table and source mapping
│   │       └── model.py           Optional local classifier loader
│   ├── ml/
│   │   ├── build_dataset.py       Reproducible synthetic-data builder
│   │   ├── corpus.py              Scenario loader and split guards
│   │   ├── train.py               Train-only grouped CV and fitting
│   │   ├── evaluate.py            Frozen synthetic evaluation and language metrics
│   │   └── data/                 CSV, multilingual scenarios, JSON reports and caveats
│   ├── tests/                    API, rule and adversarial regressions
│   ├── requirements.txt          Runtime dependencies
│   └── requirements-dev.txt      Test / lint dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx               Message, language and request state
│   │   ├── api/client.js         Bounded backend request
│   │   ├── components/           Input, verdict, flags, meter, coach, panels
│   │   ├── lib/learning.js       Deterministic result-based lesson prompts
│   │   ├── data/examples.js      Six fictional demo messages
│   │   ├── i18n.js               English / Hindi UI and teaching copy
│   │   └── style.css             Tailwind import and editorial design
│   ├── tests/                    Node-native API client and lesson tests
│   ├── vite.config.js            React, Tailwind and local API proxy
│   └── package-lock.json         Reproducible frontend dependency install
├── scripts/smoke.py              End-to-end checks through the Vite proxy
├── docs/                        Architecture, quality log, UI and notices
├── .github/workflows/ci.yml      Backend checks and frontend build
├── .env.example                 Optional configuration reference
└── Makefile                     Setup, run, test, lint, build, train, smoke
```

### Request flow

```text
Pasted text -> React -> POST /api/analyze -> Vite proxy -> FastAPI
                                                       -> local rules
                                                       -> optional TF-IDF model
Result JSON -> verdict / phrases / score / official checks
            -> local bilingual literacy coach (no extra network request)
```

Rules lead for explicit promotion and protective education. The optional model fills uncertain cases when its top score is at least 0.65. Those model scores are not calibrated confidence or fraud probability. A missing model leaves a working rules-only app.

## Checks

```bash
make test    # 39 backend tests + 7 frontend tests at this revision
make lint    # Ruff backend checks
make build   # Vite production frontend build
make smoke   # Both dev servers must already be running
```

Manual equivalents:

```bash
cd backend
.venv/bin/python -m pytest -q
.venv/bin/ruff check .
# From frontend/
npm test
npm run build
# From repository root, stack running
python3 scripts/smoke.py
```

Windows uses `.venv\Scripts\python.exe` and `.venv\Scripts\ruff.exe` instead. Tests are developer regressions, not an independent accuracy benchmark. Screenshot checks and an automated accessibility check cover selected states, not every device or full accessibility certification. See [quality log](docs/QUALITY_LOG.md).

## Dataset and model limits

The starter CSV contains **286 entirely synthetic rows**, with group-separated train/test splits. Expanded training uses its 204 train rows plus 90 new English/Hinglish/Hindi scenario texts: **294 training rows**. A new frozen evaluation has 48 texts in 16 scenario groups. No private chat scraping or real scam-message dataset is included. Read [dataset provenance](backend/ml/data/README.md) and [expanded evaluation](backend/ml/data/EVALUATION_V2.md) before quoting metrics.

The expanded hybrid/API macro-F1 is **0.609** on that same-author synthetic slice, with promotion precision **1.000**, recall **0.333**, and **25/48 abstentions**. Raw model argmax scores higher but is not the API behavior. Small synthetic results are not real-world accuracy; missed promotions and Hinglish limitations remain.

`make train` writes a git-ignored `backend/ml/model.joblib`. Restart the backend after training. Only load trusted team-produced model files: joblib/pickle can execute code. Historical synthetic benchmark numbers describe an earlier implementation, not current API performance or real-world accuracy. Do not tune repeatedly against the held-out split. The new slice was frozen before fitting but still needs independent review. Future changes based on it require a fresh evaluation set. Training no longer scores evaluation data automatically.

## Configuration and deployment

Defaults need no environment file. `.env.example` is a reference, not an automatically loaded backend configuration file. Put frontend overrides in `frontend/.env.local`; supply backend settings through the process environment.

| Setting | Meaning |
| --- | --- |
| `VITE_API_PROXY_TARGET` | Development proxy target, default `http://127.0.0.1:8000` |
| `VITE_API_BASE_URL` | Browser API base URL, default `/api` |
| `TIPCHECK_MODEL_PATH` | Optional backend model file override; leave unset for default |
| `TIPCHECK_CORS_ORIGINS` | Comma-separated allowed direct browser origins; empty by default |

`npm run build` creates static assets but **does not include the Vite dev proxy**. Uploading `dist/` alone will not make the Python API work. FastAPI now serves a built `frontend/dist` and the `/api` aliases on one origin. Build the frontend and start FastAPI to serve the app on one origin; hosted deployment will be handled separately. No live hosting deployment has been created or verified.

## Privacy, safety and contribution

- No database, analytics, intentional message storage or answer persistence. In the default setup, analysis stays on the local machine. Custom hosting/configuration can change that boundary.
- Remove names, phone numbers, account details and all private content before pasting. Never paste OTPs or credentials. No flags never means safe.
- Message URLs are text only. Official references are fixed links, not proof that a message, entity or claim was verified.
- Rules can miss unfamiliar wording, sarcasm, quotation, mixed context and negation. Hindi/Hinglish still needs independent review.
- Work in branches/PRs, run all checks and preserve dataset groups. Do not commit `.env`, model files, `.venv`, `node_modules`, personal chats or copied private data.
- This project has no blanket license grant pending team/organiser terms review. Third-party packages retain their licenses. New UI notices: [dependency notices](docs/UI_LICENSE_NOTICES.md), [design notes](docs/UI_DESIGN.md).
- No feature, score or design guarantees a competition win. Review eligibility, outside-help/disclosure and submission/IP terms before uploading.

Official guidance: [SEBI scam warning patterns](https://investor.sebi.gov.in/spot-any-scam.html), [SEBI intermediary resources](https://www.sebi.gov.in/intermediaries.html).
