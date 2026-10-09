import { useEffect, useRef, useState } from "react";
import { analyzeMessage } from "./api/client.js";
import ExampleList from "./components/ExampleList.jsx";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import PaymentContext from "./components/PaymentContext.jsx";
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
    document.title = `${route === "/" ? "Start" : route.split("/").pop()} | TipCheck`;
  }, [route, data]);

  function navigate(path) { window.location.hash = path; }
  function start(payment) {
    changeText(""); setContext({ ...EMPTY_CONTEXT }); setGuided(payment);
    setNotice(false); navigate("/check/message");
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
          </div><p className="disclaimer-box">{lang === "hi" ? "कोई खाता जरूरी नहीं। पहचान सत्यापित नहीं होती, कोई भुगतान नहीं भेजा या रोका जाता।" : "No account needed. Identities are not verified and no payment is sent or blocked."}</p></section>}
          {route === "/check/message" && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "संदेश देखें" : "Look at the message"}</h1><p className="flow-intro">{guided ? (lang === "hi" ? "संदेश वैकल्पिक है। अगले पेज पर भुगतान का संदर्भ पूछेंगे।" : "The message is optional. Next, tell us about the payment context.") : (lang === "hi" ? "जांचने पर संदेश विश्लेषण सर्वर पर जाता है। निजी जानकारी हटा दें।" : "Checking sends the message to the analysis server. Remove private details first.")}</p>
            {notice && <p role="status" className="disclaimer-box">{lang === "hi" ? "इस सत्र में कोई परिणाम नहीं है। रीफ्रेश के बाद निजी जानकारी नहीं रखी जाती। फिर जांचें।" : "There is no result in this session. Private draft details are not kept after refresh. Please check again."}</p>}
            <SpotlightCard className="input-panel"><MessageForm text={text} onTextChange={changeText} onSubmit={e => submit(e)} busy={busy} t={t} />
            {guided && <button type="button" className="note-button" onClick={() => navigate("/check/context")}>{lang === "hi" ? "आगे: भुगतान का संदर्भ" : "Continue to payment context"}</button>}
            {error && <p className="error-note" role="alert">{t.error}</p>}{busy && <EmptyResult t={t} busy={busy} warming={warming} />}
            <ExampleList onPick={changeText} t={t} /><p className="disclaimer-box">{t.disclaimer}</p></SpotlightCard></div>}
          {route === "/check/context" && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "भुगतान का संदर्भ" : "Payment context"}</h1><p className="flow-intro">{lang === "hi" ? "केवल संबंधित जानकारी बताएं। अज्ञात उत्तर भी स्वीकार हैं।" : "Only relevant details. Not sure is a valid answer."}</p><SpotlightCard className="input-panel"><PaymentContext context={context} onChange={changeContext} onSubmit={e => submit(e,true)} busy={busy} lang={lang} open />{error && <p className="error-note" role="alert">{t.error}</p>}{busy && <EmptyResult t={t} busy={busy} warming={warming} />}</SpotlightCard></div>}
          {route === "/check/result" && data && <div className="route-content"><h1 className="flow-heading" ref={heading} tabIndex={-1}>{lang === "hi" ? "आपकी जांच का परिणाम" : "Your check result"}</h1><SpotlightCard className="output-panel"><ResultPanel key={requestId.current} data={data} lang={lang} t={t} /></SpotlightCard><div className="result-controls"><button className="note-button" onClick={() => navigate(data.preflight ? "/check/context" : "/check/message")}>{lang === "hi" ? "जानकारी बदलें" : "Edit details"}</button><button className="note-button" onClick={() => start(guided)}>{lang === "hi" ? "नई जांच" : "Start a new check"}</button></div></div>}
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
