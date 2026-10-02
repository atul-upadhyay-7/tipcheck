export default function Header({ lang, onLangChange, t }) {
  return (
    <header>
      <h1>TipCheck</h1>
      <p>{t.tagline}</p>
      <p>{t.disclaimer}</p>
      <label>
        {t.language}{' '}
        <select value={lang} onChange={(e) => onLangChange(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </label>
    </header>
  );
}
