const questions = {
  en: {first_payment: 'Is this your first payment to this recipient?', name_match: 'Does the name shown by your UPI app match the intended recipient?', unusual_amount: 'Is the amount unusually large for you?', pressure: 'Are you being pressured to pay now or keep it secret?', pin_to_receive: 'Were you told to enter a UPI PIN to receive money?', remote_access: 'Were you asked to share your screen or allow remote access?'},
  hi: {first_payment: 'क्या इस व्यक्ति को आपका पहला भुगतान है?', name_match: 'क्या UPI ऐप में दिखने वाला नाम सही व्यक्ति से मिलता है?', unusual_amount: 'क्या रकम आपके लिए असामान्य रूप से बड़ी है?', pressure: 'क्या तुरंत या गुप्त भुगतान का दबाव है?', pin_to_receive: 'क्या पैसे पाने के लिए UPI PIN डालने को कहा गया?', remote_access: 'क्या स्क्रीन साझा करने या रिमोट एक्सेस को कहा गया?'}
};
export default function PaymentContext({context, onChange, onSubmit, busy, lang, open = false}) {
  const hi = lang === 'hi';
  return <details className="payment-context" open={open || undefined}><summary>{hi ? 'भुगतान से पहले जांचें' : 'Before you pay'}</summary>
    <p>{hi ? 'वैकल्पिक जांच। कोई पैसा नहीं भेजा जाता और भुगतान रोका नहीं जाता। PIN, OTP, बैंक विवरण या व्यक्ति का नाम न डालें।' : 'Optional check. No money is sent or blocked. Do not enter a PIN, OTP, bank details or recipient name.'}</p>
    <form onSubmit={onSubmit}>
      {Object.entries(questions[lang]).map(([key, question]) => <label className="context-question" key={key} htmlFor={key}><span>{question}</span><select id={key} value={context[key]} onChange={e => onChange(key, e.target.value)}><option value="unknown">{hi ? 'पता नहीं / नहीं बताया' : 'Not sure / not provided'}</option><option value="yes">{hi ? 'हां' : 'Yes'}</option><option value="no">{hi ? 'नहीं' : 'No'}</option></select></label>)}
      <p className="privacy-note">{hi ? 'आपके उत्तर और ऊपर का संदेश जांच के लिए सर्वर पर जाते हैं। इस ऐप में सहेजे नहीं जाते।' : 'Your answers and the message above are sent to the analysis server. This app does not store them.'}</p>
      <button className="check-button" disabled={busy}>{busy ? (hi ? 'जांच जारी है...' : 'Checking...') : (hi ? 'भुगतान की स्थिति जांचें' : 'Check payment context')}</button>
    </form>
  </details>;
}
