# ProfAI API

Production-grade Express + TypeScript backend for ProfAI.

## Stack
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT access + refresh tokens
- Zod validation
- bcrypt password hashing
- Helmet + rate limiting

## Project Layout

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── index.ts
└── docs/
    └── API.md
```

## Environment
Create `.env` from `.env.example`.

Required variables:
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `CORS_ORIGIN`
- `PORT`
- `GOOGLE_CLIENT_ID`

## Local Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Generate Prisma client:
```bash
npm run prisma:generate
```

3. Run migrations:
```bash
npm run prisma:migrate
```

4. Seed database:
```bash
npm run db:seed
```

5. Start API:
```bash
npm run dev
```

API base URL: `http://localhost:5001/api/v1`

## Production Deployment

### Railway / Render
1. Create PostgreSQL service.
2. Set backend environment variables from `.env.example`.
3. Build command:
```bash
npm install && npm run prisma:generate && npm run build
```
4. Start command:
```bash
npm run start
```
5. After deploy, run migrations:
```bash
npm run prisma:deploy
```

## Notes
- Scoring, XP, level progression, streaks, achievements, weekly activity, and leaderboard all run with real database logic.
- Admin-only test creation is protected by role-based access checks.
