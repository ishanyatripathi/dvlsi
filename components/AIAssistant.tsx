'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Trash2, Plus, Copy, Check } from 'lucide-react';
import { Experiment } from '@/lib/experiments';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  selectedExperiment: Experiment | null;
  initialPrompt?: string | null;
  onInitialPromptConsumed?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Explain this experiment.',
  'Show the original Verilog code.',
  'Explain the truth table.',
  'Generate viva questions.',
  'Debug this code.',
  'Explain the circuit in simple terms.',
];

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeText = typeof children === 'string' ? children : String(children);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', margin: '6px 0' }}>
      <pre style={{
        background: '#161820',
        border: '1px solid var(--border)',
        borderRadius: 3,
        padding: '10px 12px',
        overflow: 'auto',
        fontSize: 11,
        lineHeight: 1.6,
      }}>
        <code style={{ fontFamily: 'var(--font-mono)', color: '#CDD6F4' }}>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          background: 'var(--bg-panel-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          padding: '2px 6px',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {copied ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function AIAssistant({
  selectedExperiment,
  initialPrompt,
  onInitialPromptConsumed,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check AI configuration on mount
  useEffect(() => {
    fetch('/api/chat')
      .then(r => r.json())
      .then(d => setAiConfigured(d.configured))
      .catch(() => setAiConfigured(false));
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
      onInitialPromptConsumed?.();
    }
  }, [initialPrompt]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          experimentId: selectedExperiment?.id ?? null,
          experimentTitle: selectedExperiment?.title ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Request failed.');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <div>
            <div className="ai-panel-name">ENGINEERING ASSISTANT</div>
            <div className="ai-panel-subtitle">GROQ INFERENCE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn" onClick={clearChat} title="Clear chat">
            <Trash2 size={13} />
          </button>
          <button className="icon-btn" onClick={clearChat} title="New chat">
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* AI Status */}
      {aiConfigured === false && (
        <div style={{
          padding: '6px 10px',
          background: 'rgba(180, 154, 105, 0.08)',
          borderBottom: '1px solid rgba(180, 154, 105, 0.2)',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-warning)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span>⚠</span> AI NOT CONFIGURED — Set GROQ_API_KEY
        </div>
      )}

      {/* Context indicator */}
      {selectedExperiment && (
        <div style={{
          padding: '5px 10px',
          background: 'rgba(66, 106, 145, 0.06)',
          borderBottom: '1px solid var(--border)',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span style={{ color: 'var(--accent-blue)' }}>CTX</span>
          {selectedExperiment.id.toUpperCase()} — {selectedExperiment.title}
        </div>
      )}

      {/* Messages */}
      <div className="ai-messages">
        {isEmpty && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, padding: '0 2px' }}>
              {selectedExperiment
                ? `Ask about ${selectedExperiment.title}`
                : 'Select an experiment or ask a general question.'
              }
            </div>
            <div className="suggested-prompts" style={{ padding: 0 }}>
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p}
                  className="suggested-prompt-btn"
                  onClick={() => sendMessage(p)}
                  disabled={aiConfigured === false}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`ai-message ${m.role}`}>
            <div className="ai-message-header">
              <span>{m.role === 'user' ? '▶ YOU' : '◆ ASSISTANT'}</span>
            </div>
            <div className="ai-message-content">
              {m.role === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const isBlock = className?.startsWith('language-');
                      if (isBlock) {
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                      }
                      return <code {...props} className={className}>{children}</code>;
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-message assistant">
            <div className="ai-message-header">
              <span>◆ ASSISTANT</span>
            </div>
            <div className="ai-message-content">
              <div className="loading-dots">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-input-area">
        <textarea
          ref={textareaRef}
          className="ai-input-textarea"
          placeholder={
            aiConfigured === false
              ? 'Set GROQ_API_KEY to enable...'
              : 'Ask a question... (Enter to send, Shift+Enter for new line)'
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || aiConfigured === false}
          rows={2}
        />
        <div className="ai-input-actions">
          <span className="ai-hint">↵ send · ⇧↵ newline</span>
          <button
            className="btn btn-primary"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim() || aiConfigured === false}
            style={{ fontSize: 11 }}
          >
            <Send size={11} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
