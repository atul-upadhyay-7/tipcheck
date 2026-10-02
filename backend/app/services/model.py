"""Optional locally trained text classifier. The API works without it (rules-only mode)."""
import logging
from typing import Optional

import joblib

from ..config import MODEL_PATH

log = logging.getLogger(__name__)
CONFIDENCE_THRESHOLD = 0.65

_model = None
if MODEL_PATH.exists():
    try:
        _model = joblib.load(MODEL_PATH)
    except Exception:  # corrupt or incompatible model file: fall back to rules-only
        log.exception("Could not load model at %s; running rules-only", MODEL_PATH)


def mode() -> str:
    return "ml+rules" if _model else "rules-only"


def predict(text: str) -> tuple[Optional[str], Optional[dict[str, float]]]:
    """Return (label, per-class scores), or (None, None) when no model is loaded."""
    if not _model:
        return None, None
    values = _model.predict_proba([text])[0]
    scores = {str(k): round(float(v), 3) for k, v in zip(_model.classes_, values)}
    label = str(_model.classes_[values.argmax()]) if values.max() >= CONFIDENCE_THRESHOLD else "uncertain"
    return label, scores
