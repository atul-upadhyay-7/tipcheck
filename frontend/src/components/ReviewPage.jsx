import {QUESTIONS,ANSWERS} from '../questions.js';
export default function ReviewPage({text,context,guided,onEdit,onSubmit,busy,warming,error,lang,t}) {
 const hi=lang==='hi';
 return <section>
 <p className="flow-intro">{hi ? 'जांच शुरू करने से पहले शब्द और उत्तर जांचें। बदलने से पुराने परिणाम मिट जाते हैं।' : 'Check the words and answers before analysis. Editing clears old results.'}</p>
 <dl className="review-list"><div><dt>{hi ? 'संदेश' : 'Message'}</dt><dd className="review-message">{text.trim() || (hi ? 'कोई संदेश नहीं दिया' : 'No message provided')}</dd><dd><button className="note-button" type="button" onClick={()=>onEdit('/check/message')}>{hi ? 'संदेश बदलें' : 'Edit message'}</button></dd></div>
 {guided && QUESTIONS.map(q=><div key={q.key}><dt>{q[lang]}</dt><dd>{ANSWERS[lang][context[q.key]]}</dd><dd><button className="note-button" type="button" aria-label={(hi?'बदलें: ':'Change: ')+q[lang]} onClick={()=>onEdit(q.route)}>{hi ? 'बदलें' : 'Change'}</button></dd></div>)}</dl>
 <p className="disclaimer-box">{hi ? 'नीचे जांच बटन दबाने पर यह संदेश और दिखाए गए उत्तर विश्लेषण सर्वर पर भेजे जाते हैं। इस ऐप में सहेजे नहीं जाते। कोई पैसा या संपर्क संदेश नहीं भेजा जाता। पहचान और प्रतिष्ठा सत्यापित नहीं होती। रीफ्रेश करने से निजी जानकारी मिट जाती है।' : 'Pressing the analysis button below sends this message and the displayed answers to the analysis server. This app does not save them. No money or contact message is sent. Identity and reputation are not verified. Refresh clears private details.'}</p>
 {error && <p className="error-note" role="alert">{t.error}</p>}
 {busy && <p role="status">{warming?t.warming:t.checking}</p>}
 <form onSubmit={onSubmit}><button className="check-button" disabled={busy || (!guided && text.trim().length<5)}>{busy ? t.checking : (hi ? 'विवरण भेजें और जांचें' : 'Send details and analyse')}</button></form>
 </section>;
}
