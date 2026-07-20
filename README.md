# TasmaFive — Frontend (Next.js) + Backend (Rust)

```
tasmafive-website/
├── frontend/   # Next.js UI (animations, layout, pages — unchanged)
└── backend/    # Rust Axum API on port 8080
```

## Run locally (2 terminals)

**Terminal 1 — Rust API**
```bash
cd backend
cargo run
```

**Terminal 2 — Next.js**
```bash
cd frontend
npm run dev
```

Open http://localhost:3000  
API calls to `/api/*` are proxied to `http://localhost:8080`.

## tawk.to chatbot

- Custom “Need help?” bubble is unchanged.
- Conversations open in tawk.to (IDs in `frontend/.env.local`).
- Dashboard setup steps: see `docs/TAWK_SETUP.md`
- AI training text: see `docs/tawk-training-data.txt`

## Important

- Keep `AUTH_SECRET` the same in `frontend/.env.local` and `backend/.env`
- Data files live in `frontend/.data/`
- Do **not** re-add `frontend/src/app/api` — that would block the Rust proxy
