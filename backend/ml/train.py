"""Train a reproducible optional classifier, selecting only on grouped train CV.
Usage from backend/: python -m ml.train. Evaluation is a separate command.
"""
import json
from collections import Counter
from pathlib import Path

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import FeatureUnion, Pipeline

from .corpus import DATA, evaluation_rows, training_rows, validate

ROOT = Path(__file__).parent


def make_model(classifier):
    return Pipeline([('features', FeatureUnion([
        ('word', TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=5000)),
        ('char', TfidfVectorizer(analyzer='char', ngram_range=(3, 5), min_df=2, max_features=10000))
    ])), ('clf', classifier)])


def main():
    train = training_rows()
    # Read only for structural split validation. No evaluation predictions or tuning here.
    validate(train, evaluation_rows())
    x = [r['text'] for r in train]
    y = [r['label'] for r in train]
    groups = [r['group_id'] for r in train]
    models = {'logreg': lambda: LogisticRegression(max_iter=1500, class_weight='balanced', random_state=42)}
    try:
        from lightgbm import LGBMClassifier
        models['lightgbm'] = lambda: LGBMClassifier(n_estimators=80, num_leaves=7, max_depth=3,
            min_child_samples=5, learning_rate=.05, verbosity=-1, random_state=42, n_jobs=1)
    except (ImportError, OSError):
        print('LightGBM unavailable. Keeping the logistic regression baseline.')
    scores = {}
    folds = StratifiedGroupKFold(3, shuffle=True, random_state=42)
    for name, factory in models.items():
        values = []
        for a, b in folds.split(x, y, groups):
            m = make_model(factory())
            m.fit([x[i] for i in a], [y[i] for i in a])
            values.append(f1_score([y[i] for i in b], m.predict([x[i] for i in b]),
                                  average='macro', zero_division=0))
        scores[name] = {'mean': float(np.mean(values)), 'folds': values}
    winner = max(scores, key=lambda name: scores[name]['mean'])
    model = make_model(models[winner]())
    model.fit(x, y)
    joblib.dump(model, ROOT / 'model.joblib')
    report = dict(model=winner, train_rows=len(train), train_groups=len(set(groups)),
                  train_labels=dict(Counter(y)), train_languages=dict(Counter(r['language'] for r in train)),
                  grouped_cv_macro_f1=scores, seed=42, evaluation_used_for_selection=False,
                  data_files=['dataset.csv (train only)', 'overnight_train.json'])
    (DATA / 'training_report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    print('Model saved. Restart the API after training. Run python -m ml.evaluate separately.')


if __name__ == '__main__':
    main()
