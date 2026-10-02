export default function FlagList({ flags, lang }) {
  return (
    <ul>
      {flags.map((f) => (
        <li key={f.id}>
          <strong>"{f.phrase}"</strong>
          <p>{f[lang]}</p>
          <a href={f.source} target="_blank" rel="noreferrer">Read SEBI reference</a>
        </li>
      ))}
    </ul>
  );
}
