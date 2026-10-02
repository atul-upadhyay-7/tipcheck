import { EXAMPLES } from '../data/examples.js';

export default function ExampleList({ onPick }) {
  return (
    <section>
      <h2>Try a fictional example</h2>
      {EXAMPLES.map((example, i) => (
        <button key={i} type="button" onClick={() => onPick(example)}>
          Example {i + 1}
        </button>
      ))}
    </section>
  );
}
