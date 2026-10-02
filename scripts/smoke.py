"""End-to-end smoke test against a running stack.
Usage: python scripts/smoke.py [base_url]   (default http://127.0.0.1:5173/api, i.e. through the Vite proxy)"""
import json
import sys
import urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5173/api"
CASES = [
    ("Guaranteed returns! Double your money. Join VIP, limited seats, pay first.", "promotion", "high"),
    ("Beware of guaranteed returns. Never transfer money to an unknown person.", None, "none_detected"),
    ("Diversification spreads exposure across assets. Investments can lose value.", "education", "none_detected"),
    ("पैसा दोगुना! पक्का मुनाफा, जल्दी करो, पहले पैसे भेजो।", "promotion", "high"),
]


def post(text):
    req = urllib.request.Request(f"{BASE}/analyze", json.dumps({"text": text}).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


for text, label, level in CASES:
    r = post(text)
    assert r["risk_level"] == level, (text, r["risk_level"])
    if label:
        assert r["label"] == label, (text, r["label"])
    print("ok", r["label"], r["risk_level"], r["risk_score"], text[:40])
print("smoke passed")
