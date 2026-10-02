// Deterministic teaching prompts, not model-generated advice or a safety score.
export function buildLesson(data) {
  const flag = data.flags?.[0];
  return [
    {
      kind: flag ? "signal" : "noSignal",
      phrase: flag?.phrase || "",
      explanation: flag ? { en: flag.en, hi: flag.hi } : null,
      source: flag?.source || "https://investor.sebi.gov.in/spot-any-scam.html",
      correct: 1,
    },
    { kind: "score", correct: 0 },
    {
      kind: "identity",
      correct: 2,
      source: "https://www.sebi.gov.in/intermediaries.html",
    },
  ];
}
