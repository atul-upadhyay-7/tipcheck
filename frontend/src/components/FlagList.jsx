export default function FlagList({ flags, lang, t }) {
  if (!flags.length) return <p>{t.noFlags}</p>;
  return (
    <>
      <h3>{t.flagsTitle}</h3>
      <ul>
        {flags.map((f) => (
          <li key={f.id}>
            <strong>"{f.phrase}"</strong>
            <p>{f[lang]}</p>
            <a href={f.source} target="_blank" rel="noreferrer">{t.sebi}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
