# SIGNAL://AYISHAT — Developer Portfolio

A cinematic, interactive developer portfolio built with SvelteKit. Dark tech-noir aesthetic with a terminal boot sequence, GSAP-powered horizontal project scroll, interactive terminal overlay, Three.js particle field, and smooth Lenis scroll.

## Setup

```bash
git clone <your-repo-url>
cd ayishat-portfolio
npm install
cp .env.example .env
# Edit .env with your Formspree endpoint
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Drop Your Assets

Before deploying, add these files:

```
static/
├── resume.pdf          ← Your PDF resume
└── images/
    └── avatar.jpg      ← Profile photo (optional, replaces geometric placeholder)
```

## Environment Variables

No environment variables are required. The Formspree endpoint is configured directly in `src/lib/components/sections/Contact.svelte`.

To use a different Formspree form, update the endpoint constant in that file:
```ts
const PUBLIC_FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id';
```

## Architecture

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           — Cursor, Noise, MagneticButton, SectionLabel, ThemeToggle, ScrollProgress
│   │   ├── sections/     — BootScreen, Hero, About, Projects, Skills, Experience, Contact
│   │   ├── Navbar.svelte
│   │   └── Terminal.svelte
│   ├── data/             — projects.ts, skills.ts, experience.ts
│   ├── stores/           — theme.ts, terminal.ts, boot.ts
│   └── utils/            — terminal-commands.ts
└── routes/
    ├── +layout.svelte    — Lenis, Cursor, Noise, Terminal, Navbar
    ├── +layout.ts        — prerender = true
    └── +page.svelte      — Section composition
```

## Animation Decisions

| Feature | Approach | Why |
|---|---|---|
| Smooth scroll | Lenis + GSAP ticker | Best performance, works with ScrollTrigger |
| Horizontal projects | GSAP ScrollTrigger `pin` | Native scroll feel, no library overhead |
| Section reveals | GSAP ScrollTrigger stagger | Consistent, cancellable, SSR-safe |
| SVG timeline draw | `stroke-dashoffset` via GSAP scrub | Smooth proportional to scroll position |
| Text glitch | CSS `@keyframes` + `clip-path` | Zero JS cost, pure GPU |
| Film grain | SVG `feTurbulence` + CSS animation | No canvas overhead |
| 3D particles | Three.js `BufferGeometry` Points | Hardware accelerated, minimal geometry |
| Boot sequence | `requestAnimationFrame` + `setTimeout` | No dependencies, fully controllable |
| Magnetic buttons | `mousemove` + CSS `transform` | Simple, no library needed |
| Number counters | GSAP tween `onUpdate` | Smooth easing, cancelable |

All GSAP and Three.js code is dynamically imported inside `onMount` — they never run on the server (SSR-safe) and are excluded from the initial bundle.

## Performance Optimizations

- **Static pre-rendering** (`prerender = true`) — zero cold starts, CDN-cacheable
- **Dynamic imports** for GSAP + Three.js — loaded only on client after hydration
- **Lenis smooth scroll** — replaces layout-thrashing CSS `scroll-behavior: smooth`
- **`will-change: transform`** on animated elements — promotes to compositor layer
- **`passive: true`** scroll listeners — never blocks scroll thread
- **`prefers-reduced-motion`** — CSS disables all transitions/keyframes; GSAP timeline runs at 1000x speed (effectively instant) via `gsap.globalTimeline.timeScale(1000)`
- **No external icon libraries** — all SVGs inline (no network requests)
- **System font fallbacks** — Space Grotesk + DM Sans load progressively with `display=swap`

## Accessibility

- Skip-to-content link (first focusable element, visible on focus)
- Semantic HTML5: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`
- All icon-only buttons have `aria-label`
- Terminal: `role="dialog"`, `aria-modal`, focus trap, Escape to close
- Mobile menu: `aria-expanded`, focus trap
- All images have `alt` text
- Color contrast: `--accent` (#C16E3D) on `--bg-primary` (#0B1210) = **4.8:1** ✓ (WCAG AA)
- `prefers-reduced-motion` disables all animations
- Keyboard-navigable interactive terminal (↑/↓ history, Tab autocomplete)
- `aria-live` regions for terminal output and form status

## Interactive Terminal

Press `Ctrl+K` or click the terminal icon in the navbar.

Available commands:
```
whoami      experience  github
projects    contact     linkedin
skills      resume      twitter
help        clear       matrix (🐣)
exit / q
```

## Deployment (Vercel)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create ayishat-portfolio --public --source=. --push

# 2. Import at vercel.com
#    → New Project → select your repo → deploy

# 3. Add env variable in Vercel dashboard:
#    PUBLIC_FORMSPREE_ENDPOINT = https://formspree.io/f/your_form_id
```

## Trade-offs

| Decision | Trade-off |
|---|---|
| Horizontal scroll (desktop only) | Mobile falls back to vertical card stack — maintains UX quality on all devices |
| GSAP via dynamic import | Slightly delayed animation init (~50ms) in exchange for faster initial paint |
| Geometric avatar placeholder | User must replace with photo for personal touch |
| Formspree (free tier) | 50 submissions/month — sufficient for portfolio contact volume |
| `adapter-vercel` over `adapter-auto` | Explicit adapter is more reliable; auto-detection can fail if adapter isn't installed |

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 5 (Runes)
- **Styling:** TailwindCSS v4
- **Animations:** GSAP 3 + ScrollTrigger
- **Smooth Scroll:** Lenis
- **3D:** Three.js (hero particles)
- **Contact:** Formspree
- **Deploy:** Vercel
