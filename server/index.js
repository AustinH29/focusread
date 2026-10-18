import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const _require = createRequire(import.meta.url);
const { parsePdf } = _require('./pdf-bridge.cjs');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

app.post('/fetch-url', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid url' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.status(400).json({ error: 'Only http/https URLs are supported' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Remote server returned ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('html')) {
      return res.status(415).json({ error: 'URL did not return HTML content' });
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      const rawText = dom.window.document.body?.textContent || '';
      const cleaned = rawText.replace(/\s+/g, ' ').trim();
      if (cleaned.length > 200) {
        return res.json({ title: dom.window.document.title || '', byline: '', content: cleaned });
      }
      return res.status(422).json({ error: 'Could not extract readable content from this URL. Try pasting the text directly.' });
    }

    return res.json({
      title: article.title || '',
      byline: article.byline || '',
      content: article.textContent || '',
    });
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Request timed out fetching URL' });
    }
    return res.status(502).json({ error: 'Failed to fetch URL: ' + err.message });
  }
});

app.post('/parse-file', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const name = file.originalname || '';
  const ext = name.split('.').pop().toLowerCase();
  const title = name.replace(/\.[^.]+$/, '');

  try {
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return res.json({ title, content: result.value });
    }

    if (ext === 'pdf') {
      const result = await parsePdf(file.buffer);
      return res.json({ title, content: result.text });
    }

    return res.status(415).json({ error: 'Unsupported file type. Upload a .docx or .pdf file.' });
  } catch (err) {
    return res.status(422).json({ error: 'Could not parse file: ' + err.message });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`FocusRead server running at http://127.0.0.1:${PORT}`);
});
