# Nuxt Elysia Starter

A modern full-stack starter template combining [Nuxt 4](https://nuxt.com) for the frontend and [Elysia](https://elysiajs.com) for the backend API. This template provides a solid foundation for building type-safe, high-performance web applications.

## Tech Stack

- 🚀 [Nuxt](https://nuxt.com) v4.2.0
- ⚡️ [Elysia](https://elysiajs.com) v1.4.13
- 🗃️ [Drizzle ORM](https://orm.drizzle.team) v0.44.7
- 🎨 [TailwindCSS](https://tailwindcss.com) v4.1.16 with [DaisyUI](https://daisyui.com) v5.3.10
- 🔧 [ESLint](https://eslint.org) v9.38.0 for code quality
- ⚛️ [Vue](https://vuejs.org) v3.5.22

## Features

- 🚀 [Nuxt 4](https://nuxt.com) - The Intuitive Web Framework
- ⚡️ [Elysia](https://elysiajs.com) - TypeScript HTTP Framework for Bun
- 🗃️ [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- 🔒 Type-safe database operations
- 📝 Automatic API route generation
- 🎨 TailwindCSS for styling
- ⚙️ ESLint + TypeScript for code quality

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18.x
- Database (PostgreSQL recommended)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Database Management

### Migrations

To generate and run database migrations with Drizzle:

```bash
# Generate migrations
bun run db:generate

# Push migrations to database
bun run db:push

# Run database seed
bun run db:seed

# Start Drizzle Studio (Database GUI)
bun run db:studio

# Setup database (push + seed)
bun run db
```

The migration files will be stored in `server/db/migrations/`.

### Database Schema

The database schema is defined in `server/db/schema.ts`. After making changes to the schema:

1. Generate a new migration
2. Review the generated SQL in the migrations folder
3. Push the changes to your database

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
