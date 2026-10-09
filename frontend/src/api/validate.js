// A successful HTTP status is not evidence of a usable analysis.
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const strings = v => Array.isArray(v) && v.length <= 100 && v.every(s => typeof s === 'string' && s.length <= 4000);
const score = v => Number.isInteger(v) && v >= 0 && v <= 100;
const boundedText = v => typeof v === 'string' && v.length <= 4000;
const level = v => ['none_detected','some','high'].includes(v);
const sourceHosts = new Set(['www.rbi.org.in','www.sebi.gov.in','investor.sebi.gov.in','www.npci.org.in']);
const source = v => {try {const u = new URL(v);return u.protocol === 'https:' && sourceHosts.has(u.hostname) && !u.username && !u.password;} catch {return false;}};
const signal = v => object(v) && ['id','en','hi'].every(k => boundedText(v[k])) && source(v.source);
export function validateAnalysis(v, payment = false) {
 const valid = object(v) && ['promotion','education','uncertain'].includes(v.label) && ['rules-only','ml+rules'].includes(v.mode) && score(v.risk_score) && level(v.risk_level) && typeof v.context_warning === 'boolean' && strings(v.links) && Array.isArray(v.flags) && v.flags.length <= 100 && v.flags.every(f => signal(f) && boundedText(f.phrase) && score(f.weight)) && v.verification_status === 'not_verified';
 const p = v?.preflight;
 const validPayment = (!payment && p === undefined) || (object(p) && score(p.score) && level(p.level) && object(p.components) && ['message','context','url'].every(k => score(p.components[k])) && Array.isArray(p.signals) && p.signals.length <= 100 && p.signals.every(signal) && strings(p.unknown_context) && typeof p.message_provided === 'boolean' && p.reputation_status === 'not_connected' && p.payment_control === 'none' && Array.isArray(p.url_checks) && p.url_checks.length <= 100 && p.url_checks.every(u => object(u) && boundedText(u.host) && strings(u.hints) && u.status === 'structure_only'));
 if (!valid || !validPayment) throw new Error('Invalid analysis response.');
 return v;
}
