"""End-to-end smoke test against a running stack.
Usage: python scripts/smoke.py [base_url]   (default http://127.0.0.1:5173/api, i.e. through the Vite proxy)"""
import argparse
import json
import time
import urllib.error
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("base_url", nargs="?", default="http://127.0.0.1:5173/api")
parser.add_argument("--wait", action="store_true", help="Wait up to 20s for local API startup")
parser.add_argument("--expect-mode", choices=["rules-only", "ml+rules"])
args = parser.parse_args()
BASE = args.base_url.rstrip("/")

CASES = [
    ("Guaranteed returns! Double your money. Join VIP, limited seats, pay first.", "promotion", "high"),
    ("Beware of guaranteed returns. Never transfer money to an unknown person.", "education", "none_detected"),
    ("Diversification spreads exposure across assets. Investments can lose value.", "education", "none_detected"),
    ("पैसा दोगुना! पक्का मुनाफा, जल्दी करो, पहले पैसे भेजो।", "promotion", "high"),
]


def post(text):
    req = urllib.request.Request(f"{BASE}/analyze", json.dumps({"text": text}).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=10))


deadline = time.monotonic() + (20 if args.wait else 0)
while True:
    try:
        health = json.load(urllib.request.urlopen(f"{BASE}/health", timeout=3))
        break
    except (urllib.error.URLError, TimeoutError):
        if time.monotonic() >= deadline:
            raise
        time.sleep(.25)
assert health["ok"] is True
if args.expect_mode:
    assert health["mode"] == args.expect_mode, health

for text, label, level in CASES:
    r = post(text)
    assert r["risk_level"] == level, (text, r["risk_level"])
    if label:
        assert r["label"] == label, (text, r["label"])
    print("ok", r["label"], r["risk_level"], r["risk_score"], text[:40])
print("smoke passed")
