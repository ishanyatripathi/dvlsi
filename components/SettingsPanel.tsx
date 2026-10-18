'use client';

import React from 'react';
import { X, Settings } from 'lucide-react';

interface SettingsPanelProps {
  showSidebar: boolean;
  showAI: boolean;
  fontSize: number;
  onToggleSidebar: () => void;
  onToggleAI: () => void;
  onFontSizeChange: (size: number) => void;
  onResetLayout: () => void;
  onClearChat: () => void;
  onClose: () => void;
  aiConfigured: boolean;
  aiModel: string | null;
}

export default function SettingsPanel({
  showSidebar,
  showAI,
  fontSize,
  onToggleSidebar,
  onToggleAI,
  onFontSizeChange,
  onResetLayout,
  onClearChat,
  onClose,
  aiConfigured,
  aiModel,
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Settings size={11} />
          SETTINGS
        </div>
        <button className="icon-btn" onClick={onClose}>
          <X size={12} />
        </button>
      </div>

      <div className="settings-body">
        {/* Panel toggles */}
        <div style={{
          padding: '5px 14px',
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}>
          PANELS
        </div>

        <div className="settings-item">
          <span className="settings-item-label">Experiment Explorer</span>
          <button
            className={`toggle ${showSidebar ? 'on' : ''}`}
            onClick={onToggleSidebar}
          />
        </div>

        <div className="settings-item">
          <span className="settings-item-label">AI Assistant Panel</span>
          <button
            className={`toggle ${showAI ? 'on' : ''}`}
            onClick={onToggleAI}
          />
        </div>

        {/* Font size */}
        <div style={{
          padding: '5px 14px',
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          borderTop: '1px solid var(--border-light)',
          marginTop: 4,
          paddingTop: 9,
        }}>
          DISPLAY
        </div>

        <div className="settings-item">
          <span className="settings-item-label">Font Size</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              className="btn btn-outline"
              style={{ fontSize: 11, padding: '2px 7px', minWidth: 26 }}
              onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
            >A−</button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', minWidth: 20, textAlign: 'center' }}>
              {fontSize}
            </span>
            <button
              className="btn btn-outline"
              style={{ fontSize: 11, padding: '2px 7px', minWidth: 26 }}
              onClick={() => onFontSizeChange(Math.min(16, fontSize + 1))}
            >A+</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '5px 14px',
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          borderTop: '1px solid var(--border-light)',
          marginTop: 4,
          paddingTop: 9,
        }}>
          ACTIONS
        </div>

        <div style={{ padding: '4px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={onResetLayout}>
            Reset Layout
          </button>
          <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={onClearChat}>
            Clear Chat History
          </button>
        </div>

        {/* API Status */}
        <div style={{
          padding: '9px 14px 4px',
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          borderTop: '1px solid var(--border-light)',
          marginTop: 4,
        }}>
          API CONFIGURATION
        </div>

        <div style={{ padding: '4px 14px 10px' }}>
          <div style={{ fontSize: 11, color: aiConfigured ? 'var(--color-success)' : 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
            {aiConfigured ? '● GROQ API CONNECTED' : '○ AI NOT CONFIGURED'}
          </div>
          {aiConfigured && aiModel && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
              Model: {aiModel}
            </div>
          )}
          {!aiConfigured && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
              Set GROQ_API_KEY in your .env.local file. See README for instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
