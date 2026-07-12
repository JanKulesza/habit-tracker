# Streak Habit Tracker

Streak is a modern Next.js application for building and tracking daily habits. It combines a polished dashboard, habit management, streak tracking, analytics, and secure authentication.

[Live demo](https://streakatomictracker.vercel.app/)

## Features

- User authentication with email/password and Google sign-in
- Protected dashboard with habit progress, streaks, weekly summaries and activity heatmap
- Create, edit and delete habits
- Daily habit check-in with completion tracking
- Detailed habit statistics and charts
- Settings page with account management and appearance controls
- Prisma + PostgreSQL backend with Better Auth integration

## Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better%20Auth-4D4D4D?style=for-the-badge&logo=better-auth&logoColor=white" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/Zustand-ff7a00?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/date-fns-5A67D8?style=for-the-badge&logo=date-fns&logoColor=white" alt="date-fns" />
</p>

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Install dependencies

```bash
npm install
```

### Environment setup

Copy the template env file and add your credentials:

```bash
cp .env.template .env
```

Update `.env` with:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_GOOGLE_ID` — Google OAuth client ID
- `AUTH_GOOGLE_SECRET` — Google OAuth client secret
- `NEXT_PUBLIC_DOMAIN_NAME` & `BETTER_AUTH_URL` — app base URL, for example `http://localhost:3000`
- `BETTER_AUTH_SECRET` — secret for authentication
- `PRISMA_SEED_EMAIL` — optional seed user email if you run the seed script

### Database setup

Generate Prisma client types:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database (if needed):

```bash
npx prisma db seed
```

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — generate Prisma client and build production app
- `npm run start` — start the production server
- `npm run lint` — run ESLint

## Project Structure

```text
habit-tracker/
├── app/            # Next.js app router pages and API routes
├── components/     # Reusable UI components and page sections
├── hooks/          # Custom React hooks
├── lib/            # Shared utilities, auth, Prisma and DAL logic
├── prisma/         # Prisma schema, migrations and seed data
├── public/         # Static assets
├── .env.template   # Environment variables template
├── package.json    # Project scripts and dependencies
└── README.md       # Project documentation
```

### Architecture highlights
- **Data Access Layer (DAL)** — centralized, cached (`React.cache`) database reads with authorization built in
- **Server Functions over REST** — mutations are typed functions, not hand-rolled API endpoints, using a consistent `ActionResult<T>` return type
- **Two-layer route protection** — `proxy.ts` for fast, optimistic redirects; `requireSession()` in the dashboard layout for real, database-backed session validation
- **Optimistic UI** — habit toggling and deletion update the UI immediately and roll back automatically if the server call fails
- **Zustand with selectors** — components subscribe only to the slice of state they need, avoiding unnecessary re-renders

## Authentication

- Uses `better-auth` with Prisma adapter
- Supports email/password registration and login
- Includes Google social sign-in
- Protects dashboard routes with middleware and session cookies

## Deployment

This project is deployed at: https://streakatomictracker.vercel.app/

## Future improvements

These are planned enhancements for the next release cycles:

- **Translations** — multi-language support for the UI, including Polish and English.
- **Email verification** — email confirmation during registration to improve security.
- **Mobile app** — React Native mobile version for quick check-ins on the go.
- **Reports** — generate and export detailed stats for weekly, monthly and custom periods.
- **Error pages** — create error and not found pages 

## Notes

- Remove any sensitive values from `.env` before sharing or committing.
- The app uses `proxy.ts` to redirect unauthenticated users to `/login` and authenticated users away from `/login` and `/register`.
