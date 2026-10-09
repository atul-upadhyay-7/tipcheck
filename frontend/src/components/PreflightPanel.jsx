const hints = {
 en: {embedded_credentials: 'Embedded user information can disguise the destination', ip_address: 'Numeric IP instead of a domain', shortened_link: 'Short link hides the destination', internationalized_domain: 'Internationalized domain: compare spelling carefully; not inherently malicious', unencrypted_link: 'Unencrypted HTTP link', android_download: 'Android installation file', malformed_link: 'Link could not be parsed'},
 hi: {embedded_credentials: 'लिंक में उपयोगकर्ता जानकारी असली पता छिपा सकती है', ip_address: 'डोमेन की जगह IP पता', shortened_link: 'छोटा लिंक असली पता छिपाता है', internationalized_domain: 'अंतरराष्ट्रीय डोमेन: वर्तनी जांचें; अपने आप में गलत नहीं', unencrypted_link: 'HTTP लिंक एन्क्रिप्टेड नहीं है', android_download: 'Android इंस्टॉलेशन फ़ाइल', malformed_link: 'लिंक समझा नहीं जा सका'}
};
export default function PreflightPanel({data, lang}) {
 const p = data.preflight, hi = lang === 'hi';
 return <section className="preflight-panel" aria-labelledby="preflight-title">
  <span className="eyebrow">{hi ? 'भुगतान से पहले' : 'Before payment'}</span>
  <h2 id="preflight-title">{p.score >= 50 ? (hi ? 'रुकें और अलग से जांच करें' : 'Stop and verify independently') : (hi ? 'भुगतान से पहले जांच करें' : 'Verify before paying')}</h2>
  <p className="preflight-score">{p.score}<span> / 100</span></p>
  <p>{hi ? 'संकेत स्कोर, धोखाधड़ी की संभावना नहीं। शून्य का मतलब सुरक्षित नहीं।' : 'Red-flag score, not scam probability. Zero does not mean safe.'}</p>
  <p className="score-note">{hi ? 'संदेश' : 'Message'} {p.components.message} + {hi ? 'आपके उत्तर' : 'Your answers'} {p.components.context} + URL {p.components.url}. {hi ? 'कुल अधिकतम 100। वजन अनुमानित हैं, मापी हुई सटीकता नहीं।' : 'Capped at 100. Weights are heuristics, not measured accuracy.'}</p>
  {p.signals.map(s => <p className="context-note" key={s.id}>{s[lang]} <a href={s.source} target="_blank" rel="noreferrer">{hi ? 'स्रोत' : 'Source'}</a></p>)}
  <p className="disclaimer-box">{hi ? 'व्यक्ति की प्रतिष्ठा और बैंक डेटा जुड़े नहीं हैं। पहचान सत्यापित नहीं है।' : 'Payee reputation and bank data are not connected. Identity is not verified.'} {p.unknown_context.length > 0 && (hi ? `${p.unknown_context.length} उत्तर अज्ञात हैं।` : `${p.unknown_context.length} context answers are unknown.`)} {!p.message_provided && (hi ? 'कोई संदेश नहीं दिया गया।' : 'No message was provided.')}</p>
  {p.url_checks.length > 0 && <div className="verify-box"><h3>{hi ? 'लिंक की बनावट' : 'Link structure'}</h3><p>{hi ? 'लिंक खोले नहीं गए। सामग्री, रीडायरेक्ट और प्रतिष्ठा की जांच नहीं हुई।' : 'Links were not opened. Content, redirects and reputation were not checked.'}</p><ul>{p.url_checks.map((u,i) => <li key={i}><strong className="url-host">{u.host || (hi ? 'अज्ञात पता' : 'Unparsed host')}</strong><p>{u.hints.length ? u.hints.map(h => hints[lang][h]).join('; ') : (hi ? 'बनावट में संकेत नहीं मिले। यह सुरक्षित होने का प्रमाण नहीं।' : 'No structural cues found. This is not a safety certificate.')}</p></li>)}</ul></div>}

 </section>;
}
