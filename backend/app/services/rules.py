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


# Source-backed patterns added after the October 4 advisory review. Weights are
# design choices, not regulator ratings or calibrated fraud probabilities.
RBI_CYBER = "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185"
RBI_IMPERSONATION = "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=58595"
SEBI_FPI = "https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1755862022145.pdf"
FINANCIAL = re.compile(r'\b(?:invest\w*|trading|returns?|profits?|loan|withdraw\w*|bank|kyc|lottery|remittance|upi)\b|निवेश|बैंक', re.I)
NEW_RULES = [
    ('credential_request', r'\b(?:send|share|tell|provide|reply\s+with)\b[^.!?;]{0,65}\b(?:otp|one[ -]time\s+password|upi[ -]?pin|cvv|password)\b|(?:OTP|ओटीपी|पिन|पासवर्ड)\s*(?:हमें\s*)?(?:भेजो|बताओ|बताएं|दो)', 60,
     'A request to share a secret such as an OTP, PIN or password needs scrutiny. Never send these to another person.',
     'OTP, पिन या पासवर्ड किसी व्यक्ति को भेजने का अनुरोध चेतावनी है। ये जानकारी साझा न करें।', RBI_CYBER),
    ('upi_receive', r'\benter\s+(?:your\s+)?upi[ -]?pin\b[^.!?;]{0,60}\b(?:receive|refund|credit)\b', 60,
     'Receiving money does not require entering your UPI PIN. Verify this request independently.',
     'पैसे पाने के लिए UPI पिन डालना जरूरी नहीं है। इस अनुरोध की अलग से जांच करें।', RBI_CYBER),
    ('advance_fee', r'\b(?:pay|send|transfer|deposit)\b[^.!?;]{0,75}\b(?:fee|tax|charges?|deposit)\b[^.!?;]{0,75}\b(?:release|unlock|claim|withdraw|receive)\b[^.!?;]{0,55}\b(?:loan|profit\w*|withdraw\w*|winnings?|lottery|remittance|funds?)\b', 60,
     'An upfront fee or tax demanded to release a loan, winnings or investment withdrawal needs independent checking.',
     'ऋण, इनाम या निवेश के पैसे निकालने से पहले शुल्क या टैक्स मांगना चेतावनी है। अलग से जांच करें।', RBI_IMPERSONATION),
    ('risk_free_return', r'\b(?:risk[ -]?free|zero\s+risk|no\s+risk)\s+(?:market\s+|trading\s+|investment\s+)?(?:profits?|returns?)\b|\b(?:fixed|guaranteed)\s+daily\s+(?:profits?|returns?)\b', 35,
     'A risk-free market profit or fixed daily-return promise needs scrutiny. Check the product and risks independently.',
     'बाजार में जोखिम रहित मुनाफे या तय दैनिक रिटर्न के वादे की जांच करें।', SEBI_SPOT_SCAM),
    ('short_term_return', r'\b(?:earn|get|make)\s+\d+(?:\.\d+)?%\s*(?:profits?|returns?)?\s*(?:in|within|in\s+just)\s+\d+\s*(?:minutes?|hours?|days?)\b', 25,
     'This pitches a percentage return in a short period. The claim is not verified.',
     'कम समय में प्रतिशत मुनाफे का दावा किया गया है। इसकी पुष्टि नहीं हुई है।', SEBI_SPOT_SCAM),
    ('institutional_access', r'\b(?:fpi|fii)\s+(?:institutional\s+)?trading\s+account\b|\bguaranteed\s+(?:ipo\s+allotment|allotment\s+in\s+ipo)\b', 35,
     'Special FPI/FII trading access or guaranteed IPO allotment claims need checking against SEBI guidance.',
     'FPI/FII ट्रेडिंग पहुंच या पक्के IPO आवंटन के दावे को SEBI की जानकारी से जांचें।', SEBI_FPI),
    ('kyc_threat', r'\b(?:bank\s+)?account\b[^.!?;]{0,55}\b(?:blocked|frozen|deactivated|suspended)\b[^;]{0,100}\b(?:click|open)\b[^.!?;]{0,35}\b(?:link|url)\b[^.!?;]{0,35}\bkyc\b', 50,
     'An account-blocking threat paired with a KYC link is a phishing warning. Use your bank branch or official app independently.',
     'खाता बंद करने की धमकी और KYC लिंक फ़िशिंग की चेतावनी है। बैंक की शाखा या आधिकारिक ऐप से जांचें।', RBI_CYBER),
    ('remote_access', r'\b(?:install|download)\s+(?:anydesk|teamviewer|remote\s+access\s+app)\b[^.!?;]{0,100}\b(?:bank|payment|refund|kyc)\b', 50,
     'Remote-access software requested for a banking or payment issue can expose private data. Verify through official support.',
     'बैंक या भुगतान के नाम पर रिमोट एक्सेस ऐप मांगना निजी जानकारी को खतरे में डाल सकता है। आधिकारिक मदद से जांचें।', RBI_CYBER),
]
NEW_URGENCY = re.compile(r'\blimited\s+time(?:\s+offer)?\b|\bonly\s+\d+\s*(?:minutes?|hours?)\s+left\b|\bin\s+just\s+\d+\s*(?:minutes?|hours?)\b', re.I)


def researched_claims(text: str):
    """Yield explainable new patterns with local warning/example suppression.
    Do not infer sender identity, registration or link safety from message text.
    """
    normalized = payout_matching_text(text)
    finance = bool(FINANCIAL.search(normalized))
    for clause, whole in [(c, False) for c in _PAYOUT_SPLIT.split(normalized)] + [(normalized, True)]:
        patterns = [r for r in NEW_RULES if (r[0] == "kyc_threat") == whole]
        if not whole and finance and not re.search(r'\b(?:webinar|class|course|seminar)\b', clause, re.I):
            patterns.append(('urgency', NEW_URGENCY.pattern, 15, RULES[2][3], RULES[2][4], SEBI_SPOT_SCAM))
        for rid, pattern, weight, en, hi, source in patterns:
            for match in re.finditer(pattern, clause, re.I):
                prefix = clause[:match.start()]
                tail = clause[match.end():]
                caution = bool(WARNING.search(prefix) or _PAYOUT_EDUCATION.search(prefix)
                               or re.search(r'\b(?:not|never)\s*$', prefix, re.I)
                               or re.search(r'\bis\s+(?:a\s+)?(?:scam\s+)?(?:example|warning)\b', tail, re.I))
                yield rid, match.group().strip(), weight, en, hi, source, caution
