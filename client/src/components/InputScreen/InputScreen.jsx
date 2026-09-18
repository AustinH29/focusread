import { useState, useRef } from 'react';
import styles from './InputScreen.module.css';

export function InputScreen({ onLoad, theme }) {
  const [tab, setTab] = useState('paste');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingMinutes = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef();

  function handlePasteSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onLoad(text.trim(), '');
  }

  async function handleUrlSubmit(e) {
    e.preventDefault();
    setError('');
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch URL');
      } else {
        onLoad(data.content, data.title);
      }
    } catch {
      setError('Could not reach the FocusRead server. Is it running?');
    } finally {
      setLoading(false);
    }
  }

  async function processFile(file) {
    if (!file) return;
    setFileError('');
    const ext = file.name.split('.').pop().toLowerCase();
    const title = file.name.replace(/\.[^.]+$/, '');

    if (ext === 'txt' || ext === 'md' || ext === 'text') {
      const reader = new FileReader();
      reader.onload = evt => onLoad(evt.target.result, title);
      reader.onerror = () => setFileError('Could not read the file.');
      reader.readAsText(file, 'utf-8');
      return;
    }

    if (ext === 'docx' || ext === 'pdf') {
      setFileLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/parse-file', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) {
          setFileError(data.error || 'Failed to parse file.');
        } else {
          onLoad(data.content, data.title);
        }
      } catch {
        setFileError('Could not reach the FocusRead server. Is it running?');
      } finally {
        setFileLoading(false);
      }
      return;
    }

    setFileError('Unsupported file type. Please use .txt, .pdf, or .docx.');
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    processFile(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }

  return (
    <div
      className={styles.root}
      style={{ background: theme.bg, color: theme.text }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className={styles.hero}>
        <div className={styles.logoMark} style={{ background: theme.accent }} />
        <h1 className={styles.title} style={{ color: theme.text }}>FocusRead</h1>
        <p className={styles.tagline} style={{ color: theme.dim }}>
          A distraction-free reading environment built for ADHD brains.
        </p>
      </div>

      <div className={styles.card} style={{ background: theme.panel, borderColor: theme.border }}>
        <div className={styles.tabs} style={{ borderBottomColor: theme.border }}>
          {['paste', 'url'].map(t => (
            <button
              key={t}
              className={styles.tab}
              data-active={tab === t}
              style={{
                '--accent': theme.accent,
                color: tab === t ? theme.accent : theme.dim,
                borderBottomColor: tab === t ? theme.accent : 'transparent',
              }}
              onClick={() => { setTab(t); setError(''); }}
            >
              {t === 'paste' ? 'Paste Text' : 'From URL'}
            </button>
          ))}
        </div>

        {tab === 'paste' && (
          <form onSubmit={handlePasteSubmit} className={styles.form}>
            <textarea
              className={styles.textarea}
              style={{ background: theme.bg, color: theme.text, borderColor: theme.border, '--accent': theme.accent }}
              placeholder="Paste any text here — an article, email, documentation…"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
            />
            {wordCount > 0 && (
              <p className={styles.stats} style={{ color: theme.dim }}>
                {wordCount.toLocaleString()} words · ~{readingMinutes} min read
              </p>
            )}
            <button
              type="submit"
              className={styles.btn}
              style={{ background: theme.accent }}
              disabled={!text.trim()}
            >
              Start Reading →
            </button>
          </form>
        )}

        {tab === 'url' && (
          <form onSubmit={handleUrlSubmit} className={styles.form}>
            <input
              type="url"
              className={styles.input}
              style={{ background: theme.bg, color: theme.text, borderColor: theme.border, '--accent': theme.accent }}
              placeholder="https://example.com/article"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <p className={styles.errorHint}>Try pasting the text instead.</p>
              </div>
            )}
            <button
              type="submit"
              className={styles.btn}
              style={{ background: theme.accent }}
              disabled={loading || !url.trim()}
            >
              {loading ? 'Fetching…' : 'Fetch & Read →'}
            </button>
          </form>
        )}

        <div className={styles.fileRow}>
          <button
            className={styles.fileBtn}
            style={{ color: theme.dim, borderColor: theme.border }}
            onClick={() => fileRef.current.click()}
            disabled={fileLoading}
          >
            {fileLoading ? 'Parsing file…' : 'Open file (.txt, .pdf, .docx)'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.text,.pdf,.docx"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          {fileError && (
            <p className={styles.fileError}>{fileError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
