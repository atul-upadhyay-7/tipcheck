# Dataset

Put the team-authored `dataset.csv` here (it is read by `ml/train.py`).

Columns: `text`, `label`, `group_id`, `split` (`train` or `test`).

Rules:
- Fictional or team-written examples only. No real names, phone numbers, account details or copied chat data.
- Paraphrases of one message share a `group_id`, and a group never appears in both splits.
- The `test` split is used once, at the end. Do not tune on it.
