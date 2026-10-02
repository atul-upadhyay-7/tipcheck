export default function VerdictBadge({ label, t }) {
  const key = t.verdict[label] ? label : 'uncertain';
  return (
    <div className={`verdict ${key}`}>
      <small>{t.verdictTitle}</small>
      <h2>{t.verdict[key]}</h2>
    </div>
  );
}
