"""Report frozen v2 synthetic scenarios. Never tune on these results.
Usage from backend/: python -m ml.evaluate [--output PATH]
Optional --model PATH compares a trusted earlier model. Scores are not calibrated.
"""
import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

import joblib
from sklearn.metrics import classification_report, confusion_matrix, f1_score

from app.config import MODEL_PATH
from app.services import rules
from app.services.analyzer import decide_label, find_flags
from app.services.model import CONFIDENCE_THRESHOLD

from .corpus import DATA, LABELS, evaluation_rows, training_rows, validate


def metrics(y, pred):
    return dict(macro_f1=f1_score(y, pred, labels=list(LABELS), average='macro', zero_division=0),
                abstentions=pred.count('uncertain'), coverage=1 - pred.count('uncertain') / len(y),
                classification_report=classification_report(y, pred, labels=list(LABELS),
                    output_dict=True, zero_division=0),
                confusion_matrix=confusion_matrix(y, pred, labels=[*LABELS, 'uncertain']).tolist(),
                matrix_order=[*LABELS, 'uncertain'])


def evaluate(path):
    rows = evaluation_rows()
    validate(training_rows(), rows)
    if not path.exists():
        raise ValueError('No trained model. Run python -m ml.train first, then restart the API.')
    classifier = joblib.load(path)  # Only trusted locally produced model files.
    y = [r['label'] for r in rows]
    predictions = {'rules_only': [], 'model_argmax': [], 'model_thresholded': [], 'hybrid_api': []}
    for row, values in zip(rows, classifier.predict_proba([r['text'] for r in rows])):
        flags, _ = find_flags(row['text'])
        rl = rules.fallback_label(row['text'], flags)
        raw = str(classifier.classes_[values.argmax()])
        ml = raw if values.max() >= CONFIDENCE_THRESHOLD else 'uncertain'
        for name, label in [('rules_only', rl), ('model_argmax', raw),
                            ('model_thresholded', ml), ('hybrid_api', decide_label(rl, ml))]:
            predictions[name].append(label)
    report = dict(evaluation_rows=len(rows), scenario_groups=len({r['group_id'] for r in rows}),
        labels=dict(Counter(y)), languages=dict(Counter(r['language'] for r in rows)),
        synthetic_only=True, independently_reviewed=False, threshold=CONFIDENCE_THRESHOLD,
        evaluation_sha256=hashlib.sha256((DATA / 'overnight_eval.json').read_bytes()).hexdigest(),
        model_sha256=hashlib.sha256(path.read_bytes()).hexdigest(), systems={}, by_language={})
    for name, pred in predictions.items():
        report['systems'][name] = metrics(y, pred)
    for language in sorted({r['language'] for r in rows}):
        ids = [i for i, r in enumerate(rows) if r['language'] == language]
        report['by_language'][language] = {name: metrics([y[i] for i in ids], [p[i] for i in ids])
                                         for name, p in predictions.items()}
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', type=Path, default=MODEL_PATH)
    parser.add_argument('--output', type=Path, default=DATA / 'evaluation_report.json')
    args = parser.parse_args()
    report = evaluate(args.model)
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print('Synthetic evaluation, 16 scenarios with 3 language variants each, not 48 independent trials.')
    for name, result in report['systems'].items():
        print(name, 'macro-F1:', round(result['macro_f1'], 3), 'abstentions:', result['abstentions'])
        for label in LABELS:
            m = result['classification_report'][label]
            print(label, 'precision', round(m['precision'], 3), 'recall', round(m['recall'], 3))
    print('Report:', args.output)
    print('Same-author synthetic benchmark, not real-world accuracy. Do not tune on it.')


if __name__ == '__main__':
    main()
