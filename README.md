# Portfolio Frontend

React frontend for the [Ritik Saluja portfolio](../README.md). Built with **TanStack Router + Tailwind CSS v4 + shadcn/ui**.

---

## ⚙️ Tech Stack

- **Framework** — React 19 + TanStack Start
- **Router** — TanStack Router (file-based)
- **Styling** — Tailwind CSS v4 + tw-animate-css
- **UI Components** — shadcn/ui (Radix UI primitives)
- **Forms** — React Hook Form + Zod
- **Icons** — Lucide React
- **Build Tool** — Vite 7
- **Language** — TypeScript

---

## 📁 Structure

```
src/
├── assets/            # Project images (jpg)
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── contact-form   # Contact form with validation
│   ├── count-up       # Animated number counter
│   └── reveal         # Scroll-reveal animation wrapper
├── hooks/
│   ├── use-in-view    # Intersection Observer hook
│   ├── use-mobile     # Responsive breakpoint hook
│   └── use-typewriter # Typewriter effect hook
├── lib/
│   ├── api/           # API helper functions
│   └── utils.ts       # cn() utility
├── routes/
│   ├── __root.tsx     # App shell / layout
│   ├── index.tsx      # Home page (/)
│   └── admin.tsx      # Admin panel (/admin)
├── styles.css         # Global styles & design tokens
└── main.tsx           # Entry point
```

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment
cp .env.example .env

# 3. Start dev server
npm run dev            # http://localhost:3000
```

> Make sure the backend is running on `http://localhost:5000` or update `VITE_API_URL` in `.env`.

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Auto-format with Prettier |

---

## 🎨 Design Tokens

Defined in `src/styles.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand` | `#4F46E5` | Indigo — primary accent |
| `--color-accent-green` | `#16A34A` | Green — secondary accent |
| `--color-bg` | `#FCFDFE` | Page background |
| `--color-text-dim` | `#64748B` | Muted text |
| `--font-mono` | JetBrains Mono | Code / labels |
| `--font-sans` | Inter | Body text |

---

## 🗺️ Pages & Routes

| File | URL | Description |
|------|-----|-------------|
| `routes/index.tsx` | `/` | Main portfolio page |
| `routes/admin.tsx` | `/admin` | Protected admin panel |

### Home Page Sections
1. **Hero** — Typewriter name animation + role tags
2. **About** — Bio, stats, skill bars, expertise grid
3. **Stack** — Infrastructure & tech cards (Orchestration, Cloud, App Layer, React Native)
4. **Work** — Project showcase grid
5. **Contact** — Contact form + direct info

---

## 🔐 Environment Variables

```env
# Optional — defaults to http://localhost:5000
VITE_API_URL=http://localhost:5000
```

> Copy `.env.example` to `.env` — never commit `.env`.
