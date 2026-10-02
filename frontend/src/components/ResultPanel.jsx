import FlagList from './FlagList.jsx';

export default function ResultPanel({ data, lang }) {
  return (
    <section aria-live="polite">
      <h2>Content: {data.label}</h2>
      <p>Engine: {data.mode}. Source: not verified.</p>
      <h3>Red flags: {data.risk_level.replaceAll('_', ' ')} ({data.risk_score}/100)</h3>
      <p>{data.note}</p>
      {data.context_warning && (
        <p>Warning language detected. Some keyword matches were suppressed; quotation and mixed context may need manual review.</p>
      )}
      <FlagList flags={data.flags} lang={lang} />
      <h3>Verify independently</h3>
      <ol>
        <li>Check the claimed entity on the official SEBI site, including registration status and contact details.</li>
        <li>A registration number in a message can be copied. It is not proof of identity.</li>
        <li>Do not open unknown links or share OTPs or financial details.</li>
      </ol>
      <a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noreferrer">Official SEBI intermediary resources</a>
      <p>Detected URLs are shown as text only, not visited:</p>
      <ul>{data.links.map((u, i) => <li key={i}>{u}</li>)}</ul>
    </section>
  );
}
