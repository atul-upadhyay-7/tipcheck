import {
  ArrowRight,
  LockKeyhole,
  LoaderCircle,
  MessageSquareText,
} from "lucide-react";
import { motion } from "motion/react";
export default function MessageForm({ text, onTextChange, onSubmit, busy, t }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="panel-heading">
        <span className="step-number">01</span>
        <div>
          <h2>
            <MessageSquareText size={18} />
            {t.paste}
          </h2>
          <p>{t.inputHint}</p>
        </div>
      </div>
      <label htmlFor="msg" className="sr-only">
        {t.paste}
      </label>
      <textarea
        id="msg"
        value={text}
        placeholder={t.placeholder}
        maxLength={2000}
        aria-describedby="message-help"
        onChange={(e) => onTextChange(e.target.value)}
      />
      <div className="input-meta">
        <span>{t.removeDetails}</span>
        <span>
          {text.length}
          <span className="muted"> / 2000</span>
        </span>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="check-button"
        disabled={busy || text.trim().length < 5}
      >
        {busy ? (
          <LoaderCircle className="loading-icon" size={18} />
        ) : (
          <ShieldIcon />
        )}{" "}
        {busy ? t.checking : t.check}
        <ArrowRight size={18} />
      </motion.button>
      <p id="message-help" className="privacy-note">
        <LockKeyhole size={14} />
        {t.privacy}
      </p>
    </form>
  );
}
function ShieldIcon() {
  return (
    <span className="check-symbol" aria-hidden="true">
      ✓
    </span>
  );
}
