"""Structural dataset guards, not classifier performance tests."""
import copy

import pytest

from ml.corpus import evaluation_rows, training_rows, validate


def test_split_and_language_counts():
    train, test = training_rows(), evaluation_rows()
    validate(train, test)
    assert len(train) == 294
    assert len(test) == 48
    assert len({r['group_id'] for r in test}) == 16
    assert {r['language'] for r in test} == {'en', 'hi', 'hinglish'}
    assert all(r['split'] == 'train' for r in train)


def test_cross_partition_group_rejected():
    train, test = training_rows(), copy.deepcopy(evaluation_rows())
    test[0]['group_id'] = train[0]['group_id']
    with pytest.raises(ValueError, match='crosses partitions'):
        validate(train, test)


def test_cross_partition_text_rejected():
    train, test = training_rows(), copy.deepcopy(evaluation_rows())
    test[0]['text'] = train[0]['text'].upper()
    with pytest.raises(ValueError, match='Text crosses'):
        validate(train, test)


def test_duplicate_rejected():
    train, test = training_rows(), evaluation_rows()
    with pytest.raises(ValueError, match='Duplicate'):
        validate(train, test + [test[0]])
