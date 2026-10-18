'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shuffle, Eye, EyeOff } from 'lucide-react';
import { Experiment, VivaQuestion } from '@/lib/experiments';

interface VivaTabProps {
  experiment: Experiment;
  onAskAI?: (prompt: string) => void;
}

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function VivaTab({ experiment: exp, onAskAI }: VivaTabProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [questions, setQuestions] = useState<VivaQuestion[]>(exp.vivaQuestions);
  const [quizMode, setQuizMode] = useState(false);
  const [quizRevealed, setQuizRevealed] = useState<Set<number>>(new Set());

  const handleShuffle = () => {
    setQuestions(q => [...q].sort(() => Math.random() - 0.5));
    setShuffled(!shuffled);
    setOpenIndex(null);
    setQuizRevealed(new Set());
  };

  const toggleAnswer = (i: number) => {
    if (quizMode) {
      setQuizRevealed(prev => new Set([...prev, i]));
    } else {
      setOpenIndex(prev => prev === i ? null : i);
    }
  };

  const isAnswerVisible = (i: number) => {
    if (showAllAnswers) return true;
    if (quizMode) return quizRevealed.has(i);
    return openIndex === i;
  };

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
        flexWrap: 'wrap',
      }}>
        <button
          className="btn btn-outline"
          onClick={() => setShowAllAnswers(!showAllAnswers)}
          style={{ fontSize: 10 }}
        >
          {showAllAnswers ? <EyeOff size={11} /> : <Eye size={11} />}
          {showAllAnswers ? 'Hide Answers' : 'Show All Answers'}
        </button>
        <button
          className="btn btn-outline"
          onClick={handleShuffle}
          style={{ fontSize: 10 }}
        >
          <Shuffle size={11} />
          Shuffle
        </button>
        <button
          className={`btn ${quizMode ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setQuizMode(!quizMode);
            setQuizRevealed(new Set());
            setShowAllAnswers(false);
          }}
          style={{ fontSize: 10 }}
        >
          {quizMode ? 'Exit Quiz' : 'Quick Quiz'}
        </button>

        {onAskAI && (
          <>
            <button
              className="btn btn-outline"
              onClick={() => onAskAI(`Generate 3 beginner-level viva questions for ${exp.title} (EXP-${exp.number.toString().padStart(2,'0')})`)}
              style={{ fontSize: 10 }}
            >
              + Beginner
            </button>
            <button
              className="btn btn-outline"
              onClick={() => onAskAI(`Generate 3 advanced viva questions for ${exp.title} (EXP-${exp.number.toString().padStart(2,'0')})`)}
              style={{ fontSize: 10 }}
            >
              + Advanced
            </button>
          </>
        )}
      </div>

      {quizMode && (
        <div style={{
          background: 'rgba(66, 106, 145, 0.08)',
          border: '1px solid rgba(66, 106, 145, 0.2)',
          borderRadius: 4,
          padding: '7px 12px',
          marginBottom: 12,
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          QUIZ MODE — Try to answer each question before revealing the answer.
          Score: {quizRevealed.size} / {questions.length} revealed
        </div>
      )}

      {/* Questions */}
      <div>
        {questions.map((vq, i) => (
          <div key={i} className="viva-item">
            <button
              className="viva-question-btn"
              onClick={() => toggleAnswer(i)}
            >
              <span className="viva-q-number">Q{(i + 1).toString().padStart(2, '0')}</span>
              <span className="viva-q-text">{vq.question}</span>
              {isAnswerVisible(i)
                ? <ChevronUp size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                : <ChevronDown size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              }
            </button>
            {isAnswerVisible(i) && (
              <div className="viva-answer">
                {vq.answer}
              </div>
            )}
            {quizMode && !quizRevealed.has(i) && !showAllAnswers && (
              <div style={{
                padding: '6px 12px 6px 42px',
                borderTop: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.15)',
              }}>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: 10 }}
                  onClick={() => setQuizRevealed(prev => new Set([...prev, i]))}
                >
                  Reveal Answer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ask AI for more questions */}
      {onAskAI && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            background: 'rgba(66, 106, 145, 0.05)',
            border: '1px solid rgba(66, 106, 145, 0.2)',
            borderRadius: 4,
            padding: '10px 14px',
          }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-blue)',
              marginBottom: 6,
            }}>
              GENERATE MORE QUESTIONS
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              Ask the Engineering Assistant to generate additional viva questions for this experiment.
            </div>
            <button
              className="btn btn-outline"
              style={{ fontSize: 10 }}
              onClick={() => onAskAI(`Generate 5 viva questions with detailed answers for ${exp.title} (EXP-${exp.number.toString().padStart(2,'0')}). Cover the most important concepts.`)}
            >
              Generate 5 More Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
