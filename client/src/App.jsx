import { useState } from 'react';
import { useSettings } from './hooks/useSettings.js';
import { useReader } from './hooks/useReader.js';
import { THEMES } from './utils/themes.js';
import { InputScreen } from './components/InputScreen/InputScreen.jsx';
import { Reader } from './components/Reader/Reader.jsx';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel.jsx';

export default function App() {
  const { settings, update, reset } = useSettings();
  const { sentences, title, loadText, jumpTo, clear } = useReader();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const theme = THEMES[settings.theme] || THEMES.dark;
  const isReading = sentences.length > 0;

  function handleLoad(text, docTitle) {
    loadText(text, docTitle);
    setSettingsOpen(false);
  }

  function handleClose() {
    clear();
    setSettingsOpen(false);
  }

  return (
    <div style={{ fontFamily: settings.font }}>
      {!isReading ? (
        <InputScreen onLoad={handleLoad} theme={theme} />
      ) : (
        <Reader
          sentences={sentences}
          title={title}
          settings={settings}
          theme={theme}
          jumpTo={jumpTo}
          onClose={handleClose}
          onOpenSettings={() => setSettingsOpen(true)}
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
