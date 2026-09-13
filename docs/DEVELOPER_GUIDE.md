# 🛠️ Developer Guide & Troubleshooting Runbook

This guide contains setup instructions, architecture notes, and solutions to common issues encountered during development.

---

## 💻 1. Local Environment Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm v9+
- **Database**: MongoDB (optional — automatic JSON store fallback included)
- **API Keys**:
  - OpenRouter API Key for Nemotron 3 Ultra 550B
  - Google Generative AI Key for Gemini 2.5 Flash

### Installation & Initialization
```bash
# Clone the repository
git clone https://github.com/Codewithjainam7/AI---Assisted-UI-Generation-By-wireframe-code-and-prompt-.git
cd AI---Assisted-UI-Generation-By-wireframe-code-and-prompt-

# Install root, client, and server dependencies
npm run install:all

# Configure environment
cp .env.example .env
```

### Environment Variables (`.env`)
```ini
PORT=4000
MONGODB_URI=mongodb://localhost:27017/hackathon_ui_gen

# LLM Synthesis (OpenRouter)
LLM_API_KEY=your_openrouter_api_key_here
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=nvidia/nemotron-3-ultra-550b-a55b

# Vision OCR (Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🗄️ 2. Dual-Storage Persistence Layer

The studio is designed for zero-config resilience:
- **MongoDB Connected**: When MongoDB is running at `MONGODB_URI`, data is persisted to MongoDB collections (`sections`, `elements`).
- **MongoDB Offline**: The system automatically detects the absence of MongoDB and uses a **JSON Document Store** (`server/data/sections.json` and `server/data/elements.json`).
- All queries, updates, and inserts work identically across both backends via the `dbStore.js` adapter.

---

## 🔧 3. Troubleshooting & Engineering FAQ

### Q1: Why did OpenRouter return `401 Missing Authentication header`?
- **Root Cause**: `dotenv.config()` was previously resolving three directory levels up instead of two, causing `process.env.LLM_API_KEY` to be undefined.
- **Resolution**: Path was fixed to `path.join(__dirname, '../../.env')` in `server/src/index.js`.

### Q2: Why did Vite reload the browser when files were generated?
- **Root Cause**: Vite's file watcher observed disk writes in `client/src/sections/generated/` and triggered a hard page refresh (`[vite] page reload`).
- **Resolution**: Configured `watch.ignored: ['**/src/sections/generated/**']` in `client/vite.config.js` and decoupled the preview canvas using the reactive `DynamicSectionPreview.jsx` component.

### Q3: Why did browser tabs keep showing a spinning loading indicator?
- **Root Cause**: Missing `/favicon.ico` returning 404, combined with a blocking external Google Font stylesheet.
- **Resolution**: Added standalone `favicon.svg` & `favicon.ico` in `client/public/`, and transitioned to non-blocking system fonts (`SF Pro Display` / system-ui).

### Q4: How does element deduplication work?
- When querying `GET /api/elements?pageName=Home`, `ElementStore.find()` automatically scopes to the **latest active sectionId** for that page, preventing historical test runs from polluting the live CMS state.
