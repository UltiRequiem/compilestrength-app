# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CompileStrength is a full-stack fitness application with an AI-powered workout programming system and terminal-inspired aesthetic. Built with Next.js 15, deployed on Cloudflare Workers.

## Core Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TailwindCSS v4
- **Backend**: Cloudflare Workers with Node.js compatibility
- **Database**: Neon PostgreSQL (serverless) with Drizzle ORM
- **Database Driver**: @neondatabase/serverless (HTTP-based, optimized for Workers)
- **Authentication**: Better Auth Cloudflare with Drizzle adapter
- **AI**: Mastra framework with OpenAI integration
- **Deployment**: OpenNext.js for Cloudflare Workers

### Key Directory Structure
- `src/app/` - Next.js 15 App Router pages and API routes
- `src/components/` - React components (UI components in `ui/` subdirectory)
- `src/lib/` - Core utilities (auth, utils, client configs)
- `src/agents/` - AI agent implementations using Mastra
- `src/db/` - Drizzle ORM schema and database connection
  - `schema.ts` - Complete database schema including auth tables
  - `auth.schema.ts` - Better Auth generated schema
  - `index.ts` - Database connection utilities

### Database Schema
The application has comprehensive workout tracking models:
- User management via Better Auth (user, session, account models)
- Workout Programs with configurable days and exercises
- Exercise library with muscle groups and equipment types
- Workout sessions with set tracking and RPE
- Personal records and user preferences

### Authentication Flow
- Better Auth Cloudflare handles email/password authentication
- Drizzle ORM adapter connects to PostgreSQL database
- Automatic geolocation tracking in sessions (via Cloudflare)
- Session management integrated with Next.js middleware
- Auth utilities in `src/lib/auth-client.ts` and `src/lib/auth-utils.ts`
- Cloudflare-specific features: IP detection, geolocation data

## Development Commands

### Essential Commands
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run check        # Build + TypeScript check
```

### Database Commands
```bash
bunx drizzle-kit push              # Push schema changes to database
bunx drizzle-kit generate          # Generate migrations
bunx drizzle-kit migrate           # Run migrations
bunx drizzle-kit studio            # Open Drizzle Studio (GUI)
bun run scripts/reset-db.ts        # Reset database (drops all tables)
npx @better-auth/cli generate      # Regenerate auth schema
```

### Deployment
```bash
npm run preview      # Build and preview with Cloudflare Workers
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Generate Cloudflare Types
```

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret (min 32 chars)
- `BETTER_AUTH_URL` - Base URL for auth
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Public auth URL
- `OPENAI_API_KEY` - Optional, for AI features

### Environment Setup
1. Use `.env` file for local development with Next.js
2. Use `wrangler secret put` for production secrets (after deployment)
3. Set `NEXT_PUBLIC_*` variables in `wrangler.jsonc` under `vars` section
4. Note: `.env` is used for local dev, secrets must be set in Cloudflare for production

## Cloudflare Workers Specific

### Configuration
- Uses `nodejs_compat` compatibility flag
- OpenNext.js adapter for Cloudflare deployment
- Assets served from `.open-next/assets`
- Worker script at `.open-next/worker.js`
- **Database Driver**: Uses @neondatabase/serverless with HTTP transport (not WebSocket)
  - This driver is specifically designed for serverless/edge runtimes
  - Avoids connection timeouts common with traditional PostgreSQL drivers in Workers
  - No connection pooling needed - each request creates a lightweight HTTP connection

### Deployment Process
1. OpenNext.js builds the application for Cloudflare
2. Static assets are uploaded to Cloudflare Assets
3. Worker handles dynamic requests with Node.js compatibility

## Code Conventions

### Component Structure
- Shadcn/ui components in `src/components/ui/`
- Page components in `src/app/` following App Router conventions
- Custom hooks in `src/hooks/`

### Styling
- TailwindCSS v4 with CSS-first configuration
- Dark mode enforced via `html` class in layout
- Component styling follows Shadcn/ui patterns

### Type Safety
- Strict TypeScript configuration
- Environment variables validated via @t3-oss/env-nextjs
- Drizzle ORM provides database type safety with full TypeScript inference

## AI Integration

### Mastra Framework
- Weather agent example in `src/agents/weatherAgent.ts`
- Chat API endpoint at `src/app/api/chat/route.ts`
- Uses AI SDK React for streaming responses

## Testing

No specific test framework is configured. Check with the user for preferred testing approach before adding tests.