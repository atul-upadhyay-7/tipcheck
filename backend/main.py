import re
import unicodedata
from pathlib import Path
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()
SOURCE = 'https://investor.sebi.gov.in/spot-any-scam.html'
# Illustrative rules, not a validated fraud detector.
RULES = [
 ('guarantee', r'guaranteed?\s+(?:returns?|profits?)|assured\s+returns?|100%\s+(?:profit|sure)|pakka\s+(?:profit|return)|पक्का\s+(?:मुनाफा|रिटर्न)|गारंटीड', 35, 'A promise of guaranteed market returns needs scrutiny.', 'बाजार में पक्के मुनाफे का वादा एक चेतावनी है।'),
 ('quick_return', r'(?:double\s+(?:your\s+)?money|daily\s+profit|\d+%\s+(?:in|within)\s+\d+\s+days?|paisa\s+double|पैसा\s+दोगुना)', 25, 'Quick or unusually high returns need independent checking.', 'जल्दी या बहुत ज्यादा मुनाफे के दावे को अलग से जांचें।'),
 ('urgency', r'act\s+now|limited\s+seats|last\s+chance|join\s+today|abhi\s+join|जल्दी\s+करो|आज\s+ही\s+जुड़ें', 15, 'Pressure to act quickly can stop you checking the offer.', 'जल्दी फैसला लेने का दबाव जांच करने से रोक सकता है।'),
 ('payment', r'pay\s+(?:now|first)|send\s+money|transfer\s+to\s+(?:my|personal)|pehle\s+paise|पहले\s+पैसे', 15, 'Check the recipient and offer independently before any payment.', 'पैसे देने से पहले व्यक्ति और प्रस्ताव की अलग से जांच करें।'),
 ('apk', r'install\s+(?:this|our)\s+apk|download\s+apk|\.apk\b', 25, 'An app file or unverified app link needs careful checking.', 'अनजान ऐप फाइल या लिंक की पहले जांच करें।'),
 ('secret', r'secret\s+(?:strategy|formula)|insider\s+(?:tip|information)|sure\s+shot|operator\s+call|अंदर\s+की\s+खबर', 15, 'Claims of secret access or certain tips are not evidence.', 'गुप्त जानकारी या पक्की टिप का दावा सबूत नहीं है।')
]
PROMO = re.compile(r'join|vip|dm\s+me|subscribe|buy\s+now|sell\s+now|target\s*\d|जुड़ें|खरीदो|बेचो|खरीदें', re.I)
WARNING = re.compile(r'\b(beware|avoid|never|do\s+not|not\s+guaranteed|no\s+guaranteed)\b|सावधान|बचें|गारंटी\s+नहीं', re.I)
MODEL_PATH = Path(__file__).with_name('model.joblib')
model = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

class Request(BaseModel):
    text: str = Field(min_length=5, max_length=2000)

@app.get('/health')
def health():
    return {'ok': True, 'mode': 'ml+rules' if model else 'rules-only'}

@app.post('/analyze')
def analyze(req: Request):
    text = unicodedata.normalize('NFKC', req.text).strip()
    if len(text) < 5:
        from fastapi import HTTPException
        raise HTTPException(422, 'Enter a message with at least five characters.')
    flags = []
    suppressed = 0
    for sentence in re.split(r'(?<=[.!?।])\s+|\n+', text):
        caution = bool(WARNING.search(sentence))
        for rid, pattern, weight, en, hi in RULES:
            m = re.search(pattern, sentence, re.I)
            if not m:
                continue
            if caution:
                suppressed += 1
                continue
            if not any(f['id'] == rid for f in flags):
                flags.append({'id': rid, 'phrase': m.group(), 'weight': weight,
                              'en': en, 'hi': hi, 'source': SOURCE if rid not in ('apk', 'payment') else 'https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf'})
    score = min(100, sum(f['weight'] for f in flags))
    level = 'high' if score >= 50 else 'some' if score else 'none_detected'
    probs = None
    if model:
        values = model.predict_proba([text])[0]
        probs = {str(k): round(float(v), 3) for k, v in zip(model.classes_, values)}
        label = str(model.classes_[values.argmax()]) if values.max() >= .65 else 'uncertain'
    else:
        label = 'promotion' if PROMO.search(text) and flags else 'uncertain'
    links = re.findall(r'https?://[^\s<>]+', text)[:5]
    return {'label': label, 'mode': 'ml+rules' if model else 'rules-only',
            'model_scores': probs, 'risk_score': score, 'risk_level': level,
            'flags': flags, 'context_warning': bool(suppressed),
            'links': links, 'verification_status': 'not_verified',
            'note': 'Red-flag score, not scam probability. No flags does not mean safe. Links are not opened or verified.'}
