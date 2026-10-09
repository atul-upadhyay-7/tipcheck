import {ANSWERS} from '../questions.js';
export default function QuestionPage({question, context, onChange, onContinue, lang, index}) {
 const hi=lang==='hi';
 const danger=context[question.key]==='yes' && ['pin_to_receive','remote_access'].includes(question.key);
 return <form onSubmit={e=>{e.preventDefault();onContinue();}}>
  <p className="flow-progress">{hi ? `भुगतान का संदर्भ: प्रश्न ${index+1} / 6` : `Payment context: question ${index+1} of 6`}</p>
  <fieldset className="answer-group"><legend className="sr-only">{question[lang]}</legend>
   {Object.entries(ANSWERS[lang]).map(([value,label])=><label key={value} className="answer-choice"><input type="radio" name={question.key} value={value} checked={context[question.key]===value} onChange={()=>onChange(question.key,value)}/><span>{label}</span></label>)}
  </fieldset>
  <p className="flow-intro">{hi ? 'पता नहीं एक सही उत्तर है। PIN, OTP, बैंक विवरण या व्यक्ति का नाम न डालें।' : 'Not sure is a valid answer. Do not enter a PIN, OTP, bank details or recipient name.'}</p>
  {question.key==='name_match' && <p className="disclaimer-box">{hi ? 'अपने बैंक/UPI ऐप में दिखने वाला नाम देखें। TipCheck बैंक से नाम नहीं लेता या पहचान सत्यापित नहीं करता।' : 'Compare the name displayed in your own bank/UPI app. TipCheck does not retrieve bank names or verify identity.'}</p>}
  {danger && <p className="error-note" role="alert">{question.key==='pin_to_receive' ? (hi ? 'रुकें। पैसे पाने के लिए UPI PIN नहीं चाहिए। अपना PIN न डालें।' : 'Stop. You do not need a UPI PIN to receive money. Do not enter your PIN.') : (hi ? 'रुकें। भुगतान करते समय स्क्रीन साझा या रिमोट एक्सेस न दें। बैंक से पहले से ज्ञात माध्यम से संपर्क करें।' : 'Stop. Do not allow remote access or share your screen while paying. Contact your bank using a channel you already know.')}</p>}
  <button className="check-button" type="submit">{hi ? 'आगे' : 'Continue'}</button>
  <p className="score-note">{hi ? 'इन प्रश्नों का उत्तर अभी सर्वर पर नहीं भेजा जाता। आगे समीक्षा करके जांच शुरू करें।' : 'Answering does not send data to the server. Review your details before starting analysis.'}</p>
 </form>;
}
