# NESUBS MVP (Phase 1)

Next.js + Prisma + SQLite full-stack app for gaming top-ups and subscriptions.

## Setup

1. Copy `.env.example` to `.env`.
2. Install: `npm install`
3. Generate DB client: `npm run db:generate`
4. Push schema: `npm run db:push`
5. Seed sample data: `npm run db:seed`
6. Run app: `npm run dev`

## Access

- User site: `/`
- Admin login: `/admin/login`
  - Username: `admin`
  - Password: `admin66551100`

## Troubleshooting

If you see an npm peer dependency conflict mentioning `eslint-config-next@14.2.16`, update/install with a compatible ESLint major:

```bash
npm install
```

This repository pins `eslint` to `^8.57.0`, which is compatible with `eslint-config-next@14.2.16`.
