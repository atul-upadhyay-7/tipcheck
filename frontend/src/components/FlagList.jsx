import { TriangleAlert, ExternalLink } from "lucide-react";
export default function FlagList({ flags, lang, t }) {
  if (!flags.length) return <p className="no-flags">{t.noFlags}</p>;
  return (
    <div className="flags-section">
      <h3>
        <TriangleAlert size={16} />
        {t.flagsTitle}
        <span className="count-badge">{flags.length}</span>
      </h3>
      <ul>
        {flags.map((f) => (
          <li className="flag-card" key={f.id}>
            <strong>"{f.phrase}"</strong>
            <p>{f[lang]}</p>
            <a href={f.source} target="_blank" rel="noreferrer">
              {t.sebi}
              <ExternalLink size={12} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
