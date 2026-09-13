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

### Q5: Why must dynamic JSX template literals be escaped inside server-side generators?
- **Root Cause**: When generating React JSX code containing dynamic class strings (e.g. `className={\`...\${condition ? '...' : '...'}\`}`), template strings inside Node.js template literals (`return \`...\``) will be evaluated immediately by the Node runtime instead of being emitted as raw JSX, causing runtime `ReferenceError` or `SyntaxError`.
- **Resolution**: All dynamic JSX expressions inside generator templates are properly escaped as `\`\${...}\`` or authored with escaped backticks `\``.

### Q6: How does the AI generator guarantee mobile responsiveness down to 375px?
- **Root Cause**: Unconstrained hero headlines and static widths (such as fixed px widths or 5 unconstrained swatches) overflow 375px mobile viewports (e.g. iPhone SE).
- **Resolution**: Rule R11 in `jsx-system-prompt.js` explicitly trains the synthesis model to apply mobile-first styling:
  - Root `w-full overflow-x-hidden`.
  - Responsive headline typography: `text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black break-words tracking-tight`.
  - Swatch containers wrapped in `overflow-x-auto no-scrollbar` with `flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10`.
  - 7-size selectors mapped to `grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2`.
  - CTA and secondary action buttons sized with 44px+ touch heights (`py-3.5 sm:py-4` and `flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14`).

