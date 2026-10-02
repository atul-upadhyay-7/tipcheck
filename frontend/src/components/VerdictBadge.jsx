import { Megaphone, BookOpen, CircleHelp } from "lucide-react";
export default function VerdictBadge({ label, t }) {
  const key = t.verdict[label] ? label : "uncertain";
  const Icon =
    key === "promotion"
      ? Megaphone
      : key === "education"
        ? BookOpen
        : CircleHelp;
  return (
    <div className={`verdict ${key}`}>
      <span className="verdict-icon">
        <Icon size={22} />
      </span>
      <div>
        <small>{t.verdictTitle}</small>
        <h2>{t.verdict[key]}</h2>
      </div>
    </div>
  );
}
