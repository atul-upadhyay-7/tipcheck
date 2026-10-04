"""Illustrative red-flag rules. Not a validated fraud detector."""
import re
import unicodedata
from decimal import Decimal

SEBI_SPOT_SCAM = "https://investor.sebi.gov.in/spot-any-scam.html"
SEBI_FAKE_APP = "https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf"

# (id, regex, weight, English explanation, Hindi explanation)
RULES = [
    ('guarantee', r'guaranteed?\s+(?:returns?|profits?)|assured\s+returns?|100%\s+(?:profit|sure)|pakka\s+(?:profit|return|munafa)|guarantee[d]?\s+(?:munafa|return)|पक्के?\s+(?:मुनाफे?|रिटर्न)|पक्का\s+(?:मुनाफा|रिटर्न)|गारंटीड', 35, 'A promise of guaranteed market returns needs scrutiny.', 'बाजार में पक्के मुनाफे का वादा एक चेतावनी है।'),
    ('quick_return', r'(?:double\s+(?:your\s+)?money|daily\s+profit|\d+%\s+(?:in|within)\s+\d+\s+days?|paisa\s+double|paise\s+double|पैसे\s+दोगुने|पैसा\s+दोगुना)', 25, 'Quick or unusually high returns need independent checking.', 'जल्दी या बहुत ज्यादा मुनाफे के दावे को अलग से जांचें।'),
    ('urgency', r'act\s+now|limited\s+seats|last\s+chance|join\s+today|abhi\s+join|aaj\s+hi|jaldi\s+karo|जल्दी\s+करो|आज\s+ही\s+जुड़ें', 15, 'Pressure to act quickly can stop you checking the offer.', 'जल्दी फैसला लेने का दबाव जांच करने से रोक सकता है।'),
    ('payment', r'pay\s+(?:now|first)|send\s+money|transfer\s+to\s+(?:my|personal)|pehle\s+paise|payment\s+first|send\s+(?:the\s+)?(?:fee|payment)|upi\s+(?:karo|bhejo)|पहले\s+पैसे', 15, 'Check the recipient and offer independently before any payment.', 'पैसे देने से पहले व्यक्ति और प्रस्ताव की अलग से जांच करें।'),
    ('apk', r'install\s+(?:this|our)\s+apk|download\s+apk|\.apk\b', 25, 'An app file or unverified app link needs careful checking.', 'अनजान ऐप फाइल या लिंक की पहले जांच करें।'),
    ('secret', r'secret\s+(?:strategy|formula)|insider\s+(?:tip|information)|sure[ -]shot|operator\s+call|अंदर\s+की\s+खबर', 15, 'Claims of secret access or certain tips are not evidence.', 'गुप्त जानकारी या पक्की टिप का दावा सबूत नहीं है।'),
]

# Rules whose SEBI reference is the fake-trading-app paper rather than the general scam page.
APP_SOURCE_RULES = {'apk', 'payment'}

# Explicit calls to participate. A paid course can be promotion without fraud flags.
PROMO = re.compile(r"\b(?:join|subscribe|buy\s+(?:now|[A-Z]{2,}\s+(?:at|@|above|below)|at|above|below)|sell\s+(?:now|[A-Z]{2,}\s+(?:at|@|above|below)|at|above|below)|dm\s+(?:me|us)|enroll|register|book\s+(?:your\s+)?seat)\b|जुड़ें|खरीदो|बेचो|खरीदें|जुड़ो", re.I)
WARNING = re.compile(r"\b(?:beware|avoid|never|do\s+not|don't|not\s+guaranteed|no\s+guaranteed|mat\s+karo|mat\s+karna)\b|सावधान|बचें|गारंटी\s+नहीं|मत\s+(?:करो|करें|भेजो|जुड़ो)", re.I)
EDU = re.compile(r'diversif|education(?:al)?\s+only|not\s+(?:an?\s+)?investment\s+(?:advice|recommendation)|can\s+lose\s+value|market\s+risk|learn\s+about|शिक्षा|जोखिम|निवेश\s+सलाह\s+नहीं', re.I)
URL = re.compile(r'https?://[^\s<>]+')
SENTENCE_SPLIT = re.compile(r'(?<=[.!?।;])\s+|\n+|\s+(?:but|however|lekin|लेकिन|परन्तु)\s+', re.I)


def source_for(rule_id: str) -> str:
    return SEBI_FAKE_APP if rule_id in APP_SOURCE_RULES else SEBI_SPOT_SCAM


def active_promotion(clause: str) -> bool:
    """Do not treat a warning against joining/buying as a call to do it."""
    for match in PROMO.finditer(clause):
        prefix = clause[max(0, match.start() - 50):match.start()]
        # Warning scope extends over a short prefix, not the whole message.
        if re.search(r"(?:never|avoid|do not|don't|mat|मत|बचें)\s+(?:\w+\s+){0,2}$|beware\s+of\s+$", prefix, re.I):
            continue
        return True
    return False


def fallback_label(text: str, flags: list) -> str:
    """Content type is separate from the red-flag score, never a fraud verdict."""
    if any(active_promotion(clause) for clause in SENTENCE_SPLIT.split(text)):
        return "promotion"
    if sum(f["weight"] for f in flags) >= 50:
        return "promotion"
    if not flags and (EDU.search(text) or WARNING.search(text)):
        return "education"
    return "uncertain"


def rules_promo(text: str) -> bool:
    return any(active_promotion(clause) for clause in SENTENCE_SPLIT.split(text))


# Explicit payment-to-payout claims, not arbitrary pairs of numbers or price targets.
_NUMBER = r"(?:\d{1,3}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{1,9})(?:\.\d{1,2})?"
_CURRENCY = r"(?:₹|rs\.?|inr|rupees?|rupaye|रुपये)"
_AMOUNT = _CURRENCY + r"?\s*(?P<{name}>" + _NUMBER + r")(?!\d|,\d)(?:\s*(?:" + _CURRENCY + r"))?(?:\s*/-)?"
# Both a personal payout promise and a monetary payment/return tier.
_PAYOUT_PATTERN = re.compile(
    r"\b(?:invest|pay|send|deposit)\s+" + _AMOUNT.replace("{name}", "stake")
    + r"\s*[,=:>-]?\s*(?:and\s+)?(?:i|we)\s+(?:(?:will|can)\s+)?(?:give|pay|return)\s+you\s+"
    + _AMOUNT.replace("{name}", "payout"), re.I)
_SLOT_PATTERN = re.compile(
    r"(?:\b(?:invest|pay|send|deposit)\s+|(?=" + _CURRENCY + r"\s*" + _NUMBER + r"\s*/-)|^(?=" + _CURRENCY + r"\s*\d))"
    + _AMOUNT.replace("{name}", "stake")
    + r"\s*[,=:>-]?\s*(?:and\s+)?(?:get|receive)\s+"
    + _AMOUNT.replace("{name}", "payout"), re.I)
# Keep sentence boundaries for local warnings, but line wraps are not sentences.
_PAYOUT_SPLIT = re.compile(r'(?<=[.!?।;])\s+|\s+(?:but|however|lekin|लेकिन|परन्तु)\s+', re.I)


def payout_matching_text(text: str) -> str:
    """Normalize presentation noise only for rules, not model training features.
    Currency and amount punctuation are preserved. Format controls inside words
    are removed; decorative symbols become spaces, not glued-together words.
    """
    text = unicodedata.normalize("NFKC", text)
    chars = []
    for char in text:
        category = unicodedata.category(char)
        if category == "Cf" or 0xFE00 <= ord(char) <= 0xFE0F:
            continue
        chars.append(" " if category in {"So", "Sk"} else char)
    return re.sub(r"\s+", " ", "".join(chars)).strip()

_PAYOUT_EDUCATION = re.compile(
    r"\b(?:example|exercise|hypothetical|suppose|quoted?|classroom|math|warns?|warning|scam\s+awareness)\b"
    r"|उदाहरण|अभ्यास|सावधान", re.I)


def amount_payout_claims(clause: str):
    """Yield literal amount promises at least 2x a positive payment.
    A narrow heuristic, not financial verification or a model probability.
    """
    for match in sorted([m for pattern in (_PAYOUT_PATTERN, _SLOT_PATTERN)
                         for m in pattern.finditer(clause)], key=lambda m: m.start()):
        stake = Decimal(match['stake'].replace(',', ''))
        payout = Decimal(match['payout'].replace(',', ''))
        if stake <= 0 or payout < stake * 2:
            continue
        if re.match(r"\s*(?:reward\s+points?|shares?|units?|points?|tokens?)\b", clause[match.end():], re.I):
            continue
        prefix = clause[:match.start()]
        tail = clause[match.end():match.end() + 100]
        educational = bool(_PAYOUT_EDUCATION.search(prefix) or re.search(
            r"\b(?:is|was)\s+(?:an?\s+)?(?:example|quote|scam|warning)|not\s+(?:a\s+)?(?:real\s+)?offer", tail, re.I))
        caution = bool(WARNING.search(prefix) or re.search(r"\b(?:not|never)\s*$", prefix, re.I))
        yield match.group().strip(), educational or caution
