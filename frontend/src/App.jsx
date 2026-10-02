import { useState } from 'react';
import { analyzeMessage } from './api/client.js';
import ExampleList from './components/ExampleList.jsx';
import Header from './components/Header.jsx';
import MessageForm from './components/MessageForm.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import './style.css';

export default function App() {
  const [text, setText] = useState('');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setData(null);
    try {
      setData(await analyzeMessage(text));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <Header lang={lang} onLangChange={setLang} />
      <ExampleList onPick={(s) => { setText(s); setData(null); }} />
      <MessageForm text={text} onTextChange={setText} onSubmit={submit} busy={busy} />
      {error && <p role="alert">{error}</p>}
      {data && <ResultPanel data={data} lang={lang} />}
    </main>
  );
}
