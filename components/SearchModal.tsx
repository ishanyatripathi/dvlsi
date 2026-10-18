'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { searchExperiments, SearchResult } from '@/lib/search';
import { Experiment } from '@/lib/experiments';

interface SearchModalProps {
  onClose: () => void;
  onSelect: (exp: Experiment) => void;
}

export default function SearchModal({ onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const r = searchExperiments(query);
    setResults(r);
  }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-input-row">
          <Search size={14} color="var(--text-muted)" />
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Search experiments, concepts, Verilog modules..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="icon-btn" onClick={onClose} title="Close">
            <X size={13} />
          </button>
        </div>

        <div className="search-results">
          {query.length >= 2 && results.length === 0 && (
            <div className="search-empty">
              <div style={{ marginBottom: 4, color: 'var(--text-secondary)' }}>No results found</div>
              <div>Try: &quot;multiplexer&quot;, &quot;verilog nand&quot;, &quot;exp 7&quot;, &quot;pseudo nmos&quot;</div>
            </div>
          )}
          {query.length < 2 && (
            <div className="search-empty">
              Type at least 2 characters to search
            </div>
          )}
          {results.map(r => (
            <div
              key={r.experiment.id}
              className="search-result-item"
              onClick={() => { onSelect(r.experiment); onClose(); }}
            >
              <span className="search-result-id">{r.experiment.id.toUpperCase()}</span>
              <div className="search-result-info">
                <div className="search-result-title">{r.experiment.title}</div>
                <div className="search-result-sections">
                  {r.matchedSections.join(' · ')}
                </div>
              </div>
              <span
                className={`badge ${r.experiment.type === 'verilog' ? 'badge-blue' : 'badge-green'}`}
              >
                {r.experiment.type === 'verilog' ? 'HDL' : 'CMOS'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
