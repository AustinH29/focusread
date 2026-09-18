export const THEMES = {
  dark:         { label: 'Dark',         bg: '#1a1a1a', text: '#e8e6e3', dim: '#888',    band: 'rgba(255,255,255,0.18)', bandEdge: 'rgba(255,255,255,0.55)', curtain: 'rgba(26,26,26,0.82)',    panel: '#242424', border: '#333',    accent: '#4a9eff' },
  light:        { label: 'Light',        bg: '#f5f1eb', text: '#2c2c2c', dim: '#aaa',    band: 'rgba(0,0,0,0.12)',       bandEdge: 'rgba(0,0,0,0.40)',       curtain: 'rgba(245,241,235,0.82)', panel: '#ede9e3', border: '#ccc',    accent: '#0066cc' },
  sepia:        { label: 'Sepia',        bg: '#fbf0d9', text: '#4a3728', dim: '#b8a090', band: 'rgba(74,55,40,0.16)',    bandEdge: 'rgba(74,55,40,0.50)',    curtain: 'rgba(251,240,217,0.82)', panel: '#f2e8d0', border: '#d4b896', accent: '#8b5e3c' },
  midnight:     { label: 'Midnight',     bg: '#0d1117', text: '#c9d1d9', dim: '#666',    band: 'rgba(255,255,255,0.16)', bandEdge: 'rgba(255,255,255,0.50)', curtain: 'rgba(13,17,23,0.82)',    panel: '#161b22', border: '#30363d', accent: '#58a6ff' },
  forest:       { label: 'Forest',       bg: '#1a2318', text: '#d4e8c2', dim: '#6a8a5a', band: 'rgba(212,232,194,0.20)', bandEdge: 'rgba(212,232,194,0.60)', curtain: 'rgba(26,35,24,0.82)',    panel: '#1f2a1d', border: '#2d3d2a', accent: '#7ec850' },
  ocean:        { label: 'Ocean',        bg: '#0a1628', text: '#8ec8e8', dim: '#4a7090', band: 'rgba(142,200,232,0.18)', bandEdge: 'rgba(142,200,232,0.55)', curtain: 'rgba(10,22,40,0.82)',    panel: '#0f1e35', border: '#1a3050', accent: '#38b8f0' },
  dusk:         { label: 'Dusk',         bg: '#16101f', text: '#d0c8e8', dim: '#6a5a80', band: 'rgba(208,200,232,0.18)', bandEdge: 'rgba(208,200,232,0.55)', curtain: 'rgba(22,16,31,0.82)',    panel: '#1d1528', border: '#2d2040', accent: '#a07adf' },
  rose:         { label: 'Rose',         bg: '#1f1218', text: '#f0c8d8', dim: '#805060', band: 'rgba(240,200,216,0.18)', bandEdge: 'rgba(240,200,216,0.55)', curtain: 'rgba(31,18,24,0.82)',    panel: '#281820', border: '#3d2030', accent: '#e0609a' },
  slate:        { label: 'Slate',        bg: '#1a2030', text: '#c8d4e8', dim: '#607090', band: 'rgba(200,212,232,0.18)', bandEdge: 'rgba(200,212,232,0.55)', curtain: 'rgba(26,32,48,0.82)',    panel: '#202838', border: '#303d55', accent: '#5090d8' },
  sand:         { label: 'Sand',         bg: '#faf6ef', text: '#3a2f20', dim: '#b0a090', band: 'rgba(58,47,32,0.10)',    bandEdge: 'rgba(58,47,32,0.38)',    curtain: 'rgba(250,246,239,0.85)', panel: '#f0ebe0', border: '#d8d0c0', accent: '#c07840' },
  highContrast: { label: 'High Contrast',bg: '#000000', text: '#ffffff', dim: '#999',    band: 'rgba(255,255,255,0.22)', bandEdge: 'rgba(255,255,255,0.70)', curtain: 'rgba(0,0,0,0.88)',       panel: '#111111', border: '#444',    accent: '#ffe000' },
};

export const FONTS = [
  { label: 'System (Default)',         value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { label: 'Georgia (Serif)',          value: 'Georgia, "Times New Roman", serif' },
  { label: 'Palatino (Elegant)',       value: 'Palatino, "Palatino Linotype", serif' },
  { label: 'Times New Roman (Classic)',value: '"Times New Roman", Times, serif' },
  { label: 'Verdana (Wide & Clear)',   value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet (Humanist)',     value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Arial (Clean Sans)',       value: 'Arial, Helvetica, sans-serif' },
  { label: 'Courier (Mono)',           value: '"Courier New", Courier, monospace' },
  { label: 'Atkinson Hyperlegible',    value: '"Atkinson Hyperlegible", sans-serif' },
  { label: 'OpenDyslexic',             value: 'OpenDyslexic, sans-serif' },
];
