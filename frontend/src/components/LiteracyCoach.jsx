import { useState } from "react";
import {
  GraduationCap,
  ArrowRight,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { buildLesson } from "../lib/learning.js";

export default function LiteracyCoach({ data, lang, t }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const questions = buildLesson(data);
  const current = questions[index];
  const copy = t.lesson.questions[current.kind];
  const chosen = answers[index];
  function reset() {
    setIndex(0);
    setAnswers([]);
    setDone(false);
  }
  return (
    <div className="literacy-coach">
      <div className="coach-heading">
        <GraduationCap size={20} />
        <div>
          <h3>{t.lesson.title}</h3>
          <p>{t.lesson.subtitle}</p>
        </div>
      </div>
      {!open ? (
        <button className="coach-start" onClick={() => setOpen(true)}>
          {t.lesson.start}
          <ArrowRight size={15} />
        </button>
      ) : done ? (
        <div aria-live="polite">
          <h4>{t.lesson.done}</h4>
          <p>{t.lesson.takeaway}</p>
          <p className="coach-disclaimer">{t.lesson.disclaimer}</p>
          <button className="coach-start" onClick={reset}>
            <RotateCcw size={14} />
            {t.lesson.again}
          </button>
        </div>
      ) : (
        <div>
          <p className="coach-progress">
            {t.lesson.step} {index + 1}/3
          </p>
          <h4>{copy.prompt}</h4>
          {current.phrase && <blockquote>"{current.phrase}"</blockquote>}
          <div className="coach-options">
            {copy.options.map((option, i) => (
              <button
                key={i}
                aria-pressed={chosen === i}
                disabled={chosen !== undefined}
                className={
                  chosen !== undefined && i === current.correct
                    ? "correct-option"
                    : chosen === i
                      ? "chosen-option"
                      : ""
                }
                onClick={() => setAnswers([...answers, i])}
              >
                {option}
              </button>
            ))}
          </div>
          {chosen !== undefined && (
            <div className="coach-feedback" role="status">
              <strong>
                {chosen === current.correct
                  ? t.lesson.correct
                  : t.lesson.rethink}
              </strong>
              <p>{current.explanation?.[lang] || copy.explanation}</p>
              {current.explanation && <p>{copy.explanation}</p>}
              {current.source && (
                <a href={current.source} target="_blank" rel="noreferrer">
                  {t.sebi}
                  <ExternalLink size={12} />
                </a>
              )}
              <button
                className="coach-start"
                onClick={() =>
                  index === 2 ? setDone(true) : setIndex(index + 1)
                }
              >
                {index === 2 ? t.lesson.finish : t.lesson.next}
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
