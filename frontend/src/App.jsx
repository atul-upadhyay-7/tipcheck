import { useEffect, useRef, useState } from "react";
import { analyzeMessage } from "./api/client.js";
import ExampleList from "./components/ExampleList.jsx";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import { STRINGS } from "./i18n.js";
import SpotlightCard from "./components/SpotlightCard.jsx";
import EmptyResult from "./components/EmptyResult.jsx";
import { MotionConfig } from "motion/react";
import "./style.css";

export default function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [warming, setWarming] = useState(false);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];
  const requestId = useRef(0);
  const resultPanel = useRef(null);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    if (data && window.matchMedia("(max-width: 1023px)").matches) {
      resultPanel.current?.focus({ preventScroll: true });
      resultPanel.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    }
  }, [data]);

  function changeText(value) {
    requestId.current += 1;
    setText(value);
    setData(null);
    setError(false);
    setBusy(false);
    setWarming(false);
  }

  async function submit(e) {
    e.preventDefault();
    const id = ++requestId.current;
    setBusy(true);
    setWarming(false);
    setError(false);
    setData(null);
    try {
      const result = await analyzeMessage(text, { onWarming: () => {
        if (id === requestId.current) setWarming(true);
      } });
      if (id === requestId.current) setData(result);
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
          <Header lang={lang} onLangChange={setLang} t={t} />
          <div className="workspace grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SpotlightCard className="input-panel">
              <MessageForm
                text={text}
                onTextChange={changeText}
                onSubmit={submit}
                busy={busy}
                t={t}
              />
              {error && (
                <p className="error-note" role="alert">
                  {t.error}
                </p>
              )}
              <ExampleList onPick={changeText} t={t} />
              <p className="disclaimer-box">{t.disclaimer}</p>
            </SpotlightCard>
            <div
              className="result-anchor"
              ref={resultPanel}
              tabIndex={-1}
              aria-label={t.resultEyebrow}
            >
              <SpotlightCard className="output-panel">
                {data ? (
                  <ResultPanel data={data} lang={lang} t={t} />
                ) : (
                  <EmptyResult t={t} busy={busy} warming={warming} />
                )}
              </SpotlightCard>
            </div>
          </div>
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
