"""New author-written fictional regressions, not a held-out accuracy benchmark."""
import pytest

from app.services import analyzer, model


@pytest.mark.parametrize('text,label,minimum', [
    ('Join our paid course about diversification. Education only, no guaranteed returns.', 'promotion', 0),
    ('Buy ACME at 100, target 120. Not investment advice.', 'promotion', 0),
    ('Avoid guaranteed returns but join our VIP for assured returns, limited seats.', 'promotion', 50),
    ('Beware of fake tips. Join our group for guaranteed returns.', 'promotion', 35),
    ('Never join groups promising guaranteed returns.', 'education', 0),
    ("Don't buy tips promising assured returns.", 'education', 0),
    ('Never trust scammers, join our VIP for guaranteed returns.', 'promotion', 35),
    ('Not investment advice. Join us for guaranteed profits.', 'promotion', 35),
    ('Aaj hi join karo, pakka munafa, paise double. UPI karo.', 'promotion', 65),
    ('पैसे दोगुने, पक्का मुनाफा। जल्दी करो, पहले पैसे भेजो।', 'promotion', 65),
    ('गारंटी नहीं। बाजार में जोखिम है।', 'education', 0),
    ('Join our course, no guaranteed returns.', 'promotion', 0),
    ('Learn about buy and sell orders and market risk.', 'education', 0),
    ('Avoid guaranteed returns, join us for guaranteed returns.', 'promotion', 35),
    ('Market closed unchanged today.', 'uncertain', 0),
])
def test_fictional_rules_only_regressions(monkeypatch, text, label, minimum):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze(text)
    assert result['label'] == label
    assert result['risk_score'] >= minimum
    if minimum == 0:
        assert result['risk_score'] == 0
    assert result['verification_status'] == 'not_verified'


def test_rule_education_cannot_be_overridden_by_model():
    assert analyzer.decide_label('education', 'promotion') == 'education'


def test_unicode_normalization_and_duplicate_flags(monkeypatch):
    monkeypatch.setattr(model, '_model', None)
    result = analyzer.analyze('Ｇｕａｒａｎｔｅｅｄ returns. Guaranteed returns! Join VIP')
    assert result['label'] == 'promotion'
    assert sum(f['id'] == 'guarantee' for f in result['flags']) == 1
