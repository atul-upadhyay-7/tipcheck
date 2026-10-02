import { motion, useReducedMotion } from "motion/react";
export default function RiskMeter({ score, level, t }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="meter"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-label={t.riskTitle}
    >
      <div className="meter-head">
        <strong>{t.riskTitle}</strong>
        <span className={`risk-value ${level}`}>
          {score}
          <small>/100</small>
        </span>
      </div>
      <div className="meter-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: reduce ? 0 : 0.6 }}
          className={`meter-fill ${level}`}
        />
      </div>
      <div className="meter-labels">
        <span>{t.risk[level]}</span>
        <span>{t.heuristic}</span>
      </div>
    </div>
  );
}
