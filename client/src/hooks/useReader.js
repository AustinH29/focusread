import { useState, useCallback } from 'react';

// Split text into sentences. Handles common abbreviations loosely.
function splitSentences(text) {
  if (!text) return [];
  // Normalize whitespace
  const normalized = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  // Split on sentence-ending punctuation followed by whitespace/newline
  const raw = normalized.split(/(?<=[.!?])\s+(?=[A-Z"'(])/);
  return raw
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

export function useReader() {
  const [sentences, setSentences] = useState([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [title, setTitle] = useState('');

  const loadText = useCallback((text, docTitle = '') => {
    const s = splitSentences(text);
    setSentences(s);
    setFocusIndex(0);
    setTitle(docTitle);
  }, []);

  const advance = useCallback((bandSize = 1) => {
    setFocusIndex(i => Math.min(i + bandSize, sentences.length - 1));
  }, [sentences.length]);

  const retreat = useCallback((bandSize = 1) => {
    setFocusIndex(i => Math.max(i - bandSize, 0));
  }, []);

  const jumpTo = useCallback((index) => {
    setFocusIndex(Math.max(0, Math.min(index, sentences.length - 1)));
  }, [sentences.length]);

  const clear = useCallback(() => {
    setSentences([]);
    setFocusIndex(0);
    setTitle('');
  }, []);

  const progress = sentences.length > 1
    ? Math.round((focusIndex / (sentences.length - 1)) * 100)
    : 0;

  return { sentences, focusIndex, title, progress, loadText, advance, retreat, jumpTo, clear };
}
