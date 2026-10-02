import FlagList from './FlagList.jsx';
import RiskMeter from './RiskMeter.jsx';
import VerdictBadge from './VerdictBadge.jsx';

export default function ResultPanel({ data, lang, t }) {
  return (
    <section aria-live="polite">
      <VerdictBadge label={data.label} t={t} />
      <RiskMeter score={data.risk_score} level={data.risk_level} t={t} />
      <p><small>{t.engine}: {t.modes[data.mode] || data.mode}. {t.scoreNote}</small></p>
      {data.context_warning && <p>{t.context}</p>}
      <FlagList flags={data.flags} lang={lang} t={t} />
      <h3>{t.verifyTitle}</h3>
      <ol>{t.verify.map((v, i) => <li key={i}>{v}</li>)}</ol>
      <a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noreferrer">{t.sebiResources}</a>
      {data.links.length > 0 && (
        <>
          <p>{t.urls}</p>
          <ul>{data.links.map((u, i) => <li key={i}>{u}</li>)}</ul>
        </>
      )}
    </section>
  );
}
