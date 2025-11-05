'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/app/lib/learn-definitions';

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (qid: string, cid: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: cid }));

  const score = submitted
    ? questions.reduce((s, q) => {
        const choice = q.choices.find((c) => c.id === answers[q.id]);
        return s + (choice?.correct ? 1 : 0);
      }, 0)
    : 0;

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <h3 className="text-lg font-semibold">Practice Quiz</h3>
      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="text-gray-600">No practice available.</div>
        )}
        {questions.map((q) => (
          <div key={q.id} className="rounded border p-3">
            <div className="font-medium">{q.prompt}</div>
            <div className="mt-2 space-y-2">
              {q.choices.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === c.id}
                    onChange={() => setAnswer(q.id, c.id)}
                  />
                  <span>{c.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          onClick={() => setSubmitted(true)}
        >
          Submit
        </button>
        {submitted && (
          <span className="text-sm text-gray-700">
            Score: {score}/{questions.length}
          </span>
        )}
      </div>
    </div>
  );
}