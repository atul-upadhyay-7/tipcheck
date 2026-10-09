import {useEffect,useState} from 'react';
import {contactNote,PAUSE_SECONDS,remainingSeconds} from '../preflight.js';
export default function ActionPlan({data,lang,t}) {
 const hi=lang==='hi',p=data.preflight || {score:data.risk_score};
 const [deadline,setDeadline]=useState(null),[seconds,setSeconds]=useState(0),[showNote,setShowNote]=useState(false);
 useEffect(()=>{if(!deadline)return;const tick=()=>setSeconds(remainingSeconds(deadline));tick();const timer=setInterval(tick,250);return()=>clearInterval(timer);},[deadline]);
 return <section className="action-plan">
 <p className="disclaimer-box">{hi?'यहां कोई भुगतान नहीं किया या रोका जाता। परिणाम सुरक्षा का प्रमाण नहीं है।':'No payment is made or blocked here. Your result is not proof of safety.'}</p>
  <div className="pause-actions"><h3>{hi ? 'रुकें। फिर अलग से जांचें।' : 'Pause. Then check independently.'}</h3><p>{hi ? 'अपना बैंक ऐप खुद खोलकर नाम जांचें। संदेश में दिए नंबर के बजाय पहले से ज्ञात नंबर पर संपर्क करें।' : 'Open your bank app yourself and check the beneficiary name. Call a number you already know, not the one in the message.'}</p>
  <button type="button" className="check-button" disabled={Boolean(deadline)} onClick={() => { setSeconds(PAUSE_SECONDS); setDeadline(Date.now()+PAUSE_SECONDS*1000); }}>{deadline ? (seconds > 0 ? (hi ? `रुकने का समय: ${seconds}s` : `Pause: ${seconds}s remaining`) : (hi ? 'समय पूरा हुआ, सुरक्षा जांच नहीं' : 'Pause finished, not a safety check')) : (hi ? '30 सेकंड रुकें' : 'Take a 30-second pause')}</button>
  <p className="score-note">{hi ? 'यह केवल याद दिलाता है। समय पूरा होने से भुगतान सुरक्षित नहीं होता। ऐप भुगतान नहीं रोक सकता।' : 'This is a voluntary reminder. Finishing the timer does not make a payment safe. This app cannot block payments.'}</p>
  <button type="button" className="note-button" onClick={() => setShowNote(v => !v)}>{hi ? 'किसी भरोसेमंद व्यक्ति के लिए नोट बनाएं' : 'Prepare a note for someone you trust'}</button>
  {showNote && <div><p>{hi ? 'कुछ भेजा नहीं गया। शब्द जांचें और खुद भेजें। मूल संदेश और विवरण शामिल नहीं हैं।' : 'Nothing was sent. Review the words and send it yourself. Original message and payment details are excluded.'}</p><textarea aria-label={hi ? 'भरोसेमंद व्यक्ति के लिए नोट' : 'Trusted-contact note'} readOnly value={contactNote(p,lang)} onFocus={e => e.target.select()}/></div>}
  </div>
 <div className="verify-box"><h3>{hi?"निवेश का दावा हो तो":"If this involves an investment claim"}</h3><ol>{t.verify.map((v,i)=><li key={i}>{v}</li>)}</ol><a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noreferrer">{t.sebiResources}</a></div>
 <p className="disclaimer-box">{hi?'पैसे भेज दिए या निजी जानकारी साझा की? सीखने या टाइमर में समय न गंवाएं।':'Already paid or shared private details? Do not wait for a lesson or timer.'} <a href="#/help">{hi?'तुरंत मदद देखें':'Get urgent help'}</a></p>
 </section>;
}
