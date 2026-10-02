import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLesson } from '../src/lib/learning.js';
test('matched phrase lesson preserves evidence and bilingual explanation', () => {
  const lesson = buildLesson({ flags: [{ phrase: 'Guaranteed returns', en: 'Check claim', hi: 'दावा जांचें', source: 'https://investor.sebi.gov.in/spot-any-scam.html' }] });
  assert.equal(lesson.length, 3);
  assert.equal(lesson[0].kind, 'signal');
  assert.equal(lesson[0].phrase, 'Guaranteed returns');
  assert.equal(lesson[0].explanation.hi, 'दावा जांचें');
  assert.deepEqual(lesson.map(q => q.correct), [1, 0, 2]);
});
test('zero flags produces uncertainty lesson, not a safe verdict', () => {
  const lesson = buildLesson({ flags: [] });
  assert.equal(lesson[0].kind, 'noSignal');
  assert.equal(lesson[0].correct, 1);
  assert.equal(lesson[2].kind, 'identity');
});
