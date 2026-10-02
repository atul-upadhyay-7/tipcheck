"""Train the optional classifier. Usage (from backend/): python -m ml.train
Needs ml/data/dataset.csv with columns text,label,group_id,split (train/test)."""
import csv
from pathlib import Path

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import FeatureUnion, Pipeline

root = Path(__file__).parent
rows = list(csv.DictReader((root/'data'/'dataset.csv').open(encoding='utf-8-sig')))
train = [r for r in rows if r['split'] == 'train']
test = [r for r in rows if r['split'] == 'test']
assert train and test, 'Create train and untouched test partitions first.'
assert not ({r['group_id'] for r in train} & {r['group_id'] for r in test})
assert not ({r['text'].strip().lower() for r in train} & {r['text'].strip().lower() for r in test})

def make_model(classifier):
    return Pipeline([('features', FeatureUnion([
        ('word', TfidfVectorizer(ngram_range=(1,2), min_df=1, max_features=5000)),
        ('char', TfidfVectorizer(analyzer='char', ngram_range=(3,5), min_df=2, max_features=10000))
    ])), ('clf', classifier)])

x = [r['text'] for r in train]; y = [r['label'] for r in train]
groups = [r['group_id'] for r in train]
# Optional comparison: train-only grouped CV. Never pick the model on final-test results.
models = {'logreg': lambda: LogisticRegression(max_iter=1500, class_weight='balanced', random_state=42)}
try:
    from lightgbm import LGBMClassifier
    models['lightgbm'] = lambda: LGBMClassifier(n_estimators=80, num_leaves=7, max_depth=3, min_child_samples=5, learning_rate=.05, verbosity=-1, random_state=42, n_jobs=1)
except (ImportError, OSError):
    print('LightGBM unavailable. Keeping the logistic regression baseline.')

scores = {}
for name, factory in models.items():
    fold_scores = []
    for a,b in StratifiedGroupKFold(3,shuffle=True,random_state=42).split(x,y,groups):
        m = make_model(factory()); m.fit([x[i] for i in a],[y[i] for i in a])
        fold_scores.append(f1_score([y[i] for i in b],m.predict([x[i] for i in b]),average='macro',zero_division=0))
    scores[name] = float(np.mean(fold_scores))
print('Train-only grouped CV macro-F1:', scores)
winner = max(scores, key=scores.get)
model = make_model(models[winner]()); model.fit(x,y)
target = [r['label'] for r in test]; pred = model.predict([r['text'] for r in test])
print('Final test, once. Model:', winner, 'n=',len(test))
print(classification_report(target,pred,zero_division=0))
print('Class order:',model.classes_); print(confusion_matrix(target,pred,labels=model.classes_))
joblib.dump(model,root/'model.joblib')

