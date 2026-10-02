import { EXAMPLES } from "../data/examples.js";
import { Sparkles } from "lucide-react";
export default function ExampleList({ onPick, t }) {
  return (
    <section className="example-section">
      <h3>
        <Sparkles size={15} />
        {t.examples}
      </h3>
      <div className="example-grid">
        {EXAMPLES.map((example, i) => (
          <button
            className="example-chip"
            key={i}
            type="button"
            onClick={() => onPick(example)}
          >
            <span className={`example-dot dot-${i}`} />
            {t.exampleNames[i]}
          </button>
        ))}
      </div>
    </section>
  );
}
