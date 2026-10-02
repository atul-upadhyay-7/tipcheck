"""Core analysis: rules + optional model -> verdict. Pure functions, no web code."""
import re
import unicodedata

from . import model, rules

NOTE = ("Red-flag score, not scam probability. No flags does not mean safe. "
        "Links are not opened or verified.")


def find_flags(text: str) -> tuple[list[dict], int]:
    """Return (flags, suppressed_count). Sentences with warning language are not flagged."""
    flags: list[dict] = []
    suppressed = 0
    for sentence in rules.SENTENCE_SPLIT.split(text):
        caution = bool(rules.WARNING.search(sentence))
        for rid, pattern, weight, en, hi in rules.RULES:
            m = re.search(pattern, sentence, re.I)
            if not m:
                continue
            if caution:
                suppressed += 1
                continue
            if not any(f["id"] == rid for f in flags):
                flags.append({"id": rid, "phrase": m.group(), "weight": weight,
                              "en": en, "hi": hi, "source": rules.source_for(rid)})
    return flags, suppressed


def analyze(raw_text: str) -> dict:
    text = unicodedata.normalize("NFKC", raw_text).strip()
    flags, suppressed = find_flags(text)
    score = min(100, sum(f["weight"] for f in flags))
    level = "high" if score >= 50 else "some" if score else "none_detected"
    label, scores = model.predict(text)
    if label is None:
        label = "promotion" if rules.PROMO.search(text) and flags else "uncertain"
    return {
        "label": label, "mode": model.mode(), "model_scores": scores,
        "risk_score": score, "risk_level": level, "flags": flags,
        "context_warning": bool(suppressed),
        "links": rules.URL.findall(text)[:5],
        "verification_status": "not_verified", "note": NOTE,
    }
