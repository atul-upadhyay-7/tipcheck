"""Score the pipeline on the held-out test split. Usage (from backend/): python -m ml.evaluate
Compares rules-only, model-only and the hybrid the API uses. Run it after `python -m ml.train`.
The test split is for reporting. Do not tune rules or the model on it."""
import csv
from pathlib import Path

from sklearn.metrics import classification_report, f1_score

from app.services import model, rules
from app.services.analyzer import decide_label, find_flags

rows = [r for r in csv.DictReader((Path(__file__).parent / "data" / "dataset.csv").open(encoding="utf-8-sig")) if r["split"] == "test"]
y = [r["label"] for r in rows]
rule_pred, model_pred, hybrid_pred = [], [], []
for r in rows:
    flags, _ = find_flags(r["text"])
    rl = rules.fallback_label(r["text"], flags)
    ml, _ = model.predict(r["text"])
    rule_pred.append(rl)
    model_pred.append(ml or "uncertain")
    hybrid_pred.append(decide_label(rl, ml))
print(f"test n={len(rows)} (synthetic, unseen template groups)")
for name, pred in (("rules-only", rule_pred), ("model-only", model_pred), ("hybrid (API)", hybrid_pred)):
    print(f"\n== {name}: macro-F1 (uncertain counts as wrong) = {f1_score(y, pred, average='macro', labels=['education', 'promotion'], zero_division=0):.3f}")
    print(classification_report(y, pred, labels=["education", "promotion"], zero_division=0))
if not model._model:
    print("NOTE: no model loaded; model-only and hybrid equal rules-only.")
