"""Illustrative red-flag rules. Not a validated fraud detector."""
import re

SEBI_SPOT_SCAM = "https://investor.sebi.gov.in/spot-any-scam.html"
SEBI_FAKE_APP = "https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf"

# (id, regex, weight, English explanation, Hindi explanation)
RULES = [
    ('guarantee', r'guaranteed?\s+(?:returns?|profits?)|assured\s+returns?|100%\s+(?:profit|sure)|pakka\s+(?:profit|return)|पक्का\s+(?:मुनाफा|रिटर्न)|गारंटीड', 35, 'A promise of guaranteed market returns needs scrutiny.', 'बाजार में पक्के मुनाफे का वादा एक चेतावनी है।'),
    ('quick_return', r'(?:double\s+(?:your\s+)?money|daily\s+profit|\d+%\s+(?:in|within)\s+\d+\s+days?|paisa\s+double|पैसा\s+दोगुना)', 25, 'Quick or unusually high returns need independent checking.', 'जल्दी या बहुत ज्यादा मुनाफे के दावे को अलग से जांचें।'),
    ('urgency', r'act\s+now|limited\s+seats|last\s+chance|join\s+today|abhi\s+join|जल्दी\s+करो|आज\s+ही\s+जुड़ें', 15, 'Pressure to act quickly can stop you checking the offer.', 'जल्दी फैसला लेने का दबाव जांच करने से रोक सकता है।'),
    ('payment', r'pay\s+(?:now|first)|send\s+money|transfer\s+to\s+(?:my|personal)|pehle\s+paise|पहले\s+पैसे', 15, 'Check the recipient and offer independently before any payment.', 'पैसे देने से पहले व्यक्ति और प्रस्ताव की अलग से जांच करें।'),
    ('apk', r'install\s+(?:this|our)\s+apk|download\s+apk|\.apk\b', 25, 'An app file or unverified app link needs careful checking.', 'अनजान ऐप फाइल या लिंक की पहले जांच करें।'),
    ('secret', r'secret\s+(?:strategy|formula)|insider\s+(?:tip|information)|sure\s+shot|operator\s+call|अंदर\s+की\s+खबर', 15, 'Claims of secret access or certain tips are not evidence.', 'गुप्त जानकारी या पक्की टिप का दावा सबूत नहीं है।'),
]

# Rules whose SEBI reference is the fake-trading-app paper rather than the general scam page.
APP_SOURCE_RULES = {'apk', 'payment'}

PROMO = re.compile(r'join|vip|dm\s+me|subscribe|buy\s+now|sell\s+now|target\s*\d|जुड़ें|खरीदो|बेचो|खरीदें', re.I)
WARNING = re.compile(r'\b(beware|avoid|never|do\s+not|not\s+guaranteed|no\s+guaranteed)\b|सावधान|बचें|गारंटी\s+नहीं', re.I)
EDU = re.compile(r'diversif|education(?:al)?\s+only|not\s+(?:an?\s+)?investment\s+(?:advice|recommendation)|can\s+lose\s+value|market\s+risk|learn\s+about|शिक्षा|जोखिम|निवेश\s+सलाह\s+नहीं', re.I)
URL = re.compile(r'https?://[^\s<>]+')
SENTENCE_SPLIT = re.compile(r'(?<=[.!?।])\s+|\n+')


def source_for(rule_id: str) -> str:
    return SEBI_FAKE_APP if rule_id in APP_SOURCE_RULES else SEBI_SPOT_SCAM


def fallback_label(text: str, flags: list) -> str:
    """Rules-only verdict: promotion, education or uncertain."""
    if flags and (rules_promo(text) or sum(f["weight"] for f in flags) >= 50):
        return "promotion"
    if not flags and EDU.search(text):
        return "education"
    return "uncertain"


def rules_promo(text: str) -> bool:
    return bool(PROMO.search(text))
