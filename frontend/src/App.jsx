import { useEffect, useRef, useState } from "react";
import { analyzeMessage } from "./api/client.js";
import ExampleList from "./components/ExampleList.jsx";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import ActionPlan from "./components/ActionPlan.jsx";
import { LearnPage, HelpPage, AboutPage } from "./components/InfoPages.jsx";
import QuestionPage from "./components/QuestionPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import { QUESTIONS, nextQuestion } from "./questions.js";
import { routeFromHash, routeNeedsResult } from "./router.js";
import { EMPTY_CONTEXT } from "./preflight.js";
import { STRINGS } from "./i18n.js";
import SpotlightCard from "./components/SpotlightCard.jsx";
import EmptyResult from "./components/EmptyResult.jsx";
import { MotionConfig } from "motion/react";
import "./style.css";

export default function App() {
  const [route, setRoute] = useState(() => routeFromHash(window.location.hash));
  const [guided, setGuided] = useState(false);
  const [editing, setEditing] = useState(false);
  const question = QUESTIONS.find(q => q.route === route);
  const [notice, setNotice] = useState(false);
  const heading = useRef(null);
  const [context, setContext] = useState({ ...EMPTY_CONTEXT });
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [warming, setWarming] = useState(false);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];
  const requestId = useRef(0);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    const onRoute = () => {
      requestId.current += 1;
      setBusy(false); setWarming(false); setError(false);
      setRoute(routeFromHash(window.location.hash));
    };
    window.addEventListener("hashchange", onRoute);
    return () => window.removeEventListener("hashchange", onRoute);
  }, []);
  useEffect(() => {
    if (routeNeedsResult(route) && !data) {
      setNotice(true); window.location.hash = "/check/message";
    }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    document.title = `${question ? question[lang] : route === "/check/review" ? (lang === "hi" ? "विवरण की समीक्षा" : "Review details") : route === "/" ? (lang === "hi" ? "शुरू" : "Start") : route.split("/").pop()} | TipCheck`;
  }, [route, data, lang, question]);

  function navigate(path) { window.location.hash = path; }
  function start(payment) {
    changeText(""); setContext({ ...EMPTY_CONTEXT }); setGuided(payment);
    setNotice(false); setEditing(false); navigate("/check/message");
  }

  function changeText(value) {
    requestId.current += 1;
    setText(value);
    setData(null);
    setError(false);
    setBusy(false);
    setWarming(false);
  }

  function changeContext(key, value) {
    changeText(text);
    setContext(old => ({ ...old, [key]: value }));
  }

  function edit(path) { setEditing(true); navigate(path); }
  function advance() {
    if (editing) {setEditing(false); navigate("/check/review");}
    else {setGuided(true); navigate(nextQuestion(route));}
  }
  function reviewMessage(e) {
    e.preventDefault();
    if (editing || !guided) {setEditing(false); navigate("/check/review");}
    else navigate("/check/recipient");
  }

  async function submit(e, payment = false) {
    e.preventDefault();
    const id = ++requestId.current;
    setBusy(true);
    setWarming(false);
    setError(false);
    setData(null);
    try {
      const result = await analyzeMessage(text, { context: payment ? context : null, onWarming: () => {
        if (id === requestId.current) setWarming(true);
      } });
      if (id === requestId.current) { setData(result); navigate("/check/result"); }
    } catch {
      if (id === requestId.current) setError(true);
    } finally {
      if (id === requestId.current) { setBusy(false); setWarming(false); }
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <div className="ambient" aria-hidden="true" />
        <main className="mx-auto max-w-7xl px-5 sm:px-8">
          <Header lang={lang} onLangChange={setLang} t={t} compact={route !== "/"} />
          {route !== "/" && <nav className="flow-nav" aria-label={lang === "hi" ? "नेविगेशन" : "Check navigation"}><a href="#/">{lang === "hi" ? "शुरू" : "Start"}</a><button type="button" onClick={() => window.history.back()}>{lang === "hi" ? "वापस" : "Back"}</button><span>{lang === "hi" ? "रीफ्रेश करने पर निजी जानकारी मिट जाती है" : "Refresh clears private draft details"}</span></nav>}
          {route === "/" && <section className="start-choices" aria-labelledby="start-heading"><h2 ref={heading} tabIndex={-1} id="start-heading">{lang === "hi" ? "आप क्या जांचना चाहते हैं?" : "What would you like to check?"}</h2><div className="choice-grid">
            <button className="route-choice" type="button" onClick={() => start(false)}><strong>{lang === "hi" ? "एक संदेश" : "A message"}</strong><span>{lang === "hi" ? "जल्दी जांचें: संदेश के संकेत और अलग से जांच करने के तरीके।" : "A quick check of message signals and independent verification steps."}</span></button>
            <button className="route-choice" type="button" onClick={() => start(true)}><strong>{lang === "hi" ? "भुगतान से पहले" : "Before I pay"}</strong><span>{lang === "hi" ? "संदेश और आपके बताए भुगतान के संदर्भ की जांच करें।" : "Check a message alongside your own payment context."}</span></button>
          </div><a className="urgent-entry note-button" href="#/help">{lang === "hi" ? "पैसे भेज दिए या निजी जानकारी साझा की? तुरंत मदद" : "Already paid or shared details? Get urgent help"}</a><p className="disclaimer-box">{lang === "hi" ? "कोई खाता जरूरी नहीं। पहचान सत्यापित नहीं होती, कोई भुगतान नहीं भेजा या रोका जाता।" : "No account needed. Identities are not verified and no payment is sent or blocked."}</p></section>}
          {route === "/check/message" && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "संदेश देखें" : "Look at the message"}</h1><p className="flow-intro">{guided ? (lang === "hi" ? "संदेश वैकल्पिक है। अगले पेज पर भुगतान का संदर्भ पूछेंगे।" : "The message is optional. Next, tell us about the payment context.") : (lang === "hi" ? "जांचने पर संदेश विश्लेषण सर्वर पर जाता है। निजी जानकारी हटा दें।" : "Checking sends the message to the analysis server. Remove private details first.")}</p>
            {notice && <p role="status" className="disclaimer-box">{lang === "hi" ? "इस सत्र में कोई परिणाम नहीं है। रीफ्रेश के बाद निजी जानकारी नहीं रखी जाती। फिर जांचें।" : "There is no result in this session. Private draft details are not kept after refresh. Please check again."}</p>}
            <SpotlightCard className="input-panel"><MessageForm text={text} onTextChange={changeText} onSubmit={reviewMessage} busy={busy} t={t} allowEmpty={guided} actionLabel={editing ? (lang === "hi" ? "समीक्षा पर लौटें" : "Return to review") : (lang === "hi" ? "आगे" : "Continue")} />
            {error && <p className="error-note" role="alert">{t.error}</p>}{busy && <EmptyResult t={t} busy={busy} warming={warming} />}
            <ExampleList onPick={changeText} t={t} /><p className="disclaimer-box">{t.disclaimer}</p></SpotlightCard></div>}
          {question && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{question[lang]}</h1><SpotlightCard className="input-panel"><QuestionPage question={question} index={QUESTIONS.indexOf(question)} context={context} onChange={changeContext} onContinue={advance} lang={lang}/></SpotlightCard></div>}
          {route === "/check/review" && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "जांच से पहले विवरण की समीक्षा" : "Review before analysis"}</h1><SpotlightCard className="input-panel"><ReviewPage text={text} context={context} guided={guided} onEdit={edit} onSubmit={e=>submit(e,guided)} busy={busy} warming={warming} error={error} lang={lang} t={t}/></SpotlightCard></div>}
          {route === "/check/result" && data && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "आपकी जांच का परिणाम" : "Your check result"}</h1><SpotlightCard className="output-panel"><ResultPanel key={requestId.current} data={data} lang={lang} t={t} /></SpotlightCard><div className="result-controls"><a className="check-button" href="#/check/actions">{lang === "hi" ? "आगे क्या करें" : "What to do next"}</a><button className="note-button" onClick={() => navigate("/check/review")}>{lang === "hi" ? "जानकारी बदलें" : "Edit details"}</button><button className="note-button" onClick={() => start(guided)}>{lang === "hi" ? "नई जांच" : "Start a new check"}</button></div></div>}
          {route === "/check/actions" && data && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "आपकी कार्ययोजना" : "Your action plan"}</h1><SpotlightCard className="input-panel"><ActionPlan key={requestId.current} data={data} lang={lang} t={t}/></SpotlightCard><a href="#/check/result" className="note-button">{lang === "hi" ? "परिणाम देखें" : "Back to result"}</a></div>}
          {["/learn","/help","/about"].includes(route) && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{route === "/learn" ? (lang === "hi" ? "काल्पनिक संदेश से सीखें" : "Learn with a fictional message") : route === "/help" ? (lang === "hi" ? "तुरंत मदद" : "Urgent help") : (lang === "hi" ? "यह कैसे काम करता है और गोपनीयता" : "How it works and privacy")}</h1><SpotlightCard className="input-panel">{route === "/learn" ? <LearnPage lang={lang} t={t}/> : route === "/help" ? <HelpPage lang={lang}/> : <AboutPage lang={lang}/>}</SpotlightCard></div>}
          <nav className="resource-nav" aria-label={lang === "hi" ? "संसाधन" : "Resources"}><a href="#/learn">{lang === "hi" ? "सीखें" : "Learn"}</a><a href="#/help">{lang === "hi" ? "तुरंत मदद" : "Urgent help"}</a><a href="#/about">{lang === "hi" ? "यह कैसे काम करता है / गोपनीयता" : "How it works / privacy"}</a></nav>
          <footer>
            <span>
              TipCheck <span className="muted">/ {t.footer}</span>
            </span>
            <span>{t.footerCaution}</span>
          </footer>
        </main>
      </div>
    </MotionConfig>
  );
}
