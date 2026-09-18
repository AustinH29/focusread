import { useEffect, useRef, useState, useCallback } from 'react';
import { applyBionic } from '../../utils/bionic.js';
import styles from './Reader.module.css';

const TARGET_SCREEN_RATIO = 0.35;

const HELP_SECTIONS = [
  {
    heading: 'Navigation',
    items: [
      ['Space or ↓', 'Advance the focus band down'],
      ['↑', 'Move the focus band up'],
      ['Click any word', 'Jump the band to that line'],
      ['Esc', 'Return to the home screen'],
    ],
  },
  {
    heading: 'Focus Band Size',
    items: [
      ['1 line', 'Tightest focus — one line at a time'],
      ['2 lines', 'Good for dense text'],
      ['3 lines', 'Balanced default'],
      ['5 lines', 'Wider view for faster readers'],
    ],
  },
  {
    heading: 'Typography Settings',
    items: [
      ['Font', 'Choose a reading typeface that feels comfortable'],
      ['Font Size', 'Larger text reduces eye strain'],
      ['Line Height', 'More spacing between lines helps tracking'],
      ['Letter Spacing', 'Spread characters apart to slow visual crowding'],
    ],
  },
  {
    heading: 'Bionic Reading',
    items: [
      ['On', 'Bolds the first half of each word — your brain fills in the rest, reducing cognitive load'],
      ['Off', 'Standard reading without bold anchors'],
    ],
  },
  {
    heading: 'Color Theme',
    items: [
      ['Dark / Midnight', 'Low-brightness for low-light environments'],
      ['Light / Sand', 'High contrast for bright rooms'],
      ['Sepia', 'Warm paper tone — easy on the eyes'],
      ['Forest / Ocean / Dusk / Rose / Slate', 'Colored tones that some readers find less stimulating'],
      ['High Contrast', 'Maximum black/white contrast'],
    ],
  },
];

export function Reader({ sentences, title, settings, theme, jumpTo, onClose, onOpenSettings }) {
  const sentenceRefs = useRef([]);
  const contentTopRef = useRef(null);
  const contentBottomRef = useRef(null);

  const [readingDocY, setReadingDocY] = useState(0);
  const [contentDocTop, setContentDocTop] = useState(0);
  const [contentDocBottom, setContentDocBottom] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const totalWords = sentences.join(' ').split(/\s+/).filter(Boolean).length;
  const lineHeightPx = settings.fontSize * settings.lineHeight;
  const bandHeight = Math.round(settings.bandSize * lineHeightPx);
  const bandTop = Math.round(readingDocY - scrollY);

  const readProgress = contentDocBottom <= contentDocTop ? 0 :
    Math.max(0, Math.min(100,
      ((readingDocY - contentDocTop) / (contentDocBottom - contentDocTop)) * 100
    ));

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!contentTopRef.current || !contentBottomRef.current || !sentences.length) return;
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      const topRect = contentTopRef.current.getBoundingClientRect();
      const bottomRect = contentBottomRef.current.getBoundingClientRect();
      setContentDocTop(topRect.top);
      setContentDocBottom(bottomRect.top);
      setReadingDocY(topRect.top);
      setScrollY(0);
    }, 80);
    return () => clearTimeout(t);
  }, [sentences]);

  const scrollToDocY = useCallback((docY) => {
    const target = Math.max(0, docY - window.innerHeight * TARGET_SCREEN_RATIO);
    window.scrollTo(0, target);
    setScrollY(target);
  }, []);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') {
      if (showHelp) { setShowHelp(false); return; }
      onClose();
      return;
    }
    if (showHelp) return;
    if (e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = readingDocY + settings.bandSize * lineHeightPx;
      setReadingDocY(next);
      scrollToDocY(next);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.max(contentDocTop, readingDocY - settings.bandSize * lineHeightPx);
      setReadingDocY(next);
      scrollToDocY(next);
    }
  }, [readingDocY, contentDocTop, settings.bandSize, lineHeightPx, onClose, scrollToDocY, showHelp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= lineHeightPx;
    if (e.deltaMode === 2) delta *= window.innerHeight;
    const next = Math.max(contentDocTop, readingDocY + delta);
    setReadingDocY(next);
    scrollToDocY(next);
  }, [readingDocY, contentDocTop, lineHeightPx, scrollToDocY]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleClickJump = useCallback((i) => {
    const el = sentenceRefs.current[i];
    if (!el) return;
    const rects = el.getClientRects();
    if (!rects.length) return;
    const docY = rects[0].top + window.scrollY;
    setReadingDocY(docY);
    scrollToDocY(docY);
    jumpTo(i);
  }, [scrollToDocY, jumpTo]);

  function renderSentence(sentence) {
    if (settings.bionic) {
      return <span dangerouslySetInnerHTML={{ __html: applyBionic(sentence) }} />;
    }
    return sentence;
  }

  const curtainBase = {
    position: 'fixed', left: 0, right: 0,
    background: theme.curtain, zIndex: 3, pointerEvents: 'none',
  };

  return (
    <div className={styles.root} style={{ background: theme.bg, color: theme.text, fontFamily: settings.font }}>
      <div
        className={styles.band}
        style={{
          top: bandTop,
          height: bandHeight,
          background: theme.band,
          borderTop: `3px solid ${theme.bandEdge}`,
          borderBottom: `3px solid ${theme.bandEdge}`,
          boxShadow: `0 -6px 20px 4px ${theme.bandEdge}, 0 6px 20px 4px ${theme.bandEdge}`,
        }}
      />

      <div style={{ ...curtainBase, top: 0, height: Math.max(0, bandTop) }} />
      <div style={{ ...curtainBase, top: bandTop + bandHeight, bottom: 0 }} />

      <div className={styles.topBar} style={{ background: theme.bg, borderBottomColor: theme.border }}>
        <button className={styles.backBtn} style={{ color: theme.dim }} onClick={onClose}>← Back</button>
        <span className={styles.readingStats} style={{ color: theme.dim }}>
          {title ? `${title} · ` : ''}{Math.round(readProgress)}% · ~{Math.max(1, Math.ceil(totalWords * (1 - readProgress / 100) / 200))} min left
        </span>
        <div className={styles.topBarRight}>
          <button
            className={styles.helpBtn}
            style={{ color: theme.dim, borderColor: theme.border }}
            onClick={() => setShowHelp(true)}
            title="Help"
          >
            ?
          </button>
          <button
            className={styles.settingsBtn}
            style={{ background: theme.accent, color: '#fff' }}
            onClick={onOpenSettings}
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 7, background: theme.border, zIndex: 15, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0,
          height: `${readProgress}%`,
          background: theme.accent,
          boxShadow: `0 0 10px ${theme.accent}`,
          transition: 'height 0.4s ease',
        }} />
      </div>

      <div
        className={styles.column}
        style={{
          fontSize: settings.fontSize + 'px',
          lineHeight: settings.lineHeight,
          letterSpacing: settings.letterSpacing + 'em',
        }}
      >
        <div ref={contentTopRef} style={{ height: 0, margin: 0, padding: 0 }} />

        {sentences.map((sentence, i) => (
          <span
            key={i}
            ref={el => { sentenceRefs.current[i] = el; }}
            className={styles.sentence}
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickJump(i)}
          >
            {renderSentence(sentence)}{' '}
          </span>
        ))}
        <div ref={contentBottomRef} style={{ height: 0, margin: 0, padding: 0 }} />
      </div>

      <div className={styles.hint} style={{ color: theme.dim, background: theme.bg }}>
        Space / ↓ advance · ↑ back · click any word · Esc to exit
      </div>

      {showHelp && (
        <div className={styles.helpBackdrop} onClick={() => setShowHelp(false)}>
          <div
            className={styles.helpModal}
            style={{ background: theme.panel, color: theme.text, borderColor: theme.border }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.helpHeader}>
              <span className={styles.helpTitle}>How to Use FocusRead</span>
              <button
                className={styles.helpClose}
                style={{ color: theme.dim }}
                onClick={() => setShowHelp(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.helpBody}>
              {HELP_SECTIONS.map(sec => (
                <div key={sec.heading} className={styles.helpSection}>
                  <h3 className={styles.helpSectionTitle} style={{ color: theme.accent }}>{sec.heading}</h3>
                  <dl className={styles.helpList}>
                    {sec.items.map(([key, val]) => (
                      <>
                        <dt key={key + '-dt'} className={styles.helpKey} style={{ color: theme.text }}>{key}</dt>
                        <dd key={key + '-dd'} className={styles.helpVal} style={{ color: theme.dim }}>{val}</dd>
                      </>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
