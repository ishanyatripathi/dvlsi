'use client';

import React from 'react';
import { Experiment } from '@/lib/experiments';

interface TruthTableTabProps {
  experiment: Experiment;
}

export default function TruthTableTab({ experiment: exp }: TruthTableTabProps) {
  if (!exp.truthTable) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No Truth Table</div>
        <div className="empty-state-subtitle">
          This experiment does not have an associated truth table.
        </div>
      </div>
    );
  }

  const { inputHeaders, outputHeaders, rows, sourceNote } = exp.truthTable;
  const allHeaders = [...inputHeaders, ...outputHeaders];

  return (
    <div>
      <div className="content-section">
        <div className="content-section-header">
          TRUTH TABLE — {exp.id.toUpperCase()}
        </div>

        <div className="truth-table-wrapper">
          <table className="truth-table">
            <thead>
              <tr>
                {inputHeaders.map(h => (
                  <th key={h} style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
                {outputHeaders.map(h => (
                  <th key={h} style={{ color: 'var(--color-info)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {inputHeaders.map(h => (
                    <td key={h}>{row.inputs[h] ?? '–'}</td>
                  ))}
                  {outputHeaders.map(h => (
                    <td key={h} className="output-col">{row.outputs[h] ?? '–'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: 8,
          padding: '6px 10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 3,
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
        }}>
          <span style={{ color: 'var(--color-warning)', flexShrink: 0 }}>NOTE</span>
          <span>{sourceNote}</span>
        </div>
      </div>

      {/* Ask AI about the table */}
      <div className="content-section">
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
            ENGINEERING ASSISTANT
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Ask the assistant: <em>&quot;Explain this truth table&quot;</em> or 
            <em> &quot;Explain why row X has output Y&quot;</em>
          </div>
        </div>
      </div>
    </div>
  );
}
