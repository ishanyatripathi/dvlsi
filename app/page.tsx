'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightOpen,
  PanelRightClose,
  Cpu,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

import { experiments, Experiment } from '@/lib/experiments';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import SearchModal from '@/components/SearchModal';
import SettingsPanel from '@/components/SettingsPanel';
import OverviewTab from '@/components/tabs/OverviewTab';
import TheoryTab from '@/components/tabs/TheoryTab';
import CodeTab from '@/components/tabs/CodeTab';
import TruthTableTab from '@/components/tabs/TruthTableTab';
import VivaTab from '@/components/tabs/VivaTab';
import ManualViewer from '@/components/ManualViewer';

type TabId = 'overview' | 'theory' | 'code' | 'truthtable' | 'viva';

interface TabConfig {
  id: TabId;
  label: string;
  showFor: (exp: Experiment) => boolean;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', showFor: () => true },
  { id: 'theory', label: 'Theory', showFor: () => true },
  { id: 'code', label: 'Code', showFor: exp => exp.type === 'verilog' },
  { id: 'truthtable', label: 'Truth Table', showFor: exp => !!exp.truthTable },
  { id: 'viva', label: 'Viva', showFor: exp => exp.vivaQuestions.length > 0 },
];

const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'dvlsi-workbench-state';

interface AppState {
  selectedExpId: string | null;
  showSidebar: boolean;
  showAI: boolean;
  fontSize: number;
}

function loadState(): AppState {
  if (typeof window === 'undefined') return {
    selectedExpId: null,
    showSidebar: true,
    showAI: true,
    fontSize: 13,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...{ selectedExpId: null, showSidebar: true, showAI: true, fontSize: 13 }, ...JSON.parse(raw) };
  } catch {}
  return { selectedExpId: null, showSidebar: true, showAI: true, fontSize: 13 };
}

function saveState(state: Partial<AppState>) {
  try {
    const existing = loadState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...state }));
  } catch {}
}

export default function WorkbenchPage() {
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState('Overview');
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const state = loadState();
    setShowSidebar(state.showSidebar);
    setShowAI(state.showAI);
    setFontSize(state.fontSize);
    if (state.selectedExpId) {
      const exp = experiments.find(e => e.id === state.selectedExpId);
      if (exp) setSelectedExp(exp);
    }
    setHydrated(true);
  }, []);

  // Check AI config
  useEffect(() => {
    fetch('/api/chat')
      .then(r => r.json())
      .then(d => { setAiConfigured(d.configured); setAiModel(d.model); })
      .catch(() => setAiConfigured(false));
  }, []);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const selectExperiment = useCallback((exp: Experiment) => {
    setSelectedExp(exp);
    setActiveTab('overview');
    setCurrentSection('Overview');
    saveState({ selectedExpId: exp.id });
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    const labels: Record<TabId, string> = {
      overview: 'Overview',
      theory: 'Theory',
      code: 'Code',
      truthtable: 'Truth Table',
      viva: 'Viva',
    };
    setCurrentSection(labels[tab]);
  };

  const toggleSidebar = () => {
    setShowSidebar(v => { saveState({ showSidebar: !v }); return !v; });
  };

  const toggleAI = () => {
    setShowAI(v => { saveState({ showAI: !v }); return !v; });
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    saveState({ fontSize: size });
  };

  const handleResetLayout = () => {
    setShowSidebar(true);
    setShowAI(true);
    setFontSize(13);
    saveState({ showSidebar: true, showAI: true, fontSize: 13 });
  };

  const handleClearChat = () => {
    // Just reload the AI component by toggling
    setAiInitialPrompt(null);
  };

  const handleVivaAskAI = (prompt: string) => {
    if (!showAI) setShowAI(true);
    setAiInitialPrompt(prompt);
  };

  const visibleTabs = selectedExp
    ? TABS.filter(t => t.showFor(selectedExp))
    : [];

  if (!hydrated) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ─── TOP TOOLBAR ─── */}
      <div className="toolbar">
        {/* Left: Brand */}
        <div className="toolbar-brand">
          <button
            className="icon-btn"
            onClick={toggleSidebar}
            title={showSidebar ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {showSidebar
              ? <PanelLeftClose size={14} />
              : <PanelLeftOpen size={14} />
            }
          </button>
          <Cpu size={13} color="var(--accent-blue)" />
          <span className="toolbar-brand-title">DIGITAL VLSI WORKBENCH</span>
          <span className="toolbar-brand-label">LAB REFERENCE</span>
          <button
            className="btn btn-outline"
            onClick={() => setShowManual(true)}
            style={{ fontSize: 10, padding: '2px 8px', marginLeft: 4 }}
            title="Open Lab Manual (PDF pages)"
          >
            <BookOpen size={12} />
            Lab Manual
          </button>
        </div>

        {/* Centre: Search */}
        <div className="toolbar-search">
          <button
            style={{
              width: '100%',
              height: 26,
              background: 'var(--bg-workspace)',
              border: '1px solid var(--border)',
              borderRadius: 3,
              padding: '0 10px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'text',
              textAlign: 'left',
            }}
            onClick={() => setShowSearch(true)}
          >
            <Search size={12} color="var(--text-muted)" />
            <span>Search experiments...</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              padding: '0 4px',
            }}>
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Right: Status + Settings */}
        <div className="toolbar-right">
          {selectedExp && (
            <div className="status-indicator">
              <span style={{ color: 'var(--text-muted)' }}>
                {selectedExp.id.toUpperCase()}
              </span>
            </div>
          )}

          <div className="status-indicator">
            <div className={`status-dot ${aiConfigured ? 'ok' : 'warn'}`} />
            <span>{aiConfigured ? 'AI READY' : 'AI NOT CONFIGURED'}</span>
          </div>

          <button
            className="icon-btn"
            onClick={toggleAI}
            title={showAI ? 'Hide AI panel' : 'Show AI panel'}
          >
            {showAI
              ? <PanelRightClose size={14} />
              : <PanelRightOpen size={14} />
            }
          </button>

          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => setShowSettings(v => !v)}
              title="Settings"
            >
              <Settings size={14} />
            </button>
            {showSettings && (
              <SettingsPanel
                showSidebar={showSidebar}
                showAI={showAI}
                fontSize={fontSize}
                onToggleSidebar={toggleSidebar}
                onToggleAI={toggleAI}
                onFontSizeChange={handleFontSizeChange}
                onResetLayout={handleResetLayout}
                onClearChat={handleClearChat}
                onClose={() => setShowSettings(false)}
                aiConfigured={aiConfigured}
                aiModel={aiModel}
              />
            )}
          </div>
        </div>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="app-layout">
        {/* Sidebar */}
        <div className={`sidebar ${showSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-header">
            <span className="sidebar-header-title">EXPERIMENT EXPLORER</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {experiments.length} EXP
            </span>
          </div>
          <Sidebar
            activeId={selectedExp?.id ?? null}
            onSelect={selectExperiment}
          />
        </div>

        {/* Central Workspace */}
        <div className="workspace">
          {selectedExp ? (
            <>
              {/* Workspace Header */}
              <div className="workspace-header">
                <span className="workspace-exp-id">{selectedExp.id.toUpperCase()}</span>
                <ChevronRight size={12} color="var(--text-muted)" />
                <span className="workspace-exp-title">{selectedExp.title}</span>
                <span
                  className={`badge ${selectedExp.type === 'verilog' ? 'badge-blue' : 'badge-green'}`}
                  style={{ marginLeft: 8 }}
                >
                  {selectedExp.type === 'verilog' ? 'VERILOG' : 'MICROWIND'}
                </span>
                {selectedExp.discrepancyNote && (
                  <span
                    title="Manual discrepancy — see Code tab"
                    className="badge badge-warn"
                    style={{ marginLeft: 4 }}
                  >
                    ⚠ DISCREPANCY
                  </span>
                )}
              </div>

              {/* Tab Bar */}
              <div className="tab-bar">
                {visibleTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && <OverviewTab experiment={selectedExp} />}
                {activeTab === 'theory' && <TheoryTab experiment={selectedExp} />}
                {activeTab === 'code' && <CodeTab experiment={selectedExp} />}
                {activeTab === 'truthtable' && <TruthTableTab experiment={selectedExp} />}
                {activeTab === 'viva' && (
                  <VivaTab
                    experiment={selectedExp}
                    onAskAI={handleVivaAskAI}
                  />
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="empty-state">
              <Cpu size={32} color="var(--border)" />
              <div className="empty-state-title">No Experiment Selected</div>
              <div className="empty-state-subtitle">
                Select an experiment from the Experiment Explorer on the left, 
                or press <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>Ctrl+K</strong> to search.
              </div>
              <div style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                width: '100%',
                maxWidth: 320,
              }}>
                {experiments.slice(0, 4).map(exp => (
                  <button
                    key={exp.id}
                    className="btn btn-outline"
                    style={{ justifyContent: 'flex-start', gap: 10, fontSize: 12 }}
                    onClick={() => selectExperiment(exp)}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-blue)', minWidth: 42 }}>
                      {exp.id.toUpperCase()}
                    </span>
                    {exp.title}
                  </button>
                ))}
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 11, color: 'var(--text-muted)' }}
                  onClick={() => setShowSearch(true)}
                >
                  Search all 12 experiments →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Panel */}
        <div className={`ai-panel ${showAI ? '' : 'collapsed'}`}>
          <AIAssistant
            selectedExperiment={selectedExp}
            initialPrompt={aiInitialPrompt}
            onInitialPromptConsumed={() => setAiInitialPrompt(null)}
          />
        </div>
      </div>

      {/* ─── STATUS BAR ─── */}
      <div className="status-bar">
        <div className="status-bar-left">
          <div className="status-item">
            <span className="label">EXP</span>
            <span className="value">
              {selectedExp ? selectedExp.id.toUpperCase() : '—'}
            </span>
          </div>
          {selectedExp && (
            <div className="status-item">
              <span className="label">SECTION</span>
              <span className="value">{currentSection}</span>
            </div>
          )}
        </div>

        <div className="status-bar-right">
          <div className="status-item">
            <span className={`status-dot ${aiConfigured ? 'ok' : 'warn'}`} />
            <span className="value">
              {aiConfigured ? `GROQ AI READY` : 'AI NOT CONFIGURED'}
            </span>
          </div>
          <div className="status-item">
            <span className="label">INDEX</span>
            <span className="value">{experiments.length} EXPERIMENTS</span>
          </div>
          <div className="status-item">
            <span className="label">v</span>
            <span className="value">{APP_VERSION}</span>
          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onSelect={exp => { selectExperiment(exp); setShowSearch(false); }}
        />
      )}

      {/* Lab Manual Viewer */}
      {showManual && (
        <ManualViewer
          onClose={() => setShowManual(false)}
          initialPage={selectedExp ? selectedExp.manualPages[0] : undefined}
        />
      )}
    </div>
  );
}
