# FocusRead

An ADHD-friendly focused reading tool for the web. Paste text, drop in a URL, or upload a file — then read without distraction using a movable focus band that highlights exactly the lines you're working through.

---

## Features

**Focus band**
- A full-width highlight stripe locks your eyes to the line(s) you're reading
- Advance or retreat by pressing Space / ↓ / ↑
- Band size: 1, 2, 3, or 5 lines (configurable in Settings)
- Everything outside the band is dimmed

**Input methods**
- Paste raw text
- Enter a URL — the server fetches and extracts the article content (using Mozilla Readability, the same engine Firefox Reader View uses)
- Upload a file — supports `.txt`, `.pdf`, and `.docx` (Word documents); PDFs and Word docs are parsed server-side

**Bionic Reading**
- Toggle on to bold the first half of each word, giving your eyes a faster anchor point

**Customisation**
- 11 colour themes: Dark, Light, Sepia, Midnight, Forest, Ocean, Dusk, Rose, Slate, Sand, High Contrast
- 10 font choices including Georgia, Palatino, Verdana, Atkinson Hyperlegible, and OpenDyslexic
- Font size, line height, and letter spacing sliders

**Progress bar**
- Fixed vertical bar on the right edge of the screen
- Fills from top to bottom as you advance through the text
- Based on your reading position in the document, not scroll position — works identically across all band sizes

**Keyboard navigation**
- `Space` / `↓` — advance the band
- `↑` — go back
- Click any word — jump the band to that line
- `Esc` — exit the reader (or close any open panel)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, CSS Modules |
| Backend | Node.js, Express 4 |
| Article extraction | @mozilla/readability + jsdom |
| File parsing | mammoth (Word .docx), pdf-parse (PDF) |
| Monorepo | npm workspaces |

The server exists only to fetch and parse remote URLs — it is a lightweight proxy so the browser never makes cross-origin requests directly. Everything else runs client-side.

---

## Getting started

**Prerequisites:** Node.js 18 or later, npm 9 or later.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/focusread.git
cd focusread

# 2. Install all dependencies (root + client + server)
npm run install:all

# 3. Start both the client dev server and the API server
npm run dev
```

The app opens at **http://localhost:5173**.  
The API server runs on **http://localhost:3001** (proxied by Vite, so you never need to call it directly).

---

## Project structure

```
focusread/
├── client/                  # React + Vite frontend
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── InputScreen/   # Landing page / input UI
│       │   ├── Reader/        # Core reading experience
│       │   └── SettingsPanel/ # Settings drawer
│       ├── hooks/
│       │   ├── useReader.js   # Text state, advance/retreat logic
│       │   └── useSettings.js # Persisted user preferences
│       └── utils/
│           ├── bionic.js      # Bionic Reading text transform
│           └── themes.js      # Theme and font definitions
├── server/
│   └── index.js             # Express server — URL fetch & parse endpoint
└── package.json             # npm workspace root
```

---

## Browser support

Works in any modern Chromium or Firefox-based browser. Tested on Chrome, Edge, and Prisma Browser (Chromium-based). No extensions or plugins required.

---

## Available scripts

Run from the repo root:

| Command | What it does |
|---|---|
| `npm run dev` | Start client (port 5173) and server (port 3001) in parallel |
| `npm run dev --workspace=client` | Client only |
| `npm run dev --workspace=server` | Server only |
| `npm run build --workspace=client` | Production build → `client/dist/` |

---

## License

MIT
