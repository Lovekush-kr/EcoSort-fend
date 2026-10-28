# Technical Stack & Architecture — EcoSort AI

**Codebase:** `ecosort-frontend`  
**Entry Point:** `src/main.jsx` -> `src/App.jsx`  
**Framework:** React 19.3.1 with Vite 8.3.5 & Tailwind CSS 4.3.3  

---

## 1. Core Dependencies & Purposes

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `^19.3.1` | Core UI library |
| `react-dom` | `^19.3.1` | DOM renderer |
| `react-router-dom` | `^7.x` | Client-side declarative SPA routing |
| `lucide-react` | `^1.x` | Consistent, accessible iconography |
| `tailwindcss` | `^4.3.3` | Utility-first styling engine |
| `@tailwindcss/vite` | `^4.3.3` | Native Vite integration for Tailwind v4 |
| `oxlint` | `^1.88.0` | Ultra-fast linter for code health |

---

## 2. Routing Structure

All routes are declared in `src/App.jsx`:

| Path | Component | Auth Required? | Purpose |
|------|-----------|----------------|---------|
| `/` | `src/pages/Home.jsx` | No | Brand landing page, hero, category cards, workflow |
| `/scanner` | `src/pages/Scanner.jsx` | No | Core image upload & waste classification interface |
| `/login` | `src/pages/Login.jsx` | No | Account authentication |
| `/register` | `src/pages/Register.jsx` | No | Account creation |
| `/history` | `src/pages/History.jsx` | Yes (`ProtectedRoute`) | Past scan history (truthful placeholder) |
| `*` | `src/pages/NotFound.jsx` | No | 404 error page |

---

## 3. Centralized API Architecture

All network traffic is routed through modular services in `src/services/`:

```
src/services/
├── api.js                   # Base fetch wrapper, error handling, auth headers, base URL
├── classificationService.js # /api/health, /api/categories, /api/classify
└── authService.js           # /api/auth/register, /api/auth/login, /api/auth/me
```

### 3.1 Base URL & CORS Configuration
- Configured via `VITE_API_BASE_URL` in `.env.local` / `.env.example`.
- Production Default: `https://ecosort-ai-u1ln.onrender.com`
- Local Development: `http://localhost:5000` or Vite Proxy to Render
- **Local Development Origin**: Vite runs at `http://localhost:5173`; the local backend CORS default allows this origin. The live Render backend must also allow `http://localhost:5173` through its `FRONTEND_ORIGIN` setting when testing against it locally.

### 3.2 Endpoints & Verification Facts

#### A. Health Check (`GET /api/health`)
- **Status:** Verified working (200 OK)
- **Response Schema:**
```json
{
  "success": true,
  "message": "EcoSort AI backend is running"
}
```

#### B. Categories (`GET /api/categories`)
- **Status:** Verified working (200 OK)
- **Response Schema:**
```json
{
  "success": true,
  "categories": [
    "plastic",
    "paper",
    "glass",
    "metal",
    "organic",
    "e-waste"
  ]
}
```

#### C. Classification (`POST /api/classify`)
- **Type:** `multipart/form-data`
- **Field Name:** `image`
- **Authentication:** Required on live backend (`401: Access token is required.` if omitted).
- **Status:** Verified live against Render endpoint. `classificationService.classifyImage()` injects `Authorization: Bearer <token>` when a user session exists, and `Scanner.jsx` provides a dedicated login prompt if unauthenticated.
- **Handling:** Mapped in `ClassificationResult.jsx` with fallbacks for key variations (`category`, `prediction`, `label`, `confidence`, `guidance`, `steps`).

#### D. Auth Endpoints
- `POST /api/auth/register`: Requires `name`, `email`, `password`. Currently returns 503 because backend teammate's email verification service is down.
- `POST /api/auth/login`: Requires `email`, `password`. Verified to return 401 on incorrect credentials. Stores token in `localStorage`.
- `GET /api/auth/me`: Requires `Authorization: Bearer <token>`. Verified to return 401 when token is omitted.

---

## 4. Development & Build Commands

Inside `c:\Users\91959\OneDrive\Desktop\Ecosort_gdg\ecosort-frontend`:

```bash
# Start development server
npm run dev

# Run production build
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## 5. Deployment Guidelines (Vercel)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL=https://ecosort-ai-u1ln.onrender.com`
- **SPA Routing:** Add a standard `vercel.json` rewrite (`/*` -> `/index.html`) to ensure React Router paths don't 404 on refresh.
- **Backend CORS:** The backend on Render must configure `FRONTEND_ORIGIN` to accept the deployed Vercel domain.
