export const EMPTY_CONTEXT = Object.freeze({first_payment: 'unknown', name_match: 'unknown', unusual_amount: 'unknown', pressure: 'unknown', pin_to_receive: 'unknown', remote_access: 'unknown'});
export const PAUSE_SECONDS = 30;
export function remainingSeconds(deadline, now = Date.now()) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
export function contactNote(preflight, lang) {
  // Deliberately omit pasted text, URLs, names, payment amounts and credentials.
  return lang === 'hi'
    ? `मैं भुगतान से पहले रुककर जांच कर रहा/रही हूं। TipCheck ने ${preflight.score}/100 का संकेत स्कोर दिखाया है, यह धोखाधड़ी का प्रमाण नहीं है। क्या आप सही व्यक्ति और दावे की अलग से जांच करने में मेरी मदद करेंगे?`
    : `I'm pausing before a payment. TipCheck showed a ${preflight.score}/100 red-flag score, not proof of fraud. Can you help me independently check the recipient and the claim?`;
}
