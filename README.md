# TipCheck

Sangyan Hackathon Track E prototype: an educational check for financial messages, with transparent red-flag cues. This is not a fraud detector, fact-checker, or investment advice.

## Run locally

Requirements: Node.js 22.12+ and Python 3.11 or 3.12.

Backend (terminal 1):

```bash
cd backend
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Frontend (terminal 2, project root):

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The UI uses a local `/api` proxy to FastAPI; no cloud deployment, API key, paid service, or database is needed.

## Team working agreement

Use GitHub branches and pull requests for changes. Keep `backend/dataset.csv` team-authored, reviewed, and split by source/paraphrase groups before any ML claims. The training script uses TF-IDF with Logistic Regression; LightGBM is optional and can be skipped. Do not commit `.venv`, `node_modules`, generated model files, or any personal or copied chat data.

## Prototype limits and privacy

Rules and any locally trained model are illustrative only. A low or empty red-flag score does not mean a message is safe; links are not opened or verified, and no registration or financial claim is checked. Do not paste real names, phone numbers, account details, OTPs, or private messages. Use fictional examples for demos. Input is processed locally by the prototype; do not add request-body logging or third-party analytics.

Before public sharing, review the hackathon submission terms and clarify any ownership requirements. Do not add a license until the team has checked those terms.
