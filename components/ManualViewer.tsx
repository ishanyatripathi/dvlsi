'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';

const PAGES = Array.from({ length: 24 }, (_, i) => ({
  page: i + 5,
  src: `/manual/page_${String(i + 5).padStart(3, '0')}.png`,
}));

interface ManualViewerProps {
  onClose: () => void;
  initialPage?: number; // 5-28
}

export default function ManualViewer({ onClose, initialPage }: ManualViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(initialPage ?? 5);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Scroll to initial page
  useEffect(() => {
    if (initialPage && pageRefs.current[initialPage]) {
      pageRefs.current[initialPage]?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [initialPage]);

  // Track which page is in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page') || '5');
            setCurrentPage(pageNum);
            break;
          }
        }
      },
      { root: container, threshold: 0.3 }
    );

    for (const p of PAGES) {
      const el = pageRefs.current[p.page];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToPage = useCallback((page: number) => {
    const el = pageRefs.current[page];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(page);
    }
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(200, z + 25));
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 25));
  const handleFitWidth = () => setZoom(100);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') { e.preventDefault(); handleZoomIn(); }
      if (e.key === '-') { e.preventDefault(); handleZoomOut(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Toolbar */}
      <div style={{
        height: 38,
        background: 'var(--bg-toolbar)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
          }}>
            LAB MANUAL
          </span>
          <span style={{
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            background: 'rgba(66,106,145,0.15)',
            border: '1px solid rgba(66,106,145,0.3)',
            padding: '1px 5px',
            borderRadius: 2,
          }}>
            ETPCL502
          </span>
        </div>

        {/* Page nav */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}>
          <button
            className="icon-btn"
            onClick={() => scrollToPage(Math.max(5, currentPage - 1))}
            disabled={currentPage <= 5}
            title="Previous page"
          >
            <ChevronUp size={14} />
          </button>

          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            minWidth: 80,
            textAlign: 'center',
          }}>
            Page {currentPage} / 28
          </span>

          <button
            className="icon-btn"
            onClick={() => scrollToPage(Math.min(28, currentPage + 1))}
            disabled={currentPage >= 28}
            title="Next page"
          >
            <ChevronDown size={14} />
          </button>

          <div style={{
            width: 1,
            height: 16,
            background: 'var(--border)',
            margin: '0 4px',
          }} />

          <button className="icon-btn" onClick={handleZoomOut} title="Zoom out">
            <ZoomOut size={14} />
          </button>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            minWidth: 36,
            textAlign: 'center',
          }}>
            {zoom}%
          </span>
          <button className="icon-btn" onClick={handleZoomIn} title="Zoom in">
            <ZoomIn size={14} />
          </button>
          <button className="icon-btn" onClick={handleFitWidth} title="Fit to width">
            {zoom === 100 ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* Close */}
        <div style={{ minWidth: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{ fontSize: 10, gap: 4 }}
          >
            <X size={12} />
            Close Manual
          </button>
        </div>
      </div>

      {/* Page thumbnails sidebar + content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Thumbnail sidebar */}
        <div style={{
          width: 90,
          minWidth: 90,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          padding: '6px 0',
        }}>
          {PAGES.map(p => (
            <button
              key={p.page}
              onClick={() => scrollToPage(p.page)}
              style={{
                display: 'block',
                width: '100%',
                padding: '4px 8px',
                background: currentPage === p.page ? 'var(--tab-active)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                borderLeft: currentPage === p.page ? '2px solid var(--accent-blue)' : '2px solid transparent',
                transition: 'background 0.1s',
              }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '0.707',
                background: 'var(--bg-panel)',
                border: `1px solid ${currentPage === p.page ? 'var(--accent-blue)' : 'var(--border)'}`,
                borderRadius: 2,
                overflow: 'hidden',
                marginBottom: 3,
                position: 'relative',
              }}>
                <Image
                  src={p.src}
                  alt={`Page ${p.page}`}
                  fill
                  sizes="70px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <span style={{
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: currentPage === p.page ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {p.page}
              </span>
            </button>
          ))}
        </div>

        {/* Main scrolling area */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#141518',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            gap: 16,
          }}
        >
          {PAGES.map(p => (
            <div
              key={p.page}
              data-page={p.page}
              ref={el => { pageRefs.current[p.page] = el; }}
              style={{
                width: `${zoom}%`,
                maxWidth: 900,
                minWidth: 300,
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              {/* Page number label */}
              <div style={{
                position: 'absolute',
                top: -18,
                left: 0,
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                Page {p.page}
              </div>
              <Image
                src={p.src}
                alt={`Lab Manual — Page ${p.page}`}
                width={900}
                height={1272}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                unoptimized
                priority={p.page <= 7}
              />
            </div>
          ))}

          {/* End marker */}
          <div style={{
            padding: '20px 0 40px',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>
            END OF MANUAL — 24 PAGES
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        height: 24,
        background: 'var(--bg-toolbar)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          ETPCL502 · Digital VLSI Lab Manual · Pages 5–28
        </span>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Zoom: {zoom}% · Page {currentPage} of 28
        </span>
      </div>
    </div>
  );
}
