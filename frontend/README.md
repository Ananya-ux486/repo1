# TasmaFive Solutions Website

Next.js website for **TasmaFive Solutions LLP** — ready for GitHub clone and Hostinger deploy.

## Requirements

- Node.js **20+** (recommended LTS)
- npm

## Setup (any desktop after clone)

```bash
git clone https://github.com/Ananya-ux486/repo1.git
cd repo1
npm install
npm run dev
```

Open http://localhost:3000

## Production build (test before Hostinger)

```bash
npm run build
npm run start
```

For a production-like speed check after clone, always use `npm run build && npm run start` — `npm run dev` is slower by design.

Optional (already-optimized assets ship in repo):

```bash
npm run optimize:images
```

## Images

All website images are **local** under `public/images/` (logo, hero, projects, industries, blog, about, Instagram, flags, live project screenshots).

- Registry: `src/data/images.ts`
- Manifest: `public/images/manifest.json`

Do **not** delete `public/images` before deploy — Hostinger needs these files in the repo.

## Environment (optional)

Copy `.env.example` to `.env.local` only if you use email/Instagram APIs. The site runs without API keys.

## Hostinger deploy (via GitHub)

1. Push this repo to GitHub (VS Code Source Control → Commit → Push / Sync).
2. In Hostinger connect the Git repository.
3. Build: `npm install && npm run build`
4. Start: `npm run start`
5. Use Node **20.x**
6. After deploy, hard-refresh and verify Home, Services, Contact, and images.

## Notes

- Certificates page is a temporary placeholder (update later).
- Animations and layouts are in the codebase — no external animation CDN required.
