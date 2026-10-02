import {useState} from 'react';
import './style.css';
const examples = [
 'Guaranteed returns! Double your money. Join VIP, limited seats, pay first.',
 'Beware of guaranteed returns. Never transfer money to an unknown person.',
 'Diversification spreads exposure across assets. Investments can lose value.',
 'Join our paid course about diversification. Education only, no guaranteed returns.',
 'पैसा दोगुना! पक्का मुनाफा, जल्दी करो, पहले पैसे भेजो।',
 'Today the market closed higher. This report is not an investment recommendation.'
];
export default function App(){
 const [text,setText]=useState(''); const [data,setData]=useState(null);
 const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [lang,setLang]=useState('en');
 async function submit(e){e.preventDefault();setBusy(true);setError('');setData(null);
 try{const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
 if(!r.ok)throw new Error('Check message length and backend connection.');setData(await r.json());}
 catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main><h1>TipCheck</h1><p>Pause before trusting a financial message.</p>
 <p>Education only. Not investment advice. Remove names, phone numbers and account details before pasting.</p>
 <label>Language <select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option></select></label>
 <section><h2>Try a fictional example</h2>{examples.map((s,i)=><button key={i} onClick={()=>{setText(s);setData(null)}}>Example {i+1}</button>)}</section>
 <form onSubmit={submit}><label htmlFor="msg">Paste message</label><textarea id="msg" value={text} maxLength={2000} onChange={e=>setText(e.target.value)}/>
 <button disabled={busy||text.trim().length<5}>{busy?'Checking...':'Check message'}</button></form>
 {error&&<p role="alert">{error}</p>}
 {data&&<section aria-live="polite"><h2>Content: {data.label}</h2><p>Engine: {data.mode}. Source: not verified.</p>
 <h3>Red flags: {data.risk_level.replaceAll('_',' ')} ({data.risk_score}/100)</h3><p>{data.note}</p>
 {data.context_warning&&<p>Warning language detected. Some keyword matches were suppressed; quotation and mixed context may need manual review.</p>}
 <ul>{data.flags.map(f=><li key={f.id}><strong>"{f.phrase}"</strong><p>{f[lang]}</p><a href={f.source} target="_blank" rel="noreferrer">Read SEBI reference</a></li>)}</ul>
 <h3>Verify independently</h3><ol><li>Check the claimed entity on the official SEBI site, including registration status and contact details.</li><li>A registration number in a message can be copied. It is not proof of identity.</li><li>Do not open unknown links or share OTPs or financial details.</li></ol>
 <a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noreferrer">Official SEBI intermediary resources</a>
 <p>Detected URLs are shown as text only, not visited:</p><ul>{data.links.map((u,i)=><li key={i}>{u}</li>)}</ul>
 </section>}</main>
}
