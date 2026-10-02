import { ShieldCheck, Languages, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function Header({ lang, onLangChange, t }) {
  return (
    <header>
      <nav className="flex items-center justify-between gap-4 py-6">
        <a className="brand flex items-center gap-3" href="#">
          <span className="brand-icon">
            <ShieldCheck size={23} />
          </span>
          <span>
            TipCheck<span className="brand-dot">.</span>
          </span>
        </a>
        <label className="language-control flex items-center gap-2">
          <Languages size={17} aria-hidden="true" />
          <span className="sr-only">{t.language}</span>
          <select value={lang} onChange={(e) => onLangChange(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
      </nav>
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="eyebrow">
          <span className="status-dot" />
          {t.eyebrow}
          <ArrowUpRight size={14} />
        </span>
        <h1>
          {t.heroStart}
          <br />
          <span>{t.heroAccent}</span>
        </h1>
        <p className="hero-description">
          {t.tagline} {t.heroDescription}
        </p>
        <div className="hero-tags">
          <span>{t.tagLocal}</span>
          <span>{t.tagBilingual}</span>
          <span>{t.tagExplainable}</span>
        </div>
      </motion.div>
    </header>
  );
}
