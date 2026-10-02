"""Runtime settings, read from environment variables (see .env.example)."""
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = Path(os.getenv("TIPCHECK_MODEL_PATH", BACKEND_DIR / "ml" / "model.joblib"))
CORS_ORIGINS = [o.strip() for o in os.getenv("TIPCHECK_CORS_ORIGINS", "").split(",") if o.strip()]
FRONTEND_DIST = Path(os.getenv("TIPCHECK_FRONTEND_DIST") or BACKEND_DIR.parent / "frontend" / "dist")
MIN_TEXT_LENGTH = 5
MAX_TEXT_LENGTH = 2000
