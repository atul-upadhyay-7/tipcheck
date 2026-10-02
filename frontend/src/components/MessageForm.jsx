export default function MessageForm({ text, onTextChange, onSubmit, busy, t }) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="msg">{t.paste}</label>
      <textarea id="msg" value={text} maxLength={2000} aria-describedby="message-help" onChange={(e) => onTextChange(e.target.value)} />
      <p id="message-help"><small>{text.length}/2000 · {t.privacy}</small></p>
      <button disabled={busy || text.trim().length < 5}>{busy ? t.checking : t.check}</button>
    </form>
  );
}
