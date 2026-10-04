"""Fictional regression cases for literal payment/payout promises, not a benchmark."""
import pytest

from app.services import analyzer, model


@pytest.mark.parametrize('text', [
    'PLEASE invest 499 I give you 1600',
    'please invest 499 i will give you 1600',
    'Pay Rs 499 and we will pay you Rs 1,600',
    'Send ₹500, I return you ₹1000',
    'Deposit INR 1,000 we give you INR 3,000',
    'invest 499.50 I give you 1600.25',
    'ＩＮＶＥＳＴ ４９９ I give you １６００',
    'Beware of false claims. Invest 499 I give you 1600',
])
def test_explicit_large_payout_gets_high_signal(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze(text)
    assert result['risk_score'] == 60
    assert result['risk_level'] == 'high'
    assert result['label'] == 'promotion'
    flag = result['flags'][0]
    assert flag['id'] == 'amount_payout'
    assert flag['phrase'] and flag['en'] and flag['hi']
    assert result['verification_status'] == 'not_verified'


@pytest.mark.parametrize('text', [
    'PLEASE invest 499 in an index fund. My monthly budget is 1600.',
    'I paid 499 for a book and saved 1600 last month.',
    'Invest 499 monthly; over many years the balance may reach 1600.',
    'Invest 499 I give you 500',
    'Invest 0 I give you 1600',
    'Invest 499 I give you 900',
    'Invest 499 I give you 1600 reward points',
    'Invest 499 I give you 1600 shares',
    'Beware: invest 499 I give you 1600',
    'Do not invest 499 I give you 1600',
    'Scam awareness: "invest 499 I give you 1600"',
    'For example, invest 499 I give you 1600',
    'Math exercise: invest 499 I give you 1600',
    '"invest 499 I give you 1600" is a scam warning.',
    'Suppose you invest 499 I give you 1600. This is hypothetical.',
])
def test_warning_or_unrelated_amounts_do_not_add_signal(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    assert analyzer.analyze(text)['risk_score'] == 0


def test_payout_signal_deduplicated_and_weights_capped(monkeypatch):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze('Invest 499 I give you 1600. Pay 500 I give you 2000. Guaranteed returns, limited seats, pay first.')
    assert sum(f['id'] == 'amount_payout' for f in result['flags']) == 1
    assert result['risk_score'] == 100
