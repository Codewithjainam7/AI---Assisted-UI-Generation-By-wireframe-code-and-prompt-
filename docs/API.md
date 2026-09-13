# 🔌 UIGen Studio — REST API Reference

The backend API runs on port `4000` by default and provides REST endpoints for AI code synthesis, CMS state management, live element updates, and ZIP bundle exporting.

Base URL: `http://localhost:4000/api`

---

## 1. System Health

### `GET /api/health`
Returns the operational health and connectivity status of the server.

#### Response (`200 OK`)
```json
{
  "ok": true,
  "timestamp": "2026-09-13T17:07:40.497Z"
}
```

---

## 2. Generation Engine

### `POST /api/generate`
Submits a section generation job using **Wireframe image**, **JSX code**, **Text prompt**, or a **Combined** payload.

- **Content-Type**: `multipart/form-data`

#### Request Parameters
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `string` | Yes | `"wireframe"` \| `"code"` \| `"prompt"` \| `"combined"` |
| `pageName` | `string` | No | Target page identifier (default: `"Home"`) |
| `sectionName`| `string` | No | Target section name in PascalCase (default: `"Custom"`) |
| `prompt` | `string` | Conditional| Text prompt instructions and design requirements |
| `wireframe` | `file` | Conditional| Wireframe image file (`image/png`, `image/jpeg`, max 8MB) |
| `code` | `string` | Conditional| Existing React/JSX code to analyze and bind |

#### Example cURL
```bash
curl -X POST http://localhost:4000/api/generate \
  -F "mode=prompt" \
  -F "pageName=Home" \
  -F "sectionName=CyberHero" \
  -F "prompt=Create an AI cybersecurity hero section for CyberPulse. Brand: CYBERPULSE. Headline: ZERO TRUST CLOUD SECURITY."
```

#### Response (`200 OK`)
```json
{
  "ok": true,
  "sectionId": "1000000028",
  "pageName": "Home",
  "componentFile": "CyberHeroSection.jsx",
  "jsx": "import React, { useEffect, useRef } from \"react\";\n...",
  "elementIds": [
    "2000000190",
    "2000000191",
    "2000000192",
    "2000000193",
    "2000000194",
    "2000000195",
    "2000000196"
  ],
  "warnings": [],
  "ir": { ... }
}
```

---

## 3. Sections

### `GET /api/sections`
Lists generated sections ordered by creation date descending.

#### Query Parameters
- `pageName` *(optional)*: Filter sections by page (e.g. `?pageName=Home`)
- `sectionId` *(optional)*: Filter by unique section ID

#### Response (`200 OK`)
```json
[
  {
    "sectionId": "1000000028",
    "sectionName": "CyberHero",
    "pageName": "Home",
    "isGenerated": true,
    "cardGridColumns": 3,
    "createdAt": "2026-09-13T17:48:22.000Z"
  }
]
```

---

### `GET /api/sections/:sectionId`
Retrieves full details and metadata for a specific section.

---

### `GET /api/sections/:sectionId/export`
Generates and downloads a production-ready ZIP archive bundle containing:
1. `<SectionName>Section.jsx` (Synthesized React component)
2. `section.json` (Section metadata)
3. `elements.json` (Bound CMS element records)

---

## 4. CMS Elements

### `GET /api/elements`
Retrieves CMS elements. Automatically scopes to the **most recent active section** for the given `pageName` to eliminate duplicate key collisions.

#### Query Parameters
- `pageName` *(optional)*: Page name (e.g. `?pageName=Home`)
- `sectionId` *(optional)*: Exact section ID filter

#### Response (`200 OK`)
```json
{
  "ok": true,
  "elements": [
    {
      "sectionId": "1000000028",
      "elementName": "heroImage",
      "fieldId": "2000000190",
      "content": "default/images/hero-placeholder.jpg",
      "contentType": "Image",
      "loop": []
    },
    {
      "sectionId": "1000000028",
      "elementName": "headlineMain",
      "fieldId": "2000000192",
      "content": "ZERO TRUST CLOUD SECURITY",
      "contentType": "Text",
      "loop": []
    }
  ]
}
```

---

### `PATCH /api/elements/:fieldId`
Updates the text content, loop items, or CSS text for an element. Automatically sanitizes HTML content to allowed tags (`b, i, br, span, strong, em`).

#### Request Body (`application/json`)
```json
{
  "content": "REAL-TIME AUTONOMOUS DEFENSE",
  "css": "color: #ef4444; font-weight: 900;"
}
```

#### Response (`200 OK`)
```json
{
  "ok": true,
  "element": {
    "fieldId": "2000000192",
    "content": "REAL-TIME AUTONOMOUS DEFENSE",
    "css": "color: #ef4444; font-weight: 900;"
  }
}
```
