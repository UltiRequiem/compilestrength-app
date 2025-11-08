# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CompileStrength is a full-stack fitness application with an AI-powered workout programming system and terminal-inspired aesthetic. Built with Next.js 15, deployed on Cloudflare Workers.

## Core Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TailwindCSS v4
- **Backend**: Cloudflare Workers with Node.js compatibility
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with Prisma adapter
- **AI**: Mastra framework with OpenAI integration
- **Deployment**: OpenNext.js for Cloudflare Workers

### Key Directory Structure
- `src/app/` - Next.js 15 App Router pages and API routes
- `src/components/` - React components (UI components in `ui/` subdirectory)
- `src/lib/` - Core utilities (auth, utils, client configs)
- `src/agents/` - AI agent implementations using Mastra
- `prisma/` - Database schema and migrations
- `src/generated/prisma/` - Generated Prisma client (custom output path)

### Database Schema
The application has comprehensive workout tracking models:
- User management via Better Auth (user, session, account models)
- Workout Programs with configurable days and exercises
- Exercise library with muscle groups and equipment types
- Workout sessions with set tracking and RPE
- Personal records and user preferences

### Authentication Flow
- Better Auth handles email/password authentication
- Prisma adapter connects to PostgreSQL database
- Session management integrated with Next.js middleware
- Auth utilities in `src/lib/auth-client.ts` and `src/lib/auth-utils.ts`

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
bunx prisma migrate dev    # Run database migrations
bunx prisma db push       # Push schema changes without migration
bunx prisma generate      # Regenerate Prisma client
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
1. Copy `.dev.vars.example` to `.dev.vars` for local development
2. Use `wrangler secret put` for production secrets
3. Set `NEXT_PUBLIC_*` variables at build time for deployment

## Cloudflare Workers Specific

### Configuration
- Uses `nodejs_compat` compatibility flag
- OpenNext.js adapter for Cloudflare deployment
- Assets served from `.open-next/assets`
- Worker script at `.open-next/worker.js`

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
- Prisma provides database type safety

## AI Integration

### Mastra Framework
- Weather agent example in `src/agents/weatherAgent.ts`
- Chat API endpoint at `src/app/api/chat/route.ts`
- Uses AI SDK React for streaming responses

## Testing

No specific test framework is configured. Check with the user for preferred testing approach before adding tests.