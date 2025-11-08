# CompileStrength

**Live Site:** [compilestrength.com](https://compilestrength.com)

A full-stack fitness application with AI-powered workout programming and a terminal-inspired aesthetic. Built with Next.js 15 and deployed on Cloudflare Workers.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) with React 19
- **Styling:** TailwindCSS v4
- **Backend:** Cloudflare Workers (serverless)
- **Database:** Neon PostgreSQL (serverless Postgres)
- **ORM:** Drizzle ORM with @neondatabase/serverless driver
- **Database Connection:** HTTP-based driver optimized for edge runtimes (not WebSocket)
- **Authentication:** Better Auth Cloudflare with geolocation tracking
- **AI:** Mastra framework with OpenAI integration
- **Deployment:** OpenNext.js adapter for Cloudflare Workers

## Features

### Authentication
- Email/password authentication via Better Auth
- Automatic session geolocation tracking (IP, city, country, timezone)
- Cloudflare IP detection for security
- Protected routes with Next.js middleware

### Workout Management
- AI-powered workout program generation
- Exercise library with muscle groups and equipment types
- Workout session tracking with RPE (Rate of Perceived Exertion)
- Personal records tracking
- User preferences and customization

## Environment Variables

This application requires the following environment variables:

### Required Variables
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth (min 32 characters)
- `BETTER_AUTH_URL` - Base URL for auth (e.g., `https://compilestrength.com`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Public auth URL (e.g., `https://compilestrength.com`)
- `OPENAI_API_KEY` - (Optional) For AI workout generation features

### Local Development

1. Copy `.env.example` to `.env` (if it exists) or create a `.env` file
2. Add your environment variables:
```env
DATABASE_URL="postgresql://user:pass@your-neon-host.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-32-char-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```
3. Run the development server:
```bash
npm run dev
# or
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Database Setup

The project uses Drizzle ORM with Neon PostgreSQL:

```bash
# Push schema to database
bunx drizzle-kit push

# Open Drizzle Studio (database GUI)
bunx drizzle-kit studio

# Generate auth schema (if auth config changes)
npx @better-auth/cli generate --config src/lib/auth.ts --output src/db/auth.schema.ts -y
```

## Production Deployment

Deployed to Cloudflare Workers at [compilestrength.com](https://compilestrength.com)

### First-Time Deployment

1. **Set public variables in `wrangler.jsonc`** (already configured):
```jsonc
{
  "vars": {
    "BETTER_AUTH_URL": "https://compilestrength.com",
    "NEXT_PUBLIC_BETTER_AUTH_URL": "https://compilestrength.com"
  }
}
```

2. **Deploy the worker:**
```bash
npm run deploy
# or
bun run deploy
```

3. **Set secrets in Cloudflare** (after first deployment):
```bash
# Database connection
echo "your-neon-postgres-url" | npx wrangler secret put DATABASE_URL

# Auth secret
echo "your-32-char-secret" | npx wrangler secret put BETTER_AUTH_SECRET

# OpenAI API key (optional)
echo "sk-..." | npx wrangler secret put OPENAI_API_KEY
```

### Subsequent Deployments

Just run:
```bash
npm run deploy
```

Secrets persist across deployments. You only need to update them if they change.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npm run preview      # Build and preview with Cloudflare Workers locally

# Production
npm run build        # Build for production
npm run deploy       # Deploy to Cloudflare Workers

# Database
bunx drizzle-kit push              # Push schema changes
bunx drizzle-kit studio            # Open database GUI
bun run scripts/reset-db.ts        # Reset database (DEV ONLY)

# Code Quality
npm run lint         # Run ESLint
npm run check        # Build + TypeScript check
npm run cf-typegen   # Generate Cloudflare Types
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components (UI in ui/ subdirectory)
├── lib/              # Core utilities (auth, utils, configs)
├── db/               # Drizzle ORM schema and database connection
│   ├── schema.ts           # Complete database schema
│   ├── auth.schema.ts      # Better Auth generated schema
│   └── index.ts            # Database connection utilities
├── agents/           # AI agent implementations (Mastra)
└── hooks/            # Custom React hooks
```

## Database Schema

- **Auth Tables:** users, sessions, accounts, verifications (via Better Auth)
- **Workout Tables:** WorkoutProgram, WorkoutDay, Exercise, ProgramExercise
- **Tracking Tables:** WorkoutSession, WorkoutSet, PersonalRecord
- **User Tables:** UserPreferences

All tables use Drizzle ORM with full TypeScript type inference.

## Cloudflare Workers Configuration

- **Runtime:** Node.js compatibility mode (`nodejs_compat` flag)
- **Adapter:** OpenNext.js for Next.js → Cloudflare Workers
- **Assets:** Static files served from Cloudflare Assets
- **Database:** Neon PostgreSQL with `@neondatabase/serverless` driver (HTTP-based)
  - Uses HTTP transport instead of WebSocket for reliability in Workers
  - No connection pooling needed - lightweight HTTP requests
  - Avoids 30s timeout issues common with traditional Postgres drivers
- **Auth:** Better Auth Cloudflare with automatic geolocation tracking

## Contributing

This is a personal fitness tracking application. If you'd like to contribute or have suggestions, please open an issue.

## License

Private project - All rights reserved.
