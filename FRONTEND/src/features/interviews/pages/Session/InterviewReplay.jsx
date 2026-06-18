import React, { useState } from "react";

const ReplayItem = ({ question, index, isOpen, onToggle }) => (
  <div className={`replay-item ${isOpen ? "replay-item--open" : ""}`}>
    <button
      className="replay-item__header"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <div className="replay-item__meta">
        <span className="replay-item__index">Q{index + 1}</span>
        <p className="replay-item__question">{question.question}</p>
      </div>
      <span className="replay-item__chevron" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>

    <div className="replay-item__body">
      <div className="replay-item__inner">
        {question.answer ? (
          <div className="replay-section replay-section--answer">
            <span className="replay-section__label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Your Answer
            </span>
            <p className="replay-section__text">{question.answer}</p>
          </div>
        ) : (
          <div className="replay-section replay-section--skipped">
            <p className="replay-section__text replay-section__text--muted">
              No answer recorded.
            </p>
          </div>
        )}

        {question.feedback && (
          <div className="replay-section replay-section--feedback">
            <span className="replay-section__label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              AI Feedback
            </span>
            <p className="replay-section__text">{question.feedback}</p>
          </div>
        )}

        {question.idealAnswer && (
          <div className="replay-section replay-section--ideal">
            <span className="replay-section__label">🎯 Ideal Answer</span>

            <p className="replay-section__text">{question.idealAnswer}</p>
          </div>
        )}

        {question.missingPoints?.length > 0 && (
          <div className="replay-section replay-section--missing">
            <span className="replay-section__label">⚠ Missing Points</span>

            <ul className="replay-missing-list">
              {question.missingPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

const InterviewReplay = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const answered = questions.filter((q) => q.answer);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="replay-card">
      <div className="replay-card__header">
        <div className="replay-card__title-row">
          <span className="replay-card__icon">🎬</span>
          <div>
            <h3 className="replay-card__title">Interview Replay</h3>
            <p className="replay-card__subtitle">
              {answered.length} of {questions.length} questions answered
            </p>
          </div>
        </div>
      </div>

      <div className="replay-list">
        {questions.map((q, i) => (
          <ReplayItem
            key={i}
            index={i}
            question={q}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewReplay;
