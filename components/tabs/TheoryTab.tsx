'use client';

import React from 'react';
import { Experiment } from '@/lib/experiments';

interface TheoryTabProps {
  experiment: Experiment;
}

export default function TheoryTab({ experiment: exp }: TheoryTabProps) {
  return (
    <div>
      {/* Manual Theory */}
      <div className="content-section">
        <div className="content-section-header">
          THEORY — FROM LAB MANUAL
        </div>
        <div
          className="content-block"
          style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
        >
          {exp.theory}
        </div>
        <div style={{
          marginTop: 6,
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span style={{
            background: 'rgba(120,155,131,0.12)',
            border: '1px solid rgba(120,155,131,0.25)',
            borderRadius: 2,
            padding: '1px 5px',
            color: 'var(--color-success)',
            fontSize: 9,
          }}>SOURCE: LAB MANUAL</span>
          Pages {exp.manualPages.join('–')} of ETPCL502
        </div>
      </div>

      {/* Supplementary Explanation Note */}
      <div className="content-section">
        <div className="content-section-header">
          SUPPLEMENTARY EXPLANATION
        </div>
        <div style={{
          background: 'rgba(66, 106, 145, 0.05)',
          border: '1px solid rgba(66, 106, 145, 0.2)',
          borderRadius: 4,
          padding: '12px 14px',
        }}>
          <div style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-blue)',
            marginBottom: 8,
            letterSpacing: '0.06em',
          }}>
            AI-GENERATED CONTENT — NOT FROM THE MANUAL
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Use the Engineering Assistant (right panel) to generate a supplementary explanation for this experiment. 
            Ask: <em>&quot;Explain this experiment in more detail&quot;</em> or <em>&quot;Explain the circuit in simple terms&quot;</em>.
          </div>
          <div style={{
            marginTop: 10,
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            Supplementary content will be clearly labelled and kept separate from the manual.
          </div>
        </div>
      </div>
    </div>
  );
}
