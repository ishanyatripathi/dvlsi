'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Experiment } from '@/lib/experiments';

interface OverviewTabProps {
  experiment: Experiment;
}

function CollapsibleSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="content-section">
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 0 5px 0',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: 8,
          width: '100%',
        }}
      >
        <span className="content-section-header" style={{ margin: 0, padding: 0, border: 'none' }}>
          {title}
        </span>
        {open
          ? <ChevronUp size={11} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
          : <ChevronDown size={11} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
        }
      </button>
      {open && children}
    </div>
  );
}

export default function OverviewTab({ experiment: exp }: OverviewTabProps) {
  return (
    <div>
      {/* Meta */}
      <div className="exp-meta-grid" style={{ marginBottom: 16 }}>
        <div className="exp-meta-item">
          <div className="exp-meta-label">Experiment</div>
          <div className="exp-meta-value">{exp.id.toUpperCase()}</div>
        </div>
        <div className="exp-meta-item">
          <div className="exp-meta-label">Category</div>
          <div className="exp-meta-value" style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }}>{exp.sectionLabel}</div>
        </div>
        <div className="exp-meta-item">
          <div className="exp-meta-label">Software</div>
          <div className="exp-meta-value">{exp.software}</div>
        </div>
        <div className="exp-meta-item">
          <div className="exp-meta-label">Type</div>
          <div className="exp-meta-value">
            <span className={`badge ${exp.type === 'verilog' ? 'badge-blue' : 'badge-green'}`}>
              {exp.type === 'verilog' ? 'VERILOG HDL' : 'CMOS LAYOUT'}
            </span>
          </div>
        </div>
        <div className="exp-meta-item">
          <div className="exp-meta-label">Manual Pages</div>
          <div className="exp-meta-value">{exp.manualPages.join(', ')}</div>
        </div>
      </div>

      {/* Discrepancy Note */}
      {exp.discrepancyNote && (
        <div className="discrepancy-note">
          {exp.discrepancyNote}
        </div>
      )}

      {/* AIM */}
      <CollapsibleSection title="AIM">
        <div className="content-block">
          {exp.aim}
        </div>
      </CollapsibleSection>

      {/* Algorithm (if present) */}
      {exp.algorithm && (
        <CollapsibleSection title="ALGORITHM">
          <div className="content-block">
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
              {exp.algorithm}
            </pre>
          </div>
        </CollapsibleSection>
      )}

      {/* Procedure */}
      <CollapsibleSection title="PROCEDURE">
        <ol className="procedure-list">
          {exp.procedure.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </CollapsibleSection>

      {/* Result / Conclusion */}
      <CollapsibleSection title="CONCLUSION / RESULT">
        <div className="content-block">
          {exp.conclusion}
        </div>
      </CollapsibleSection>
    </div>
  );
}
