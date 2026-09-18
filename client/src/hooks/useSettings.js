import { useState, useEffect } from 'react';

const DEFAULTS = {
  font: 'Georgia',
  fontSize: 22,
  lineHeight: 1.9,
  letterSpacing: 0.03,
  theme: 'dark',
  bandSize: 3,
  bionic: false,
};

const STORAGE_KEY = 'focusread_settings';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  function update(patch) {
    setSettings(prev => ({ ...prev, ...patch }));
  }

  function reset() {
    setSettings(DEFAULTS);
  }

  return { settings, update, reset };
}
