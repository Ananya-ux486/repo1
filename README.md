# TasmaFive public application

This repository is one single-root full-stack Node application. Next.js uses
root `src/`, `public/` and configuration files. The Express API is an internal
module under `src/server-api/`. `unified-server.mjs` sends `/api` requests to
Express and everything else to Next.js through one process and one public port.
The separate `admin` repository owns `/api/admin/*`.

## Local development

Use Node.js `20.19+` or `22.13+`. Copy `.env.example` to `.env`, place optional
browser-only overrides in `.env.local`, then run:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Useful root commands are `npm run lint`,
`npm test`, `npm run build`, and `npm run start`. Host environment variables
take precedence over `.env`.

## Data ownership

The public API and admin API use the same shared Mongo database for users,
leads, CMS content, payment records and payment links. Only the admin API
connects to the private admin database.

## Hostinger production deployment

Create one Hostinger Node.js application with the repository root
(`tasmafive-website`) as its application root:

- Node.js: `20.19+` or `22.13+`
- Install: `npm ci`
- Build: `npm run build`
- Start: `npm run start`
- Domain: the public HTTPS origin

Configure the variables listed in root `.env.example` in Hostinger. Do not set
a fixed `PORT`; Hostinger injects it. Set `PUBLIC_SITE_URL`, `API_PUBLIC_URL`
and `ALLOWED_ORIGINS` to the intended HTTPS origin(s), and configure provider
callbacks/webhooks on that same domain. `NEXT_PUBLIC_*` values must be present
at build time.

TLS terminates at Hostinger and the application trusts one proxy hop. The host
must support a long-running custom Node start command; static-only or
Next-managed hosting is insufficient. Never run `npm run dev` in production or
commit real `.env` files.
