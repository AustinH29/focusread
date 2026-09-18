import styles from './SettingsPanel.module.css';
import { THEMES, FONTS } from '../../utils/themes.js';

export function SettingsPanel({ settings, update, reset, theme, onClose }) {
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={styles.panel}
        style={{ background: theme.panel, borderLeftColor: theme.border, color: theme.text }}
      >
        <div className={styles.header}>
          <span className={styles.headerTitle}>Settings</span>
          <button className={styles.closeBtn} style={{ color: theme.dim }} onClick={onClose}>✕</button>
        </div>

        {/* Theme */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>COLOR THEME</label>
          <div className={styles.themeGrid}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                className={styles.themeChip}
                data-active={settings.theme === key}
                style={{
                  background: t.bg,
                  color: t.text,
                  borderColor: settings.theme === key ? t.accent : t.border,
                }}
                onClick={() => update({ theme: key })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Font */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>FONT</label>
          <div className={styles.fontList}>
            {FONTS.map(f => (
              <button
                key={f.value}
                className={styles.fontBtn}
                data-active={settings.font === f.value}
                style={{
                  fontFamily: f.value,
                  borderColor: settings.font === f.value ? theme.accent : theme.border,
                  color: theme.text,
                }}
                onClick={() => update({ font: f.value })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Font size */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>
            FONT SIZE — {settings.fontSize}px
          </label>
          <input
            type="range" min={14} max={40} step={1}
            value={settings.fontSize}
            onChange={e => update({ fontSize: Number(e.target.value) })}
            className={styles.slider}
            style={{ '--accent': theme.accent }}
          />
        </section>

        {/* Line height */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>
            LINE HEIGHT — {settings.lineHeight.toFixed(1)}
          </label>
          <input
            type="range" min={1.2} max={3.0} step={0.1}
            value={settings.lineHeight}
            onChange={e => update({ lineHeight: Number(e.target.value) })}
            className={styles.slider}
            style={{ '--accent': theme.accent }}
          />
        </section>

        {/* Letter spacing */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>
            LETTER SPACING — {(settings.letterSpacing * 1000).toFixed(0)}
          </label>
          <input
            type="range" min={0} max={0.15} step={0.005}
            value={settings.letterSpacing}
            onChange={e => update({ letterSpacing: Number(e.target.value) })}
            className={styles.slider}
            style={{ '--accent': theme.accent }}
          />
        </section>

        {/* Band size */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} style={{ color: theme.dim }}>FOCUS BAND SIZE</label>
          <div className={styles.bandRow}>
            {[1, 2, 3, 5].map(n => (
              <button
                key={n}
                className={styles.bandBtn}
                data-active={settings.bandSize === n}
                style={{
                  borderColor: settings.bandSize === n ? theme.accent : theme.border,
                  color: settings.bandSize === n ? theme.accent : theme.dim,
                }}
                onClick={() => update({ bandSize: n })}
              >
                {n === 1 ? '1 line' : `${n} lines`}
              </button>
            ))}
          </div>
        </section>

        {/* Bionic reading */}
        <section className={styles.section}>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel} style={{ color: theme.text }}>Bionic Reading</div>
              <div className={styles.toggleSub} style={{ color: theme.dim }}>Bold the first half of each word</div>
            </div>
            <button
              className={styles.toggle}
              data-on={settings.bionic}
              style={{ '--accent': theme.accent }}
              onClick={() => update({ bionic: !settings.bionic })}
              aria-pressed={settings.bionic}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
        </section>

        {/* Reset */}
        <section className={styles.section}>
          <button
            className={styles.resetBtn}
            style={{ color: theme.dim, borderColor: theme.border }}
            onClick={reset}
          >
            Reset to Defaults
          </button>
        </section>
      </div>
    </>
  );
}
