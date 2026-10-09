import { motion } from "motion/react";
import { Link2 } from "lucide-react";
import PreflightPanel from "./PreflightPanel.jsx";
import FlagList from "./FlagList.jsx";
import RiskMeter from "./RiskMeter.jsx";
import VerdictBadge from "./VerdictBadge.jsx";
export default function ResultPanel({ data, lang, t }) {
  return (
    <motion.section
      className="result-panel"
      aria-live="polite"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="result-header">
        <span className="eyebrow">02 / {t.resultEyebrow}</span>
        <span className="engine-badge">{t.modes[data.mode] || data.mode}</span>
      </div>
      {data.preflight && <><PreflightPanel data={data} lang={lang} /><h3 className="message-only-title">{lang === "hi" ? "केवल संदेश की जांच" : "Message-only check"}</h3></>}
      <VerdictBadge label={data.label} t={t} />
      <RiskMeter score={data.risk_score} level={data.risk_level} t={t} />
      <p className="score-note">{t.scoreNote}</p>
      {data.context_warning && <p className="context-note">{t.context}</p>}
      <FlagList flags={data.flags} lang={lang} t={t} />
      {data.links.length > 0 && (
        <div className="detected-links">
          <h3>
            <Link2 size={16} />
            {t.urls}
          </h3>
          <ul>
            {data.links.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
