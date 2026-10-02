from app.services.analyzer import find_flags
from app.services.rules import RULES, source_for


def test_each_rule_has_bilingual_text_and_positive_weight():
    for rid, _pattern, weight, en, hi in RULES:
        assert weight > 0 and en and hi, rid


def test_flags_are_deduplicated():
    flags, _ = find_flags("Guaranteed returns today. Assured returns tomorrow.")
    assert [f["id"] for f in flags].count("guarantee") == 1


def test_neutral_education_has_no_flags():
    flags, suppressed = find_flags("Diversification spreads exposure across assets. Investments can lose value.")
    assert flags == [] and suppressed == 0


def test_sources_are_sebi():
    assert source_for("apk").startswith("https://investor.sebi.gov.in/")
    assert source_for("guarantee").startswith("https://investor.sebi.gov.in/")
