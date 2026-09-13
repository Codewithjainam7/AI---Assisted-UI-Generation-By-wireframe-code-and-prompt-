# 🎬 Hackathon Presentation & Judge Verification Guide

This guide provides a structured walkthrough for demonstrations, along with a compliance checklist mapped directly to the hackathon problem statement requirements.

---

## ⏱️ 5-Minute Demonstration Script

### Minute 0:00 – 1:00 · Overview & Modern Design Architecture
1. Open the landing page at **`http://localhost:5173`**.
2. Point out the **iOS 26 glassmorphism aesthetic** (`backdrop-blur-2xl`, dark `#09090b` canvas, red-orange gradient highlights, SF Pro typography).
3. Highlight the core value proposition: **Multimodal AI pipeline** generating production-grade React components bound to a live Redux CMS.

### Minute 1:00 – 2:30 · Prompt Mode (Natural Language Synthesis)
1. Click **Start Generating →** or navigate to **`/generate`**.
2. Select the **Prompt** tab.
3. Click **Load Sample Prompt** (or enter a custom prompt e.g., for a SaaS product).
4. Click **Generate Section ✦**.
5. Observe the 5-step animated progress pipeline:
   - *Parsing Input → Building IR → Synthesizing JSX → Allocating IDs → Saved to Store*
6. When complete, showcase the **Side-by-Side Dual Studio**:
   - **Left**: Live Interactive Rendered UI
   - **Right**: Complete Generated JSX Code with zero compilation errors

### Minute 2:30 – 3:45 · Wireframe Vision Mode (Gemini OCR)
1. Select the **Wireframe** tab.
2. Drag & drop a wireframe image (or click **Load Sample Wireframe**).
3. Click **Generate Section ✦**.
4. Show that **Gemini 2.5 Flash Vision OCR** extracts:
   - Text headlines & brand labels
   - 2-column or stacked layout detection
   - Card counts and metric values
5. The preview immediately updates with the uploaded image and extracted typography.

### Minute 3:45 – 5:00 · Live CMS Editing, Mobile Responsiveness & Contract Verification
1. Click **Open Fullscreen Preview** or navigate to **`/preview/Home`**.
2. Toggle the viewport to demonstrate **Mobile-First Responsive Architecture**:
   - Click **📱 375px** (simulated iPhone SE / mobile screen):
     - Show **zero horizontal overflow** (`overflow-x-hidden`).
     - Point out the **2x2 product photo gallery** adapting cleanly to small screens.
     - Demonstrate the swipeable **horizontal color swatches** (`overflow-x-auto no-scrollbar`) with circular touch targets.
     - Click through the **7-size selector** (`XS` to `3XL`) fitting cleanly across mobile rows without wrapping errors.
     - Observe the **48px touch targets** on CTA and Wishlist buttons.
     - Show the **sticky mobile header** with category quick-bar.
   - Click **💻 1280px** to demonstrate desktop 2-column split with red accent rails and expanded layout.
3. Click **Edit Content** (or **CMS** on mobile) to open the slide-out editor:
   - On mobile, note that it acts as a smooth glass overlay drawer without crushing the canvas.
4. Modify the headline text in the input field:
   - Notice the green checkmark on blur.
   - Watch the preview canvas update in **real-time** without any code re-generation.
5. Inspect the DOM in Browser DevTools:
   - Point out exact 10-digit IDs (`id="2000000..."`) and card IDs (`id="3000000..."`).
6. Click **Export ZIP** to download the bundled JSX and JSON metadata.

---

## ✅ Requirements Compliance Matrix

| Requirement ID | Specification | Status | Evidence |
| :--- | :--- | :---: | :--- |
| **FR-G01** | Wireframe Image Input (PNG/JPG up to 8MB) | **PASS** | `DropZone.jsx` + `WireframeParser.js` (Gemini 2.5 Flash) |
| **FR-G02** | Static Code Input (React / JSX) | **PASS** | `CodeEditor.jsx` + `CodeParser.js` (acorn AST walker) |
| **FR-G03** | Natural Language Prompt Input | **PASS** | `IRBuilder.js` + `ComponentSynthesiser.js` (Nemotron 3 Ultra) |
| **FR-G04** | Combined Multimodal Input | **PASS** | `GenerateController.js` multi-input resolution |
| **FR-G05** | IR Normalization & Theme Extraction | **PASS** | Standardized JSON IR schema with layout & theme |
| **FR-G06** | React Component Generation (R1–R14 Rules) | **PASS** | Deterministic 10-digit IDs, Redux selectors, PrimeReact Button |
| **FR-G07** | Live Preview Studio & Viewport Toggle | **PASS** | `DynamicSectionPreview.jsx` + 375px/1280px modes |
| **FR-G08** | CMS Live Element Editing | **PASS** | `ElementEditor.jsx` with instant Redux state patch |
| **FR-G09** | Production ZIP Bundle Export | **PASS** | `ZipExporter.js` bundling `.jsx`, `section.json`, `elements.json` |
| **FR-G10** | Deterministic ID Allocation | **PASS** | `IdAllocator.js` with persistent atomic counters |
| **FR-G11** | Mobile-First Responsive Architecture | **PASS** | Strict Rule R11 mobile stacking, 375px touch ergonomics, 2x2 gallery, horizontal swatches |
