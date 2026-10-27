# Permanent Project Rules — EcoSort AI

These rules are permanent principles governing development on the **EcoSort AI** project. Any AI assistant or developer working on this codebase must adhere to them strictly.

---

## 1. Context & Codebase Integrity
- **Read Context First**: Always read all documents in `agent/context/` before planning or writing any code.
- **Inspect Before Editing**: Inspect the real files in the workspace and their imports before proposing or applying modifications.
- **Preserve Functioning Code**: Never wipe, rewrite, or break working components or established routing without an explicit, documented reason.
- **Understand Ripple Effects**: Before modifying a module, identify all dependent components and ensure backward compatibility.

---

## 2. Design & UX Fidelity
- **Figma as Source of Truth**: When the Figma file is accessible (`https://www.figma.com/design/vHtnrTGFJudeamff4pUvpE/Untitled?node-id=0-1&t=Vf8QAsgV2zMoKJVl-1`), inspect and implement the actual desktop frames, layouts, colors, typography, spacing, and assets.
- **Never Fabricate Designs**: Do not replace the intended design with generic AI templates or invent contrasting themes.
- **Reuse Supplied Assets**: Use the verified Figma vector exports (`Group 6.svg`, `Group 1.svg`, `Group 3.svg`, `Group 4.svg`, `Group 5.svg`, `Group 18.svg`, `Group 19.svg`) from `public/assets/` and `src/assets/`.
- **Responsive & Accessible**: Ensure desktop layouts scale gracefully to tablet and mobile screens with accessible form controls and clear error states.

---

## 3. Backend & API Contracts
- **Never Invent API Contracts**: Only communicate with documented and verified endpoints.
- **Never Fabricate Data**:
  - Never fabricate image classification predictions or confidence scores.
  - Never fabricate user scan history or persist fake history to pretend server integration exists.
  - Never create fake authentication success tokens.
- **Verify Live Endpoints**: Never claim an endpoint works until you have probed it and inspected the real HTTP response.
- **Preserve Architectural Separation**: Keep API calls inside `src/services/` (e.g., `api.js`, `classificationService.js`, `authService.js`). Never embed raw fetch calls directly in presentation components or `App.jsx`.
- **Handle Cold Starts Gracefully**: The production backend on Render spins down when inactive. Handle timeouts, network delays, and loading spinners gracefully.

---

## 4. Security & Environment
- **No Secrets in Code**: Never commit JWT secrets, database connection strings, passwords, or private API keys.
- **Environment Isolation**:
  - Keep public configurations in `.env.example`.
  - Store local secrets in `.env.local` and ensure `.env.local` is gitignored.
- **Frontend-Safe Variables**: Only reference `VITE_*` environment variables in client-side code.

---

## 5. Developer Experience & Handoff Maintenance
- **Keep Code Intermediate-Friendly**: The lead developer is a 2nd-year B.Tech CSE student. Maintain clean, modern, idiomatic React without overly complex or redundant abstractions.
- **Context Updates are Mandatory**: Update `current-state.md`, `design-tokens.md`, `tech-stack.md`, and `handoff.md` after every meaningful milestone, bugfix, or API test.
- **Run Verification Checks**: Always execute `npm run build` and `npm run lint` before reporting work as complete. Report failures honestly.
- **Actionable Next Tasks**: In `handoff.md`, specify concrete, file-specific next steps for incoming AI assistants.
