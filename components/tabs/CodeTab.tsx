'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Experiment } from '@/lib/experiments';

interface CodeTabProps {
  experiment: Experiment;
}

// Simple Verilog syntax highlighter
function highlightVerilog(code: string): React.ReactNode {
  const keywords = /\b(module|endmodule|input|output|wire|reg|assign|always|begin|end|case|endcase|if|else|for|while|integer|parameter|localparam|posedge|negedge|or|and|not|nand|nor|xor|xnor|buf|task|endtask|function|endfunction|initial|fork|join)\b/g;
  const types = /\b(\d+'[bBhHdD][0-9a-fA-FxXzZ_]+|\d+)\b/g;
  const comments = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)/g;
  const strings = /"([^"\\]|\\.)*"/g;

  // We'll do a simple pass with spans
  const lines = code.split('\n');
  return lines.map((line, i) => {
    // Tokenize the line
    const parts: Array<{ text: string; type: 'kw' | 'cm' | 'nm' | 'plain' }> = [];

    // Check if line has a comment
    const cmIdx = line.indexOf('//');
    const codepart = cmIdx >= 0 ? line.slice(0, cmIdx) : line;
    const comment = cmIdx >= 0 ? line.slice(cmIdx) : '';

    // Split code part by keywords
    let last = 0;
    const kwRegex = new RegExp(keywords.source, 'g');
    let m;
    while ((m = kwRegex.exec(codepart)) !== null) {
      if (m.index > last) parts.push({ text: codepart.slice(last, m.index), type: 'plain' });
      parts.push({ text: m[0], type: 'kw' });
      last = m.index + m[0].length;
    }
    if (last < codepart.length) parts.push({ text: codepart.slice(last), type: 'plain' });

    if (comment) parts.push({ text: comment, type: 'cm' });

    return (
      <React.Fragment key={i}>
        {parts.map((p, j) => {
          if (p.type === 'kw') return <span key={j} style={{ color: '#CBA6F7' }}>{p.text}</span>;
          if (p.type === 'cm') return <span key={j} style={{ color: '#6C7086', fontStyle: 'italic' }}>{p.text}</span>;
          // Highlight numbers in plain text
          const numHighlighted = p.text.split(/(\b\d+\b)/).map((seg, k) =>
            /^\d+$/.test(seg)
              ? <span key={k} style={{ color: '#FAB387' }}>{seg}</span>
              : seg
          );
          return <React.Fragment key={j}>{numHighlighted}</React.Fragment>;
        })}
        {'\n'}
      </React.Fragment>
    );
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="btn btn-ghost" onClick={handleCopy} style={{ fontSize: 10, gap: 4 }}>
      {copied ? <Check size={11} color="var(--color-success)" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function CodeTab({ experiment: exp }: CodeTabProps) {
  if (!exp.program) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No Program</div>
        <div className="empty-state-subtitle">
          This experiment ({exp.id.toUpperCase()}) uses Microwind for layout simulation. 
          See the Overview tab for step-by-step layout procedure.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Discrepancy Note */}
      {exp.discrepancyNote && (
        <div className="discrepancy-note">
          {exp.discrepancyNote}
        </div>
      )}

      {/* Original Program from Manual */}
      <div className="content-section">
        <div className="content-section-header">
          PROGRAM — FROM LAB MANUAL
        </div>
        <div className="code-block-container">
          <div className="code-block-header">
            <span className="code-block-title">
              {exp.programTitle ?? 'Verilog Code'} · {exp.id.toUpperCase()}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: 'rgba(120,155,131,0.12)',
                border: '1px solid rgba(120,155,131,0.25)',
                borderRadius: 2,
                padding: '1px 5px',
                color: 'var(--color-success)',
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
              }}>SOURCE: MANUAL</span>
              <CopyButton text={exp.program!} />
            </div>
          </div>
          <pre className="code-block-pre">
            {highlightVerilog(exp.program!)}
          </pre>
        </div>
        <div style={{
          marginTop: 6,
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          Original program from ETPCL502 lab manual — pages {exp.manualPages.join('–')}. Preserved verbatim.
        </div>
      </div>

      {/* AI Improvement Note */}
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
            CORRECTED / EXPLAINED VERSION
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Use the Engineering Assistant to request a corrected or explained version of this code.
            Ask: <em>&quot;Debug this code&quot;</em> or <em>&quot;Explain this Verilog module line by line&quot;</em>.
          </div>
          <div style={{
            marginTop: 8,
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            Any AI-generated code will be clearly labelled and never replace this original.
          </div>
        </div>
      </div>
    </div>
  );
}
