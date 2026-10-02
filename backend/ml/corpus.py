"""Load synthetic scenarios without ever adding evaluation rows to training."""
import csv
import json
from pathlib import Path

DATA = Path(__file__).parent / "data"
LABELS = ("education", "promotion")
LANGUAGES = ("en", "hinglish", "hi")


def scenarios(filename, split):
    rows = []
    for label, group, texts in json.loads((DATA / filename).read_text(encoding="utf-8")):
        if label not in LABELS or len(texts) != len(LANGUAGES):
            raise ValueError("Invalid label or language count")
        for language, text in zip(LANGUAGES, texts):
            rows.append(dict(text=text, label=label, group_id=f"v2_{group}",
                             split=split, source="scenario_synthetic", language=language))
    return rows


def training_rows():
    legacy = list(csv.DictReader((DATA / "dataset.csv").open(encoding="utf-8-sig")))
    train = [dict(r, language="legacy_unspecified") for r in legacy if r["split"] == "train"]
    # Training-only label correction: selling a paid course is promotion, not fraud.
    for row in train:
        if row["group_id"] == "h_e17":
            row["label"] = "promotion"
    return train + scenarios("overnight_train.json", "train")


def evaluation_rows():
    return scenarios("overnight_eval.json", "evaluation")


def validate(train, test):
    if not train or not test:
        raise ValueError("Both partitions are required")
    for partition in (train, test):
        texts = [r["text"].strip().casefold() for r in partition]
        if len(texts) != len(set(texts)):
            raise ValueError("Duplicate text within partition")
        for r in partition:
            if r["label"] not in LABELS or not r["text"].strip():
                raise ValueError("Invalid row")
        groups = {}
        for r in partition:
            if r["group_id"] in groups and groups[r["group_id"]] != r["label"]:
                raise ValueError("Conflicting labels in scenario")
            groups[r["group_id"]] = r["label"]
    if {r["group_id"] for r in train} & {r["group_id"] for r in test}:
        raise ValueError("Scenario crosses partitions")
    if {r["text"].strip().casefold() for r in train} & {r["text"].strip().casefold() for r in test}:
        raise ValueError("Text crosses partitions")
