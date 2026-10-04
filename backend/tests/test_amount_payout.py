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


@pytest.mark.parametrize('text', [
    'Invest\n499\nand\nI\nwill\ngive\nyou\n1500\nin just 3 hour',
    'Inve\u200bst 499 and I\u200b will give you 1500 in just 3 hour',
    '💵𝐈𝐍𝐕𝐄𝐒𝐓💰499💎AND💸GET💰1,500/-',
    'Invest 499 and get 1500',
    '₹1000/- AND GET 9,000/-',
    '₹2000/- AND GET 18,000/-',
    '₹3000/- AND GET 30,000/-',
    '₹5,000/- AND GET 50,000/-',
    '₹10,000/- AND GET 1,20,000/-',
    '₹15,000/- AND GET 1,50,000/-',
    '₹20,000/- AND GET 2,00,000/-',
    '₹30,000/- AND GET 2,50,000/-',
    '₹35,000/- AND GET 3,00,000/-',
])
def test_decorated_and_slot_payouts(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze(text)
    assert result['risk_score'] == 60
    assert result['label'] == 'promotion'
    assert result['flags'][0]['id'] == 'amount_payout'


def test_exact_telegram_message(monkeypatch):
    from pathlib import Path

    from app.services import rules
    text = Path(__file__).with_name('fixtures').joinpath('telegram_payout.txt').read_text()
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze(text)
    assert (result['risk_score'], result['risk_level'], result['label']) == (60, 'high', 'promotion')
    assert len(result['flags']) == 1  # One signal, not nine charges for repeating it.
    claims = list(rules.amount_payout_claims(rules.payout_matching_text(text)))
    assert len(claims) == 9
    assert all(not caution for _, caution in claims)


@pytest.mark.parametrize('text', [
    'Beware of this offer:\n₹1000/- AND GET 9,000/-\n₹2000/- AND GET 18,000/-',
    'Scam awareness example:\n₹1000/- AND GET 9,000/-',
    'Math exercise: Invest\n499 and get 1500',
    'Do not invest\n499 and get 1500',
    '₹1000/- AND GET 900/-',
    '₹1000/- AND GET 1500/-',
    '₹1000/- AND GET 9000 reward points',
    '₹1000/- AND GET 9000 shares',
    'Invest 1000 in an index fund, get 9000 over many years.',
    'My budget: ₹1000 groceries, ₹9000 rent.',
    'Bought for ₹1000 and get ₹9000 as a salary next month.',
    'Invest 1000 and get 9,00/-',  # Malformed grouping must not be read as 9000.
])
def test_slot_and_normalization_false_positives(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    assert analyzer.analyze(text)['risk_score'] == 0


def test_long_warning_applies_to_all_slots(monkeypatch):
    from pathlib import Path

    text = Path(__file__).with_name('fixtures').joinpath('telegram_payout.txt').read_text()
    monkeypatch.setattr(model, '_model', None)
    for prefix in ('Beware of this offer: ', 'Scam awareness example: ', 'Math exercise: '):
        result = analyzer.analyze(prefix + text.lstrip('.'))
        assert result['risk_score'] == 0
        assert result['context_warning'] is True
