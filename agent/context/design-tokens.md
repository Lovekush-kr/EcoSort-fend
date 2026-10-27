# Design Tokens & Visual System — EcoSort AI

**Figma Reference URL:** [https://www.figma.com/design/vHtnrTGFJudeamff4pUvpE/Untitled?node-id=0-1&t=Vf8QAsgV2zMoKJVl-1](https://www.figma.com/design/vHtnrTGFJudeamff4pUvpE/Untitled?node-id=0-1&t=Vf8QAsgV2zMoKJVl-1)  
**Inspection Status:** Verified against extracted Figma SVG layer exports (`Group 1`, `Group 3`, `Group 4`, `Group 5`, `Group 6`, `Group 18`, `Group 19`). Extracted palette and typography documented below.

---

## 1. Color Palette

### 1.1 Brand & Environmental Palette (Extracted from Figma SVGs)
The extracted SVG artwork uses a distinctive earth and nature palette featuring deep forest greens, vibrant foliage tones, warm creams, and purple accent stops:

| Name | Hex Code | Usage | Notes |
|------|----------|-------|-------|
| **Eco Green Dark** | `#344A35` / `#2F4B35` | Hero headings, deep accents, logo gradient base | Extracted from `Group 6.svg` & `Group 1.svg` |
| **Eco Green Medium** | `#3A5F36` / `#48713F` | Primary buttons, brand highlights | Extracted from `Group 1.svg` |
| **Foliage Green** | `#4F7943` / `#517E43` | Active icons, gradients, category highlights | Extracted from `Group 6.svg` |
| **Fresh Green** | `#699C4E` / `#8BCF9B` | Success states, pills, high confidence accents | Extracted from `Group 18.svg` |
| **Earth Purple** | `#825D99` / `#563D65` | Logo emblem 3rd loop, brand badges | Extracted from `Group 6.svg` |
| **Warm Cream** | `#F6F2E4` / `#ECE6DB` | Light category cards, subtle container fills | Extracted from `Group 3.svg` |
| **Sage Cream** | `#D7DDB9` / `#CACDB2` | Category card borders & badge backgrounds | Extracted from `Group 4.svg` |
| **Deep Charcoal** | `#313A39` / `#151B1B` | Primary typography, dark footers | Extracted from `Group 1.svg` |

### 1.2 Tailwind Theme Tokens (in `src/index.css`)
- **Primary Green Scale:**
  - `primary-50`: `#f0fdf4`
  - `primary-100`: `#dcfce7`
  - `primary-200`: `#bbf7d0`
  - `primary-500`: `#22c55e`
  - `primary-600`: `#16a34a`
  - `primary-700`: `#15803d`
  - `primary-800`: `#166534`
  - `primary-900`: `#14532d`
- **Secondary Teal Scale:**
  - `secondary-50`: `#f0fdfa`
  - `secondary-500`: `#14b8a6`
  - `secondary-600`: `#0d9488`
- **Functional & Feedback:**
  - Surface: `#ffffff`
  - Surface Alt: `#f8fafc`
  - Border: `#e2e8f0`
  - Success: `#16a34a`
  - Warning: `#f59e0b`
  - Error: `#ef4444`

---

## 2. Typography
- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Heading Scale:**
  - Hero H1: `text-4xl sm:text-5xl lg:text-6xl`, font-black / font-extrabold, tracking-tight
  - Section H2: `text-3xl sm:text-4xl`, font-extrabold, tracking-tight
  - Card H3: `text-xl`, font-bold
  - Body: `text-base` (16px), line-height 1.6
  - Caption / Badges: `text-xs` (12px), font-semibold / uppercase tracking-wider

---

## 3. Radii, Elevation & Spacing
- **Border Radii:**
  - Small elements (inputs, tags): `rounded-xl` (12px)
  - Cards & containers: `rounded-2xl` (16px) to `rounded-3xl` (24px)
  - Modals / Dropzones: `rounded-3xl` (24px)
  - Pills: `rounded-full` (9999px)
- **Shadows:**
  - Subtle: `shadow-sm`
  - Standard Card: `shadow-md`
  - Elevated Hero / Hover: `shadow-xl`
- **Spacing:**
  - Section Vertical Padding: `py-16 lg:py-24`
  - Container Max Width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

## 4. Component Styles

### Buttons
- **Primary:** `bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-md transition-all hover:-translate-y-0.5`
- **Secondary:** `bg-white hover:bg-primary-50 text-primary-700 border border-primary-200 font-semibold rounded-2xl`
- **Ghost:** `text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl`

### Waste Category Cards
- **Mascot-Free**: The 6 waste category cards (Plastic, Paper, Glass, Metal, Organic, E-Waste) display clean, balanced typography, recycling status badge (`meta.tag`), category emoji icon badge, description, and `Classify ->` action button.
- Mascot images are strictly excluded from category cards.

---

## 5. Mascot Asset Locations & State Roles

Centralized registry in `src/constants/mascots.js`:

| Mascot Role | File Path | Application State |
|-------------|-----------|-------------------|
| **Mascot 1: Hero** | `/assets/Group 1.svg` | Main homepage hero preview card |
| **Mascot 2: Locked** | `/assets/Group 18.svg` | Locked scan history & scanner auth-required prompt |
| **Mascot 3: SMS** | `/assets/Group 19.svg` | Reserved for future SMS functionality |
| **Mascot 4: Success** | `/assets/Group 3.svg` | Valid classification confirmed in `ClassificationResult.jsx` |
| **Mascot 5: Loading** | `/assets/Group 5.svg` | In-progress classification in `Scanner.jsx` |
| **Mascot 6: Error** | `/assets/Group 4.svg` | Authentication failure in `Login.jsx` & API error in `Scanner.jsx` |
