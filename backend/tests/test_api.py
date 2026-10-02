from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json()["ok"] is True


def test_promotional_message_is_high_risk():
    r = client.post("/analyze", json={"text": "Guaranteed returns! Double your money. Join VIP, limited seats, pay first."}).json()
    assert r["risk_level"] == "high"
    assert r["label"] == "promotion"
    assert r["verification_status"] == "not_verified"


def test_warning_language_suppresses_flags():
    r = client.post("/analyze", json={"text": "Beware of guaranteed returns. Never transfer money to an unknown person."}).json()
    assert r["risk_score"] == 0
    assert r["context_warning"] is True


def test_hindi_message_is_flagged():
    r = client.post("/analyze", json={"text": "पैसा दोगुना! पक्का मुनाफा, जल्दी करो, पहले पैसे भेजो।"}).json()
    assert r["risk_level"] == "high"
    assert all(f["hi"] for f in r["flags"])


def test_links_are_listed_not_visited():
    r = client.post("/analyze", json={"text": "Download APK from https://example.test/app.apk now"}).json()
    assert r["links"] == ["https://example.test/app.apk"]
    assert any(f["id"] == "apk" for f in r["flags"])


def test_input_validation():
    assert client.post("/analyze", json={"text": "x"}).status_code == 422
    assert client.post("/analyze", json={"text": " " * 8}).status_code == 422
    assert client.post("/analyze", json={"text": "x" * 2001}).status_code == 422
    assert client.post("/analyze", json={}).status_code == 422


def test_education_message_gets_education_label_in_rules_mode():
    r = client.post("/analyze", json={"text": "Diversification spreads exposure across assets. Investments can lose value."}).json()
    if r["mode"] == "rules-only":
        assert r["label"] == "education"
    assert r["risk_score"] == 0


def test_paid_course_with_disclaimer_is_not_flagged_as_scam():
    r = client.post("/analyze", json={"text": "Join our paid course about diversification. Education only, no guaranteed returns."}).json()
    assert r["risk_score"] == 0
