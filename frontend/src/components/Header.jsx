export default function Header({ lang, onLangChange }) {
  return (
    <header>
      <h1>TipCheck</h1>
      <p>Pause before trusting a financial message.</p>
      <p>Education only. Not investment advice. Remove names, phone numbers and account details before pasting.</p>
      <label>
        Language{' '}
        <select value={lang} onChange={(e) => onLangChange(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </label>
    </header>
  );
}
