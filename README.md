# ✦ AI-Assisted UI Generation Studio
### Multi-Modal AI Code Generator & Live CMS Engine
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4_iOS_26-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-10.8-06B6D4?logo=primereact&logoColor=white)](https://primereact.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Vision_OCR-4285F4?logo=google&logoColor=white)](https://aistudio.google.com)
[![Nemotron](https://img.shields.io/badge/Nemotron_3_Ultra-550B_Synthesis-76B900?logo=nvidia&logoColor=white)](https://openrouter.ai)

Generate production-ready, CMS-bound React components from **wireframe sketches/screenshots**, **existing static JSX**, or **natural-language prompts** — with real-time side-by-side live preview and dynamic Redux CMS editing.

---

## 📚 Documentation Index

| Guide | Description |
| :--- | :--- |
| 🏗️ **[System Architecture](docs/ARCHITECTURE.md)** | Multimodal pipeline, data flow diagrams, R1–R14 contract rules |
| 🔌 **[REST API Reference](docs/API.md)** | Endpoints, payload schemas, query parameters, cURL examples |
| 🎬 **[Demo & Judge Guide](docs/DEMO_GUIDE.md)** | 5-minute presentation script and requirements verification matrix |
| 🛠️ **[Developer Guide](docs/DEVELOPER_GUIDE.md)** | Local environment setup, dual-storage failover, troubleshooting |

---

## ✨ Key Features

- **Multimodal Generation Pipeline**:
  - 🖼️ **Wireframe Mode**: Deep visual OCR and spatial layout extraction powered by **Gemini 2.5 Flash Vision**.
  - ✍️ **Prompt Mode**: High-reasoning UI structure and theme synthesis via **Nemotron 3 Ultra 550B**.
  - 💻 **Code Mode**: JSX AST parsing with `acorn` + `acorn-jsx` to preserve and reuse existing CMS element bindings.
  - ⚡ **Combined Mode**: Resolves layout from wireframes and copy/accents from prompts.
- **Side-by-Side Dual Studio**:
  - Live interactive rendered canvas alongside syntax-highlighted JSX code with 1-click clipboard copy and ZIP bundle export.
  - Viewport switcher (📱 375px Mobile / 💻 Desktop).
- **Live CMS Editing**:
  - Instant blur-based element patching (`PATCH /api/elements/:fieldId`) with real-time preview updates without code recompilation.
- **Contract Compliance (R1–R14)**:
  - Deterministic 10-digit ID allocation (`1000...`, `2000...`, `3000...`).
  - Redux Toolkit integration (`allSections`, `allSectionsCss`).
  - Safe HTML rendering and PrimeReact button bindings.
- **Dual Persistence Architecture**:
  - Auto-detects MongoDB or transparently falls back to resilient JSON document store (`server/data/`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
git clone https://github.com/Codewithjainam7/AI---Assisted-UI-Generation-By-wireframe-code-and-prompt-.git
cd AI---Assisted-UI-Generation-By-wireframe-code-and-prompt-
npm run install:all
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your OpenRouter and Gemini API keys in .env:
# LLM_API_KEY=sk-or-v1-...
# GEMINI_API_KEY=...
```

### 3. Start the System
```bash
npm run dev
```

- **Generation Studio**: [http://localhost:5173/generate](http://localhost:5173/generate)
- **Live Preview & CMS Editor**: [http://localhost:5173/preview/Home](http://localhost:5173/preview/Home)
- **Backend API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🔒 Security & Resilience

- **No Hardcoded Credentials**: Strictly utilizes `.env` (gitignored).
- **Safe Code Handling**: User inputs are parsed strictly as AST tokens via `acorn` — never executed via `eval()`.
- **HTML Sanitization**: Strict allowlist filter (`b, i, br, span, strong, em`) preventing XSS injections.
- **Fail-Safe Fallbacks**: Multi-tier retry with automatic template synthesis if external AI APIs experience outages.
