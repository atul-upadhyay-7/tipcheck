# Deploy the verified build

No live deployment was made by this work. These commands were tested locally; account access, current host eligibility and the actual public URL must be checked when you deploy. The repository can stay private when granting a hosting provider access. Public-repo submission requirements are a separate owner decision.

## Simplest route: one web service

FastAPI serves `frontend/dist` when that directory exists. `/api/health` and `/api/analyze` run before the static mount; `/health`, `/analyze` and `/docs` remain available. The frontend's default `/api` now works in production on the same origin, without the development proxy or CORS.

From repository root, after installing dependencies:

```bash
npm --prefix frontend ci
npm --prefix frontend run build
cd backend
# Optional model, generate before server start
.venv/bin/python -m ml.train
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://127.0.0.1:8000`, not the Vite dev server. Check `/api/health`, all demo seeds, Hindi and the coach. In another terminal:

```bash
python3 scripts/smoke.py http://127.0.0.1:8000/api
```

Windows substitutes `.venv\Scripts\python.exe`. No `--reload` for a public service. Keep `VITE_API_BASE_URL` and CORS unset for single-origin hosting. `TIPCHECK_FRONTEND_DIST` can override the static directory; normal builds need no override.

## Concrete candidate: Render Free web service

Official docs checked October 2, 2026. This is setup guidance, not a promise that a particular account has free capacity. Render warns Free services are not for production-grade availability.

Create one **Web Service**, connect this repository, choose the Python 3 runtime and the Free compute plan. Keep Root Directory blank (repository root). Review the plan and billing settings before committing.

| Setting | Value |
| --- | --- |
| Branch | `main`, after the final verified push |
| Build command | `pip install -r backend/requirements.txt && npm --prefix frontend ci && npm --prefix frontend run build && cd backend && python -m ml.train` |
| Start command | `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health-check path | `/api/health` |
| `NODE_VERSION` | `22.23.3` (local build version used for verification) |
| `PYTHON_VERSION` | `3.12.8` (supported project minor; local verification used 3.10, CI uses 3.12) |
| `VITE_API_BASE_URL` | Leave unset, default `/api` |
| `TIPCHECK_CORS_ORIGINS` | Leave unset for same-origin deployment |
| `TIPCHECK_MODEL_PATH` | Leave unset; build generates the default file |

Render's native runtime docs list Node/npm alongside Python utilities. If the model build is too slow or memory-constrained, remove only `&& cd backend && python -m ml.train` from the build command, and disclose rules-only mode. Do not claim trained mode unless `/api/health` reports it. Generated models are recreated on each build, not committed.

### Free-service limits that matter for a demo

- Spins down after 15 minutes without incoming traffic; a new request can take about one minute to wake it. Open the site shortly before presenting and allow it to load. The app has a 15-second request timeout, so a cold API request may need a retry after wakeup.
- Filesystem is ephemeral; models must be generated during build, not uploaded manually.
- Current Free allocation is 750 instance-hours per workspace per month, shared across services. Bandwidth/build-minute limits also apply. With a saved payment method, excess usage can produce charges; without one, services/builds can be suspended. Check your workspace usage/spend settings.
- No paid disks, database, API key or background worker is needed here. Do not choose an upgrade just to get past a free limit.
- Public hosting changes the privacy boundary: pasted text goes to the host. Use fictional demo inputs, verify logs do not contain request bodies and do not promise local-only privacy for a hosted build.

## Variant: Vercel frontend + Render API

Use this if the team prefers Vercel for static hosting. Single-service Render above remains the simpler default because it avoids two domains and CORS. No account/service is created by these instructions.

### Render API

Create a Python 3 **Web Service**, choose Free only after reviewing limits, and set Root Directory to `backend`.

- Build command: `pip install -r requirements.txt && python -m ml.train`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health-check path: `/api/health`
- Environment: `PYTHON_VERSION=3.12.8`. Leave model path unset. Remove training from build only if deliberately demoing rules-only.
- Obtain the actual API URL from Render after deploy, for example the host-issued `https://...onrender.com` URL. Do not invent or guess it.

### Vercel frontend

Import the same GitHub repository as a Vercel project. Use Root Directory `frontend`, Framework Preset **Vite**, install command `npm ci`, build command `npm run build`, output directory `dist`. Choose Node 22.x compatible with Vite (22.12+). Review the account's plan/usage terms before deploy.

In **Vercel Project Settings -> Environment Variables**, set:

```text
VITE_API_BASE_URL = <actual Render API origin>/api
```

Example format only: `https://YOUR_API_HOST/api`. Replace with the real Render URL, with no trailing slash after `/api`. Apply to Production, and Preview only if you plan to configure its origin too. Redeploy after setting/changing this value, because Vite embeds it at build time. Do **not** set `VITE_API_PROXY_TARGET` for production: Vercel does not run the Vite development proxy.

After Vercel issues the real frontend URL, set in **Render service -> Environment**:

```text
TIPCHECK_CORS_ORIGINS = <actual Vercel frontend origin>
```

Example format only: `https://YOUR_PROJECT.vercel.app`. Exact scheme/host, no path or trailing slash. Restart/redeploy the API after changing it. A custom domain is a different origin and must be explicitly added. Multiple reviewed origins are comma-separated. Do not use a wildcard. Dynamic preview URLs are not automatically permitted; add only the exact preview origin you intend to test or stick to Production.

Open the Vercel site and check an analysis plus the coach. If the browser shows a CORS error, compare the actual browser origin against the Render environment value. If it calls Vercel `/api` instead of Render, the frontend variable was missing at build time: set it and redeploy. All Render cold-start, free-usage and hosted-privacy caveats above still apply.

Vercel docs: https://vercel.com/docs/frameworks/frontend/vite ; https://vercel.com/docs/environment-variables

## Before sharing the public URL

1. Confirm the final commit and successful build logs, with no credentials committed.
2. Open `/api/health`, frontend root and `/docs`; check expected mode.
3. Try promotion, protective warning, paid course, Hindi, no-flags and coach completion.
4. Check a phone-size screen, cold start and error/retry once.
5. Review billing, privacy/logging and contest disclosure/IP requirements. Keep an offline local-demo backup.

Sources: https://render.com/docs/deploy-fastapi ; https://render.com/docs/free ; https://render.com/docs/native-runtimes ; https://render.com/docs/node-version ; https://render.com/docs/python-version
