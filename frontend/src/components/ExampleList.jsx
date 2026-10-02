import { EXAMPLES } from '../data/examples.js';

export default function ExampleList({ onPick, t }) {
  return (
    <section>
      <h2>{t.examples}</h2>
      {EXAMPLES.map((example, i) => (
        <button key={i} type="button" onClick={() => onPick(example)}>
          {t.exampleNames[i]}
        </button>
      ))}
    </section>
  );
}
