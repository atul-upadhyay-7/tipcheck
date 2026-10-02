import { useState } from 'react';
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

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    setData(null);
    try {
      setData(await analyzeMessage(text));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <Header lang={lang} onLangChange={setLang} t={t} />
      <ExampleList onPick={(s) => { setText(s); setData(null); }} t={t} />
      <MessageForm text={text} onTextChange={setText} onSubmit={submit} busy={busy} t={t} />
      {error && <p role="alert">{t.error}</p>}
      {data && <ResultPanel data={data} lang={lang} t={t} />}
    </main>
  );
}
