# CompileStrength

**Live Site:** [compilestrength.com](https://compilestrength.com)

A full-stack fitness application with AI-powered workout programming designed
for science-based lifters. Built with Next.js 15 and deployed on Cloudflare
Workers.

## Tech Stack

- **Package Manager:** Bun (with bun.lock)
- **Frontend:** Next.js 15 (App Router) with React 19
- **Styling:** TailwindCSS v4
- **State Management:** Zustand for global client state (user preferences)
- **Backend:** Cloudflare Workers (serverless)
- **Database:** Neon PostgreSQL (serverless Postgres)
- **ORM:** Drizzle ORM with @neondatabase/serverless driver
- **Database Connection:** HTTP-based driver optimized for edge runtimes (not
  WebSocket)
- **Authentication:** Better Auth Cloudflare with geolocation tracking
- **Billing:** LemonSqueezy for subscription management
- **AI:** Mastra framework with OpenAI integration
- **Code Quality:** Biome for formatting and linting, ESLint for additional
  checks
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

### Global State Management

- User preferences (weight units, rest timers, training goals) managed via
  Zustand
- Automatic weight unit conversion between lbs and kg across the entire app
- Session-safe state that resets when users switch accounts
- SSR-compatible implementation following Next.js best practices

## Environment Variables

This application requires the following environment variables:

### Required Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth (min 32 characters)
- `BETTER_AUTH_URL` - Base URL for auth (e.g., `https://compilestrength.com`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Public auth URL (e.g.,
  `https://compilestrength.com`)

### Optional Variables

- `OPENAI_API_KEY` - For AI workout generation features
- `LEMONSQUEEZY_API_KEY` - For subscription billing
- `LEMONSQUEEZY_STORE_ID` - Your LemonSqueezy store ID
- `LEMONSQUEEZY_WEBHOOK_SECRET` - For webhook signature verification
- `NGROK_DOMAIN` - For local webhook testing (e.g.,
  `your-subdomain.ngrok-free.app`)

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

3. Install dependencies:

```bash
bun install
```

4. Run the development server:

```bash
bun dev
# or
npm run dev
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

Deployed to Cloudflare Workers at
[compilestrength.com](https://compilestrength.com)

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

**Note:** This project uses **Bun** as the primary package manager. You can use
either `npm` or `bun` for most commands.

```bash
# Development
npm run dev          # Start Next.js dev server
bun dev              # Start Next.js dev server (using Bun)
npm run preview      # Build and preview with Cloudflare Workers locally

# Production
npm run build        # Build for production
npm run deploy       # Deploy to Cloudflare Workers

# Database
bunx drizzle-kit push              # Push schema changes
bunx drizzle-kit generate          # Generate migrations
bunx drizzle-kit migrate           # Run migrations
bunx drizzle-kit studio            # Open database GUI
bun run scripts/reset-db.ts        # Reset database (DEV ONLY)
npx @better-auth/cli generate      # Regenerate auth schema

# Code Quality
npm run lint         # Run ESLint
npm run check        # Build + TypeScript check
npm run biocheck     # Run Biome check with auto-fix
npm run fix          # Alias for Biome check with auto-fix
npm run format       # Format code with Biome (unsafe)
npm run format:check # Check code formatting
npm run cf-typegen   # Generate Cloudflare Types
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components (UI in ui/ subdirectory)
├── lib/              # Core utilities (auth, utils, configs)
├── stores/           # Zustand store definitions
│   └── user-preferences-store.ts  # Global user preferences with weight conversion
├── providers/        # React context providers and Zustand store providers
│   └── user-preferences-store-provider.tsx  # SSR-safe Zustand provider
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
- **Database:** Neon PostgreSQL with `@neondatabase/serverless` driver
  (HTTP-based)
  - Uses HTTP transport instead of WebSocket for reliability in Workers
  - No connection pooling needed - lightweight HTTP requests
  - Avoids 30s timeout issues common with traditional Postgres drivers
- **Auth:** Better Auth Cloudflare with automatic geolocation tracking

## Getting Started for New Developers

👋 **New to the project?** Start with our comprehensive onboarding guide:

**[📚 ONBOARDING.md](docs/ONBOARDING.md)** - Complete setup guide for new
engineers

This guide covers:

- Development environment setup
- Project architecture overview
- Common development tasks
- Code quality standards
- Troubleshooting tips

### Quick Reference

- **Architecture Details**: [CLAUDE.md](CLAUDE.md) - Comprehensive project
  documentation
- **Design System**: [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Brand
  guidelines and UI patterns
- **Billing Setup**: [docs/LEMONSQUEEZY_SETUP.md](docs/LEMONSQUEEZY_SETUP.md) -
  Subscription integration
- **Webhook Testing**: [docs/NGROK_SETUP.md](docs/NGROK_SETUP.md) - Local
  webhook development

## Contributing

This is a personal fitness tracking application. If you'd like to contribute or
have suggestions, please open an issue.

## License

Private project - All rights reserved.
