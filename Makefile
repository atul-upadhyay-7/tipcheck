.PHONY: install backend frontend test build lint train smoke

install:
	cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
	cd frontend && npm ci

backend:
	cd backend && .venv/bin/python -m uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

test:
	cd backend && .venv/bin/python -m pytest -q

lint:
	cd backend && .venv/bin/ruff check .

build:
	cd frontend && npm run build

train:
	cd backend && .venv/bin/python -m ml.train

smoke:
	python3 scripts/smoke.py
