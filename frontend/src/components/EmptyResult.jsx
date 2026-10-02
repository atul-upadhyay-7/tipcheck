import { ScanLine, TextSearch, BadgeAlert, ListChecks } from "lucide-react";
export default function EmptyResult({ t, busy }) {
  return (
    <section className="empty-result">
      <div className={`scan-icon ${busy ? "scanning" : ""}`}>
        <ScanLine size={38} />
      </div>
      <span className="eyebrow">{t.resultEyebrow}</span>
      <h2>{busy ? t.checking : t.emptyTitle}</h2>
      <p>{t.emptyDescription}</p>
      <div className="empty-steps">
        {[
          [TextSearch, t.emptyType],
          [BadgeAlert, t.emptyFlags],
          [ListChecks, t.emptyVerify],
        ].map(([Icon, label], i) => (
          <div key={i}>
            <Icon size={18} />
            <span>{label}</span>
            <span className="muted">0{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="empty-caution">{t.noFlags}</p>
    </section>
  );
}
