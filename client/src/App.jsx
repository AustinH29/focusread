import { useState, useRef } from 'react';
import { useSettings } from './hooks/useSettings.js';
import { useReader } from './hooks/useReader.js';
import { THEMES } from './utils/themes.js';
import { InputScreen } from './components/InputScreen/InputScreen.jsx';
import { Reader } from './components/Reader/Reader.jsx';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel.jsx';

const SESSION_KEY = 'focusread_session';

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function saveSession(data) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

export default function App() {
  const { settings, update, reset } = useSettings();
  const { sentences, title, loadText, jumpTo, clear } = useReader();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedSession, setSavedSession] = useState(() => loadSession());
  const [initialDocY, setInitialDocY] = useState(null);
  const currentTextRef = useRef('');

  const theme = THEMES[settings.theme] || THEMES.dark;
  const isReading = sentences.length > 0;

  function handleLoad(text, docTitle, startDocY = null) {
    currentTextRef.current = text;
    setInitialDocY(startDocY);
    loadText(text, docTitle);
    setSettingsOpen(false);
    clearSession();
    setSavedSession(null);
  }

  function handleClose() {
    clear();
    setInitialDocY(null);
    setSettingsOpen(false);
  }

  function handlePositionChange(docY) {
    const text = currentTextRef.current;
    if (!text) return;
    const session = { text, title, readingDocY: docY };
    saveSession(session);
  }

  function handleResume() {
    if (!savedSession) return;
    handleLoad(savedSession.text, savedSession.title, savedSession.readingDocY);
  }

  function handleDismissResume() {
    clearSession();
    setSavedSession(null);
  }

  return (
    <div style={{ fontFamily: settings.font }}>
      {!isReading ? (
        <InputScreen
          onLoad={handleLoad}
          theme={theme}
          savedSession={savedSession}
          onResume={handleResume}
          onDismissResume={handleDismissResume}
        />
      ) : (
        <Reader
          sentences={sentences}
          title={title}
          settings={settings}
          theme={theme}
          jumpTo={jumpTo}
          onClose={handleClose}
          onOpenSettings={() => setSettingsOpen(true)}
          onUpdateSettings={update}
          onPositionChange={handlePositionChange}
          initialDocY={initialDocY}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          update={update}
          reset={reset}
          theme={theme}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
