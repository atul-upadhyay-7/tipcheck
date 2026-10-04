"""Core analysis: rules + optional model -> verdict. Pure functions, no web code."""
import re
import unicodedata

from . import model, rules

NOTE = ("Red-flag score, not scam probability. No flags does not mean safe. "
        "Links are not opened or verified.")


def find_flags(text: str) -> tuple[list[dict], int]:
    """Suppress local protective warnings, not later sales claims in mixed text."""
    flags: list[dict] = []
    suppressed = 0
    for sentence in rules.SENTENCE_SPLIT.split(text):
        for rid, pattern, weight, en, hi in rules.RULES:
            for m in re.finditer(pattern, sentence, re.I):
                prefix = sentence[max(0, m.start() - 70):m.start()]
                local_context = prefix + m.group()
                negated = re.search(r"(?:no|not|never)\s+$", prefix, re.I)
                caution = bool(rules.WARNING.search(local_context))
                if negated or (caution and not rules.active_promotion(prefix)):
                    suppressed += 1
                    continue
                if not any(f["id"] == rid for f in flags):
                    flags.append({"id": rid, "phrase": m.group(), "weight": weight,
                                  "en": en, "hi": hi, "source": rules.source_for(rid)})
    # Payouts can be wrapped across lines or rendered as decorated currency tiers.
    for clause in rules._PAYOUT_SPLIT.split(rules.payout_matching_text(text)):
        for phrase, caution in rules.amount_payout_claims(clause):
            if caution:
                suppressed += 1
                continue
            if not any(f["id"] == "amount_payout" for f in flags):
                flags.append({"id": "amount_payout", "phrase": phrase, "weight": 60,
                              "en": "This message asks for money and promises to pay back at least twice that amount. Check the claim and recipient independently; this is not proof of fraud.",
                              "hi": "यह संदेश पैसे मांगकर कम से कम दोगुनी रकम लौटाने का वादा करता है। दावे और व्यक्ति की अलग से जांच करें; यह धोखाधड़ी का प्रमाण नहीं है।",
                              "source": rules.SEBI_SPOT_SCAM})
    for rid, phrase, weight, en, hi, source, caution in rules.researched_claims(text):
        if caution:
            suppressed += 1
            continue
        if not any(f["id"] == rid for f in flags):
            flags.append({"id": rid, "phrase": phrase, "weight": weight,
                          "en": en, "hi": hi, "source": source})
    return flags, suppressed


def decide_label(rule_label: str, model_label):
    """Rules lead for both explicit pitches and protective education.
    The model fills only uncertain cases; an unsure model preserves abstention."""
    if rule_label in ("promotion", "education") or model_label in (None, "uncertain"):
        return rule_label
    return model_label


def analyze(raw_text: str) -> dict:
    text = unicodedata.normalize("NFKC", raw_text).strip()
    flags, suppressed = find_flags(text)
    score = min(100, sum(f["weight"] for f in flags))
    level = "high" if score >= 50 else "some" if score else "none_detected"
    model_label, scores = model.predict(text)
    label = decide_label(rules.fallback_label(text, flags), model_label)
    return {
        "label": label, "mode": model.mode(), "model_scores": scores,
        "risk_score": score, "risk_level": level, "flags": flags,
        "context_warning": bool(suppressed),
        "links": rules.URL.findall(text)[:5],
        "verification_status": "not_verified", "note": NOTE,
    }
