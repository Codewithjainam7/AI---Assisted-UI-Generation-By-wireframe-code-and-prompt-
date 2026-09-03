# ✦ AI-Assisted UI Generation Studio
### PS7 Hackathon · React.js + Node.js · Nemotron 3 Ultra + Gemini 2.5 Pro

Generate CMS-ready React section components from **wireframe images**, **existing JSX code**, or **natural-language prompts** — with live preview editing via Redux.

---

## 🚀 Quick Start (3 steps)

### Prerequisites
- Node 18+
- MongoDB running locally (`mongodb://localhost:27017`) — or update `MONGODB_URI` in `.env`
- API keys (see `.env.example`)

### 1. Install Dependencies
```bash
npm install
npm run install:all
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env and fill in your API keys:
# LLM_API_KEY  → OpenRouter key for Nemotron 3 Ultra 550B
# GEMINI_API_KEY → Google AI Studio key for Gemini 2.5 Pro
```

### 3. Run
```bash
npm run dev
```
- **Client** → http://localhost:5173
- **Server** → http://localhost:4000
- **API Health** → http://localhost:4000/api/health

Optional: seed the database with sample data:
```bash
npm run seed
```

---

## 🎯 Input Modes

### Mode A — Wireframe
1. Go to `/generate` → select **Wireframe** tab
2. Drag & drop a PNG/JPG wireframe (max 8MB)
3. Gemini 2.5 Pro labels regions → IR → Nemotron generates JSX
4. Preview at `/preview/Home`

### Mode B — Code
1. Select **Code** tab
2. Paste existing React/JSX
3. acorn AST parser extracts structure → existing fieldIds reused
4. CMS-compliant component generated

### Mode C — Prompt
1. Select **Prompt** tab
2. Type e.g.: *"Create a fitness hero. Left athlete image. Right: red badge, bold headline, 3 stats, red CTA."*
3. Nemotron generates IR + JSX → section persisted

### Mode D — Combined
1. Select **Combined** tab
2. Upload wireframe + type prompt instructions
3. Wireframe wins for layout, prompt wins for copy/colour

---

## 🗂️ Project Structure

```
├── client/          React 18 + Vite (Tailwind iOS 26 UI)
│   └── src/
│       ├── sections/generated/   ← generated .jsx files land here
│       ├── features/cms/         ← Redux CMS slice
│       └── pages/                ← Landing, Generate, Preview
├── server/          Node.js + Express
│   └── src/
│       ├── services/             ← Gemini, Nemotron, IdAllocator, ZipExporter
│       ├── models/               ← Mongoose Section + Element
│       └── controllers/          ← Generate, Section, Element
├── seed/            Sample section + elements JSON
└── .env.example     Environment variable template
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Submit generation job (multipart) |
| `GET`  | `/api/health` | Health check |
| `GET`  | `/api/sections` | List all sections |
| `GET`  | `/api/sections/:id` | Get section by ID |
| `GET`  | `/api/sections/:id/export` | Download ZIP (JSX + JSON) |
| `POST` | `/api/sections/:id/regenerate` | Generate variation |
| `GET`  | `/api/elements?pageName=Home` | Get elements for page |
| `PATCH`| `/api/elements/:fieldId` | Update element content/css |

---

## 🎬 8-Minute Demo Script (Judges)

**0:00 – 0:30** — Show `README.md` and `.env.example`. Start API + client with `npm run dev`.

**0:30 – 2:30** — **Prompt Mode**:
```
Paste: "Create a fitness hero for Pulse Fit. Left: athlete image. Right: red uppercase badge,
bold headline CHALLENGE YOUR LIMITS, subheading, body paragraph,
3 stat cards (1000+ Members / 40+ Programmes / 150+ Channels), red CTA FIND A WORKOUT."
```
Click Generate. Watch StepProgress animate. See result JSX panel.

**2:30 – 4:00** — Navigate to `/preview/Home`.
Open DevTools → inspect DOM:
- `id="heroImage"` ✓
- `id="headlineMain"` ✓  
- `id="ctaButton"` ✓
- `id="3000000001"` (stat value) ✓

**4:00 – 5:30** — **Live CMS edit**:
```bash
curl -X PATCH http://localhost:4000/api/elements/2000000003 \
  -H "Content-Type: application/json" \
  -d '{"content":"TRAIN WITHOUT LIMITS"}'
```
Open CMS editor panel → headline updates live (no JSX re-generation).

**5:30 – 7:00** — **Wireframe Mode** → upload sample wireframe PNG → new section generated → compare side-by-side.

**7:00 – 7:30** — Toggle viewport: 📱 375px (stacked) → 💻 1280px (split). Show red accent bars.

**7:30 – 8:00** — Download ZIP → show contents. Known limitation: Q&A.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS (iOS 26), PrimeReact, Redux Toolkit |
| Backend | Node.js 18, Express 4, Mongoose |
| AI (Text/JSX) | Nemotron 3 Ultra 550B via OpenRouter |
| AI (Vision) | Gemini 2.5 Pro via @google/generative-ai |
| JSX Validation | acorn + acorn-jsx |
| ZIP Export | archiver |
| Database | MongoDB 7 |

---

## ⚠️ Known Limitations
- Nemotron may occasionally return non-compilable JSX → fallback template is used (warning shown)
- Wireframe mode requires a vision-capable Gemini endpoint
- Generated section is written to disk at `client/src/sections/generated/` — hot reload picks it up automatically
- No authentication — demo/hackathon only

---

## 🔒 Security
- No API keys in the repo — `.env` is gitignored
- User-pasted code is parsed as text/AST only (`acorn`) — never `eval()`'d
- CMS HTML sanitised to allow-list: `b, i, br, span, strong, em`
- Uploads limited to 8MB, PNG/JPG/WebP only
