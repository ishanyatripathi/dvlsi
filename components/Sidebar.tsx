'use client';

import React from 'react';
import { ChevronDown, ChevronRight, Cpu, Code2, CircuitBoard } from 'lucide-react';
import { experimentsBySection, Experiment } from '@/lib/experiments';

interface SidebarProps {
  activeId: string | null;
  onSelect: (exp: Experiment) => void;
}

const sectionConfig = {
  A: { label: 'SECTION A — CMOS LAYOUTS', icon: Cpu, color: '#789B83' },
  B: { label: 'SECTION B — VERILOG HDL', icon: Code2, color: '#7A9BB8' },
  C: { label: 'SECTION C — ADVANCED CMOS', icon: CircuitBoard, color: '#B49A69' },
};

export default function Sidebar({ activeId, onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="sidebar-body">
      {(Object.keys(experimentsBySection) as Array<'A' | 'B' | 'C'>).map(sectionKey => {
        const section = experimentsBySection[sectionKey];
        const config = sectionConfig[sectionKey];
        const Icon = config.icon;
        const isCollapsed = collapsed[sectionKey];

        return (
          <div key={sectionKey} className="sidebar-section">
            <div
              className="sidebar-section-header"
              onClick={() => toggleSection(sectionKey)}
            >
              {isCollapsed
                ? <ChevronRight size={11} color="var(--text-muted)" />
                : <ChevronDown size={11} color="var(--text-muted)" />
              }
              <Icon size={11} color={config.color} />
              <span style={{ color: config.color }}>{config.label}</span>
            </div>

            {!isCollapsed && section.map(exp => (
              <div
                key={exp.id}
                className={`sidebar-exp-item ${activeId === exp.id ? 'active' : ''}`}
                onClick={() => onSelect(exp)}
              >
                <span className="sidebar-exp-id">
                  {exp.id.replace('exp-', 'EXP-')}
                </span>
                <span className="sidebar-exp-title" title={exp.title}>
                  {exp.title}
                </span>
                {exp.discrepancyNote && (
                  <span title="Manual discrepancy noted" style={{ color: 'var(--color-warning)', fontSize: 10 }}>⚠</span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
