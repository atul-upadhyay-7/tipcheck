"""Author-written advisory-based scenarios, not independent accuracy evidence."""
import json
from pathlib import Path

import pytest

from app.services import analyzer, model

BATTERY = json.loads(Path(__file__).with_name('fixtures').joinpath('scam_patterns.json').read_text())


@pytest.mark.parametrize('category,text', BATTERY['risks'])
def test_advisory_based_risk_scenarios(monkeypatch, category, text):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze(text)
    assert result['risk_score'] > 0, category
    assert result['verification_status'] == 'not_verified'
    assert all(f['en'] and f['hi'] and f['source'].startswith('https://') for f in result['flags'])
    if category in {'credential', 'credential_hi', 'upi_receive', 'advance_fee', 'withdrawal_fee', 'prize_fee', 'regulator', 'kyc_link', 'remote_access'}:
        assert result['risk_level'] == 'high'


@pytest.mark.parametrize('text', BATTERY['controls'])
def test_advisory_based_genuine_and_protective_controls(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    assert analyzer.analyze(text)['risk_score'] == 0


@pytest.mark.parametrize('text', [
    'Beware: Share your OTP with us.',
    'Training example: Pay a fee to release your loan.',
    'Never enter your UPI PIN to receive money.',
    'Do not download AnyDesk for a bank refund.',
    'Investment scam awareness: Earn 20% in just 2 hours.',
    'Avoid risk-free profits and fixed daily returns.',
    'Beware: Your bank account will be blocked. Click this link to update KYC.',
])
def test_protective_scopes(monkeypatch, text):
    monkeypatch.setattr(model, '_model', None)
    assert analyzer.analyze(text)['risk_score'] == 0


def test_added_signals_are_deduplicated(monkeypatch):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze('Send me your OTP. Share your password. Invest 500 and get 5000 in just 2 hours. Limited time offer.')
    assert result['risk_score'] == 100
    assert len({f['id'] for f in result['flags']}) == len(result['flags'])
