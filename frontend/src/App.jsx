import { useRef, useState } from 'react';
import { analyzeMessage } from './api/client.js';
import ExampleList from './components/ExampleList.jsx';
import Header from './components/Header.jsx';
import MessageForm from './components/MessageForm.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import { STRINGS } from './i18n.js';
import './style.css';

export default function App() {
  const [text, setText] = useState('');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState('en');
  const t = STRINGS[lang];
  const requestId = useRef(0);

  function changeText(value) {
    requestId.current += 1;
    setText(value);
    setData(null);
    setError(false);
    setBusy(false);
  }

  async function submit(e) {
    e.preventDefault();
    const id = ++requestId.current;
    setBusy(true);
    setError(false);
    setData(null);
    try {
      const result = await analyzeMessage(text);
      if (id === requestId.current) setData(result);
    } catch {
      if (id === requestId.current) setError(true);
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }

  return (
    <main>
      <Header lang={lang} onLangChange={setLang} t={t} />
      <ExampleList onPick={changeText} t={t} />
      <MessageForm text={text} onTextChange={changeText} onSubmit={submit} busy={busy} t={t} />
      {error && <p role="alert">{t.error}</p>}
      {data && <ResultPanel data={data} lang={lang} t={t} />}
    </main>
  );
}
