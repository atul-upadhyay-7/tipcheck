# TipCheck

Sangyan Hackathon (IIT BHU), Track E. Paste a stock "tip" and TipCheck shows whether it reads like education or a disguised promotion, with a risk meter and red flags based on SEBI's scam guidance, explained in English and Hindi.

This is an educational prototype. It is not a fraud detector, fact-checker, or investment advice.

## Structure

```
backend/            FastAPI service
  app/              api/, services/ (rules, analyzer, model), schemas, config
  ml/               train.py and data/ (optional classifier)
  tests/            pytest suite
frontend/           React + Vite
  src/              api/, components/, data/, i18n.js (English + Hindi UI text)
scripts/smoke.py    end-to-end smoke test
docs/ARCHITECTURE.md
.github/workflows/  CI (lint, tests, build)
```

## Run locally

Needs Node.js 20.19+ (22 recommended) and Python 3.10-3.12.

```bash
# terminal 1 - backend
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
python -m uvicorn app.main:app --reload

# terminal 2 - frontend
cd frontend
npm ci                           # or: npm install
npm run dev
```

Open the URL Vite prints. The dev server proxies `/api` to FastAPI on port 8000. No API keys, paid services or database needed. Copy `.env.example` if you need to change defaults.

API docs: http://127.0.0.1:8000/docs

## Test and build

```bash
cd backend && python -m pytest -q && ruff check .
cd frontend && npm run build
```

`make install`, `make test`, `make lint`, `make build` do the same.

End-to-end check (backend and frontend dev servers running): `make smoke` posts sample tips through the Vite proxy and checks verdict and risk level.

## Optional ML model

Add the team dataset at `backend/ml/data/dataset.csv` (see `backend/ml/data/README.md`), then `make train`. Without a model the API runs in `rules-only` mode.

## Team working agreement

- Use branches and pull requests; CI must pass.
- Keep the dataset team-authored, reviewed, and split by group before making any ML claims.
- Never commit `.venv`, `node_modules`, `.env`, model files, or personal or copied chat data.
- Do not add request-body logging or analytics.
- Review the hackathon terms before sharing publicly. No license until then.

## Limits and privacy

A low or empty red-flag score does not mean a message is safe. Links are not opened or verified. Do not paste real names, phone numbers, account details, OTPs or private messages. Use fictional examples for demos. Input is processed locally.
