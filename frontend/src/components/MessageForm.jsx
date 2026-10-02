export default function MessageForm({ text, onTextChange, onSubmit, busy }) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="msg">Paste message</label>
      <textarea id="msg" value={text} maxLength={2000} onChange={(e) => onTextChange(e.target.value)} />
      <button disabled={busy || text.trim().length < 5}>{busy ? 'Checking...' : 'Check message'}</button>
    </form>
  );
}
