# TasmaFive — Frontend (Next.js) + Backend (Node/Express + MongoDB)

```
tasmafive-website/
├── frontend/   # Next.js UI (animations / layout unchanged)
└── server/     # Express API + MongoDB Atlas

../admin/        # Separate Next.js admin application
```

AI chatbot = **tawk.to** (frontend script only — koi custom chat backend nahi).

## Run locally (3 terminals)

**Terminal 1 — Express + MongoDB**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Next.js**
```bash
cd frontend
npm run dev
```

Open http://localhost:3000  
`/api/*` → `http://localhost:8080` (Express).

**Terminal 3 — Admin**
```bash
cd ../admin
npm run dev
```

Open http://localhost:3001

## MongoDB (`tasmafiveDB`)

| Collection | Data |
|------------|------|
| `users` | Signup / login |
| `otps` | OTP hashes |
| `activities` | Login / signup / admin events |
| `contactmessages` | Contact form |
| `quoterequests` | Quote form |
| `auditrequests` | Audit form |
| `services` | CMS service overrides and additions |
| `projects` | CMS projects |

UI / animations / layout: **unchanged**.

## Private admin database (`tasmafiveAdminDB`)

Admin identities and admin audit logs use a separate MongoDB database while
the dashboard reads customer/content data from the shared `tasmafiveDB`.

Local fallback credentials are `admin@gmail.com` / `admin`. Production startup
rejects these defaults: set strong `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` values in `server/.env`.
