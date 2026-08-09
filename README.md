# project-Mgt
A modern, full‑stack Project Management application built with React (Vite), Clerk for auth/organizations, an Express API with Prisma (Neon) for persistence, and Inngest for event sync.

---

## Quick overview
  <div style="font-family: SFMono-Regular,Menlo,Monaco,'Roboto Mono','Courier New',monospace;color:#cbd5e1;font-size:13px;padding:6px 10px;;">Tech & Languages</div>
  
- Frontend: React + Vite, Redux Toolkit
- Authentication & Organizations: Clerk
- Backend: Express.js
- Database: PostgreSQL / Neon via Prisma
- Event sync: Inngest (handles Clerk webhooks -> DB sync)
- Email: Nodemailer

---

## Features

- Sign in with Clerk
- Create / join organizations (workspaces)
- Create and manage projects, tasks, comments
- Membership invite flow
- Background event syncing (Clerk → Inngest → Prisma)

---

## Repo layout

- `client/` — React frontend (Vite)
- `server/` — Express API, Prisma, Inngest functions
- `server/prisma/` — Prisma schema and migrations

---

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or Neon) database
- Clerk account (for auth & organization management)

---

## Environment variables

Create `.env` files in `server/` and `client/`.

server/.env (example)

```bash
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
DIRECT_URL="postgresql://..." # optional (shadow DB)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=supersecret
SENDER_EMAIL=you@example.com
CLERK_API_KEY=sk_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
```

client/.env (example)

```bash
VITE_BASEURL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=pk_xxx
```

---

## Local setup

1. Install dependencies:

```bash
# server
cd server
npm install

# client
cd ../client
npm install
```

2. Generate Prisma client and run migrations (server):

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

3. Start both apps (in separate terminals):

```bash
# server
cd server
npm run dev

# client
cd client
npm run dev
```

Default ports used in development:
- Client: `http://localhost:5173`
- Server: `http://localhost:4000`

---

## Important endpoints

- API: `GET /api/workspaces` — returns workspaces for the current user
- Inngest endpoint: `POST /api/inngest` — Clerk webhook events are served here

---

## Common issues & troubleshooting

- Problem: After creating an organization in Clerk the app still shows the Create Organization view (infinite loop)
  - Cause: Clerk organization was created but the backend DB record didn't exist (webhook not delivered or processed), or the frontend called `GET /api/workspaces` before the workspace was synced. The project includes Inngest functions that create `workspace` rows on `clerk/organization.created`, but the webhook must be reachable and configured.
  - Check:
    - Server logs for Inngest handler activity
    - Clerk webhook delivery status (Clerk dashboard)
    - Database: `workspace` and `workspaceMember` rows
    - Browser network tab: ensure `GET /api/workspaces` returns the correct data

- Problem: Prisma generate / migrate fails
  - Ensure `DATABASE_URL` is set and reachable. For Neon, use the Neon connection string.

---

## Contributing

1. Create a branch: `git checkout -b feat/your-feature`
2. Make changes and test locally
3. Open a PR against `main`

---

## Next (I can add these)

- Add CI workflow to run lint and tests
- Add a small architecture diagram and screenshots to the README
