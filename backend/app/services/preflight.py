"""Voluntary pre-payment check. No network calls, payee databases or money movement."""
import ipaddress
import re
from urllib.parse import urlsplit

from . import analyzer

RBI = 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185'
NPCI = 'https://www.npci.org.in/uploads/UPI_OC_No_101_A_FY_2025_26_Strengthening_beneficiary_name_verification_and_display_during_UPI_transactions_eb7bd7ed72.pdf'
SHORTENERS = {'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'shorturl.at', 'rb.gy'}


def inspect_urls(text):
    """Structural hints only. Never resolve DNS, follow redirects or open a URL."""
    urls = re.findall(r'(?:https?://|www\.)[^\s<>"\']+', text, re.I)[:5]
    checks = []
    for raw in urls:
        raw = raw.rstrip('.,;!?)')
        hints = []
        try:
            parsed = urlsplit(raw if not raw.lower().startswith('www.') else 'https://' + raw)
            host = parsed.hostname or ''
            port = parsed.port  # validate malformed ports without connecting
            del port
            if not host or any(c.isspace() for c in host):
                raise ValueError('invalid host')
            if parsed.username is not None or parsed.password is not None:
                hints.append('embedded_credentials')
            try:
                ipaddress.ip_address(host)
                hints.append('ip_address')
            except ValueError:
                pass
            if host.lower().removeprefix('www.') in SHORTENERS:
                hints.append('shortened_link')
            if any(ord(c) > 127 for c in host) or 'xn--' in host.lower():
                hints.append('internationalized_domain')
            if parsed.scheme.lower() == 'http':
                hints.append('unencrypted_link')
            if re.search(r'\.apk$', parsed.path, re.I):
                hints.append('android_download')
            checks.append({'host': host[:253], 'hints': hints, 'status': 'structure_only'})
        except ValueError:
            checks.append({'host': '', 'hints': ['malformed_link'], 'status': 'structure_only'})
    return checks


def check(req):
    content = analyzer.analyze(req.text)
    signals = []

    def add(id_, weight, en, hi, source):
        signals.append({'id': id_, 'weight': weight, 'en': en, 'hi': hi, 'source': source})

    if req.pin_to_receive == 'yes':
        add('pin_to_receive', 60, 'A UPI PIN authorizes money leaving your account, not receipt. Do not enter it to receive money.', 'पैसे पाने के लिए UPI PIN नहीं लगता। ऐसा करने को कहा जाए तो PIN न डालें।', RBI)
    if req.remote_access == 'yes':
        add('remote_access', 60, 'Someone asked for remote access or screen sharing while you pay. Stop and contact your bank independently.', 'भुगतान करते समय किसी ने स्क्रीन साझा करने या रिमोट एक्सेस को कहा है। रुकें और बैंक से अलग से संपर्क करें।', RBI)
    if req.name_match == 'no':
        add('name_mismatch', 35, 'You said the bank-displayed beneficiary name does not match the intended recipient. Resolve this before paying.', 'आपके अनुसार बैंक में दिखने वाला नाम सही व्यक्ति से नहीं मिलता। भुगतान से पहले जांच करें।', NPCI)
    if req.pressure == 'yes':
        add('pressure', 20, 'You reported pressure to pay immediately or keep the payment secret. Step away and check independently.', 'आपसे तुरंत या गुप्त भुगतान करने को कहा गया है। रुकें और अलग से जांच करें।', RBI)
    if req.first_payment == 'yes' and req.unusual_amount == 'yes':
        add('new_unusual', 15, 'This is a first payment and you said the amount is unusually large for you. That is a reason to double-check, not proof of fraud.', 'यह पहला भुगतान है और रकम आपके लिए असामान्य रूप से बड़ी है। दोबारा जांच करें; यह धोखाधड़ी का प्रमाण नहीं है।', RBI)
    urls = inspect_urls(req.text)
    url_hints = {hint for url in urls for hint in url['hints']}
    # APK already has a content rule. Avoid charging again for the same cue.
    if url_hints - {'android_download'}:
        add('url_structure', 10, 'A link has a structural caution. Review the displayed host; HTTPS and a normal-looking link do not prove safety.', 'लिंक की बनावट में सावधानी का संकेत है। डोमेन जांचें; HTTPS सुरक्षा का प्रमाण नहीं है।', RBI)
    # Correlated evidence must not inflate the score. Preserve each explanation,
    # but context contributes only weight not already counted by message rules.
    equivalents = {'pin_to_receive': {'upi_receive'}, 'remote_access': {'remote_access'}, 'pressure': {'urgency'}}
    matched = {f['id']: f['weight'] for f in content['flags']}
    for signal in signals:
        overlap = max((matched.get(id_, 0) for id_ in equivalents.get(signal['id'], set())), default=0)
        signal['weight'] = max(0, signal['weight'] - overlap)
    context_score = min(60, sum(s['weight'] for s in signals if s['id'] != 'url_structure'))
    url_score = 10 if any(s['id'] == 'url_structure' for s in signals) else 0
    score = min(100, content['risk_score'] + context_score + url_score)
    unknowns = [key for key in ('first_payment', 'name_match', 'unusual_amount', 'pressure', 'pin_to_receive', 'remote_access') if getattr(req, key) == 'unknown']
    content['preflight'] = {
        'score': score, 'level': 'high' if score >= 50 else 'some' if score else 'none_detected',
        'components': {'message': content['risk_score'], 'context': context_score, 'url': url_score},
        'signals': signals, 'url_checks': urls, 'unknown_context': unknowns,
        'message_provided': bool(req.text.strip()), 'reputation_status': 'not_connected',
        'recommendation': 'stop_and_verify' if score >= 50 else 'verify_before_paying',
        'payment_control': 'none', 'score_version': 'preflight-v1',
    }
    return content
