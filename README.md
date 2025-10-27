# Nuxt Elysia Starter

A modern full-stack starter template combining [Nuxt 4](https://nuxt.com) for the frontend and [Elysia](https://elysiajs.com) for the backend API. This template provides a solid foundation for building type-safe, high-performance web applications.

## Tech Stack

- 🚀 [Nuxt](https://nuxt.com) v4.2.0
- ⚡️ [Elysia](https://elysiajs.com) v1.4.13
- 📚 [@elysiajs/swagger](https://elysiajs.com/plugins/swagger) v1.3.1 - OpenAPI/Swagger documentation
- 🗃️ [Drizzle ORM](https://orm.drizzle.team) v0.44.7
- 💾 SQLite with [Bun SQLite](https://bun.sh/docs/api/sqlite)
- 🎨 [TailwindCSS](https://tailwindcss.com) v4.1.16 with [DaisyUI](https://daisyui.com) v5.3.10
- 🔧 [ESLint](https://eslint.org) v9.38.0 for code quality
- ⚛️ [Vue](https://vuejs.org) v3.5.22
- 🚦 [Lighthouse](https://github.com/GoogleChrome/lighthouse) v13.0.1 for performance testing
- 📦 [Terser](https://terser.org) v5.44.0 for code minification

## Features

- 🚀 [Nuxt 4](https://nuxt.com) - The Intuitive Web Framework
- ⚡️ [Elysia](https://elysiajs.com) - TypeScript HTTP Framework for Bun
- 📚 **OpenAPI/Swagger Documentation** - Interactive API documentation with automatic schema generation
- 🗃️ [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM with SQLite
- 🔒 **Type-safe operations** - TypeBox schema validation for API requests/responses
- 📝 Automatic API route generation with `nuxt-elysia`
- 🎨 **Modern UI** - TailwindCSS + DaisyUI with accessibility support
- ⚙️ **Code quality** - ESLint + TypeScript for maintainability
- 🚦 **100% Lighthouse scores** - Perfect performance, accessibility, SEO, and best practices
- ⚡️ **Performance optimizations** - Code splitting, minification, and tree-shaking
- ♿️ **WCAG compliant** - Full accessibility support with proper ARIA labels and semantic HTML
- 🧪 **Testing ready** - Vitest configuration with coverage support

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18.x (for Nuxt compatibility)
- SQLite database (included, no setup required)

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

## API Documentation

This project includes comprehensive OpenAPI/Swagger documentation powered by [@elysiajs/swagger](https://elysiajs.com/plugins/swagger).

### Accessing Documentation

Start the development or preview server, then visit:

- **Swagger UI**: `http://localhost:3000/_api/swagger`
- **OpenAPI JSON**: `http://localhost:3000/_api/swagger/json`

### Features

- 📚 **Interactive testing** - Try out API endpoints directly in the browser
- 🔍 **Schema validation** - TypeBox schemas ensure type safety
- 📝 **Auto-generated docs** - Documentation stays in sync with your code
- 🎯 **Request/Response examples** - See expected data formats

### API Endpoints

- `GET /_api/hello` - Simple hello world endpoint
- `GET /_api/members` - Get paginated members list
  - Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`
  - Returns: Members data with pagination metadata

### Example Usage

```bash
# Get first page of members
curl "http://localhost:3000/_api/members?page=1&limit=10"

# Search members
curl "http://localhost:3000/_api/members?search=john"

# Sort by age descending
curl "http://localhost:3000/_api/members?sortBy=age&sortOrder=desc"
```

## Performance Testing

This project achieves **100% scores across all Lighthouse metrics**:

- ⚡ **Performance**: 100/100
- ♿ **Accessibility**: 100/100
- ✅ **Best Practices**: 100/100
- 🔍 **SEO**: 100/100

### Running Lighthouse Tests

```bash
# Build the application first
bun run build

# Start preview server (in one terminal)
bun run preview

# Run Lighthouse audit (in another terminal)
bun run lighthouse:preview
```

### Lighthouse Reports

After running tests, reports are saved to `lighthouse-reports/`:

- `report.html` - Visual report (open in browser)
- `report.json` - Detailed JSON data for analysis

### Performance Optimizations

The following optimizations are implemented:

- 📦 **Code splitting** - Vendor chunks separated for better caching
- 🗜️ **Minification** - Terser minification with console removal
- 🌳 **Tree shaking** - Dead code elimination
- 🎯 **CSS optimization** - CSS code splitting enabled
- 🔗 **Resource hints** - DNS prefetch for faster loading
- ♿ **Accessibility** - Semantic HTML, ARIA labels, proper landmarks
- 📱 **SEO** - Meta tags, proper title, description

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
