export default function RiskMeter({ score, level, t }) {
  return (
    <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={t.riskTitle}>
      <div className="meter-head">
        <strong>{t.riskTitle}</strong>
        <span>{t.risk[level]} ({score}/100)</span>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${level}`} style={{ width: `${Math.max(score, 3)}%` }} />
      </div>
    </div>
  );
}
