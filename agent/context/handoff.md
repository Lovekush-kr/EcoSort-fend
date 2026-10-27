# AI Assistant Handoff — EcoSort AI

**Resume Document for Incoming AI Coding Assistant**  
**Date:** October 27, 2026

---

## 1. Project Basics
- **Project Name:** EcoSort AI (GDG Group Project)
- **Purpose:** AI-powered waste classification and recycling guidance web application.
- **Lead Frontend Dev:** 2nd-year B.Tech CSE student.
- **Root Project Directory:** `c:\Users\91959\OneDrive\Desktop\Ecosort_gdg\ecosort-frontend`
- **Application Entry Point:** `src/main.jsx` -> `src/App.jsx`
- **Tech Stack:** React 19.3.1, Vite 8.3.5, Tailwind CSS 4.3.3, React Router v7, Lucide React, Oxlint.
- **Figma Reference:** `https://www.figma.com/design/vHtnrTGFJudeamff4pUvpE/Untitled?node-id=0-1&t=Vf8QAsgV2zMoKJVl-1`
- **Backend Base URL:** `https://ecosort-ai-u1ln.onrender.com`

---

## 2. Mascot Placements & Verified State Mappings

All six mascot SVG assets have been organized and verified against their intended application states (defined in `src/constants/mascots.js`):

| Mascot | File Name | Intended State | Component Placement | Verification Status |
|--------|-----------|----------------|---------------------|---------------------|
| **Mascot 1** | `Group 1.svg` | Homepage Hero | `src/pages/Home.jsx` (Hero card only; **removed from Plastic card**) | **VERIFIED** |
| **Mascot 2** | `Group 18.svg` (Lock badge) | Locked / Restricted Status | `src/pages/History.jsx` (guest locked screen) & `Scanner.jsx` (auth-required prompt; **removed from Paper card**) | **VERIFIED** |
| **Mascot 3** | `Group 19.svg` (SMS bubble) | SMS-Related State | Mapped in `src/constants/mascots.js` and reserved for future SMS feature; **removed from Glass card** | **PENDING FEATURE** |
| **Mascot 4** | `Group 3.svg` (Checkmark) | Confirmed Classification Success | `src/components/scanner/ClassificationResult.jsx` (only rendered when valid category is confirmed; **removed from Metal card**) | **VERIFIED** |
| **Mascot 5** | `Group 5.svg` (Loading rays) | Classification In-Progress Loading | `src/pages/Scanner.jsx` (only rendered while request is active; **removed from Organic card**) | **VERIFIED** |
| **Mascot 6** | `Group 4.svg` (Error badge) | Errors & Unsuccessful Login | `src/pages/Login.jsx` (failed auth alert) & `Scanner.jsx` (API error state; **removed from E-Waste card**) | **VERIFIED** |

---

## 3. Waste Category Cards Status
- **Mascot-Free**: All six category cards (`Plastic`, `Paper`, `Glass`, `Metal`, `Organic`, `E-Waste`) in `Home.jsx` are now clean of mascot graphics.
- Cards maintain their layout, category tags, titles, descriptions, stream emoji icons, and `Classify ->` navigation buttons.
- Build and linter checks pass with zero errors.

---

## 4. Current Blockers
- **Backend Registration 503:** `POST /api/auth/register` returns `503 Service Unavailable` because teammate's SMTP email service is down on Render.
- **History Endpoint Missing:** The backend teammate has not implemented a history endpoint. Frontend displays truthful placeholder.

---

## 5. The Exact Next Task
1. Check with the backend teammate on whether an SMS notification/alert feature or email verification bypass is ready.
2. If backend authentication is unblocked, test live login with valid credentials and perform an end-to-end classification run with a real test waste photo to observe Mascot 4 (Success) in real-time.

---

## 6. Commands to Start & Test
Inside `c:\Users\91959\OneDrive\Desktop\Ecosort_gdg\ecosort-frontend`:

```bash
# Start local development server (Vite on http://localhost:5173)
npm run dev

# Run production build
npm run build

# Run linter
npm run lint
```
