# EcoSort AI — Asset Catalog & Mascot Registry

This directory contains the visual assets exported from the Figma design reference for **EcoSort AI**.

---

## 1. Brand Identity & Logos

| File Name | Dimensions | Purpose | Notes |
|-----------|------------|---------|-------|
| `Group 6.svg` | 198 × 198 | **Official EcoSort Logo Emblem** | 3-way circular loop gradient icon using eco-green (`#496341`, `#517E43`) and purple (`#825D99`, `#563D65`). Used in Navbar, Footer, Scanner Header, and mirrored to `/favicon.svg` and `/logo.svg`. |

---

## 2. Six EcoSort AI Mascot Images & State Mappings

> **CRITICAL RULE**: Mascot illustrations are state-specific interactive graphics. They **must never be displayed inside the waste category cards**.

| Mascot ID | Actual Filename | Visual Characteristic | Intended UI State & Component Placement |
|-----------|-----------------|-----------------------|-----------------------------------------|
| **Mascot 1** | `Group 1.svg` (228 × 294) | Neutral mascot holding scanner device | **Homepage Hero Illustration Area** (`Home.jsx` hero card exclusively). |
| **Mascot 2** | `Group 18.svg` (195 × 187) | Mascot with lock icon badge | **Locked Status State** (`History.jsx` unauthenticated lock screen & `Scanner.jsx` auth-required banner). |
| **Mascot 3** | `Group 19.svg` (198 × 183) | Mascot with SMS / message bubble | **SMS-Related State** (Reserved for future SMS notifications/alerts workflow; mapped in code but not rendered without SMS feature). |
| **Mascot 4** | `Group 3.svg` (300 × 346) | Mascot with green checkmark `✓` badge | **Successful Waste Classification Result** (`ClassificationResult.jsx` when valid prediction confirmed). |
| **Mascot 5** | `Group 5.svg` (272 × 344) | Mascot with loading rays / swirl above head | **Classification In-Progress Loading State** (`Scanner.jsx` while ML request is actively pending). |
| **Mascot 6** | `Group 4.svg` (289 × 344) | Mascot with red circle / error badge `!` | **Error & Unsuccessful Login States** (`Login.jsx` failed authentication banner & `Scanner.jsx` API error banner). |

---

## 3. Directory Layout

- `/public/assets/` — Directly referenceable via `/assets/<filename>`.
- `/src/assets/` — Imported by React bundler.
- `/src/constants/mascots.js` — Centralized JS object `MASCOTS` pointing to `/assets/<filename>`.
