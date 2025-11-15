# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

CompileStrength is a full-stack fitness application with an AI-powered workout
programming system designed for science-based lifters. Built with Next.js 15,
deployed on Cloudflare Workers.

**For design and branding guidelines, see
[docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md)**

## Core Architecture

### Tech Stack

- **Package Manager**: Bun (primary, with bun.lock file)
- **Frontend**: Next.js 15 with React 19, TailwindCSS v4
- **Backend**: Cloudflare Workers with Node.js compatibility
- **Database**: Neon PostgreSQL (serverless) with Drizzle ORM
- **Database Driver**: @neondatabase/serverless (HTTP-based, optimized for
  Workers)
- **Authentication**: Better Auth Cloudflare with Drizzle adapter
- **Billing**: LemonSqueezy for subscription management and webhooks
- **State Management**: Zustand for global client state (user preferences)
- **AI**: Mastra framework with OpenAI integration
- **Validation**: Zod for runtime schema validation and type inference
- **Code Quality**: Biome for formatting/linting, ESLint for additional checks
- **Deployment**: OpenNext.js for Cloudflare Workers

### Key Directory Structure

- `src/app/` - Next.js 15 App Router pages and API routes
  - `app/` - Protected dashboard routes (requires auth + subscription)
  - `tools/` - Public fitness calculators and utilities
  - `api/webhooks/lemonsqueezy/` - LemonSqueezy webhook endpoint
  - `actions/lemonsqueezy.ts` - Server actions for billing
- `src/components/` - React components
  - `ui/` - Shadcn/ui components
  - `billing/` - Subscription and billing components
  - `dashboard/` - Dashboard-specific components
- `src/lib/` - Core utilities
  - `auth-utils.ts` - Authentication helpers
  - `subscription-utils.ts` - Subscription status and validation
  - `lemonsqueezy-typeguards.ts` - Type guards for webhooks
  - `validation.ts` - Zod validation utilities and error handling
  - `date-transform.ts` - Type-safe date transformation utilities
- `src/config/` - Configuration files
  - `lemonsqueezy.ts` - LemonSqueezy SDK setup
- `src/agents/` - AI agent implementations using Mastra
- `src/stores/` - Zustand store definitions
  - `user-preferences-store.ts` - Global user preferences with weight conversion
    utilities
- `src/providers/` - React context providers and Zustand store providers
  - `user-preferences-store-provider.tsx` - SSR-safe Zustand provider with
    session handling
- `src/schemas/` - Zod validation schemas and inferred types
  - `workout.schemas.ts` - Workout-related validation schemas
  - `user.schemas.ts` - User and preferences schemas
  - `billing.schemas.ts` - LemonSqueezy billing schemas
  - `ai.schemas.ts` - AI chat and compiler schemas
  - `common.schemas.ts` - Common utility schemas
  - `index.ts` - Centralized schema exports
- `src/db/` - Drizzle ORM schema and database connection
  - `schema.ts` - Complete database schema including auth and billing tables
  - `auth.schema.ts` - Better Auth generated schema
  - `index.ts` - Database connection utilities

### Database Schema

The application has comprehensive workout tracking and billing models:

**Authentication & Users:**

- User management via Better Auth (user, session, account models)
- User preferences (units, rest timers, training goals)

**Workout Tracking:**

- Workout Programs with configurable days and exercises
- Exercise library with muscle groups and equipment types
- Workout sessions with set tracking and RPE
- Personal records and progression tracking

**Billing & Subscriptions (LemonSqueezy):**

- Plans table - Product/variant data synced from LemonSqueezy
- Subscriptions table - User subscription tracking with status
- WebhookEvents table - Webhook event logging and processing
- UsageTracking table - Track usage limits (compiles, edits, messages per
  period)

### Authentication Flow

- Better Auth Cloudflare handles email/password authentication
- Drizzle ORM adapter connects to PostgreSQL database
- Automatic geolocation tracking in sessions (via Cloudflare)
- Session management integrated with Next.js middleware
- Auth utilities in `src/lib/auth-client.ts` and `src/lib/auth-utils.ts`
- Cloudflare-specific features: IP detection, geolocation data

### Global State Management (Zustand)

- **Store Architecture**: Per-request stores following Next.js SSR best
  practices
- **User Preferences Store**: Manages units (lbs/kg), rest timers, training
  goals, experience level
- **Session-Safe**: Automatically resets preferences when users switch sessions
- **Weight Conversion**: Built-in utilities for converting between lbs and kg
  across the app
- **Provider Integration**: Wrapped in root layout for global access
- **Stable Selectors**: Uses pre-defined selectors to prevent SSR infinite loops

#### Key Implementation Details:

- Store created per-request in provider, not as global variable
- Automatic loading of user preferences from database on session change
- Smart reset logic prevents preference leakage between users
- Individual action hooks prevent object recreation issues
- Type-safe with full TypeScript inference

## Development Commands

**Note:** This project uses **Bun** as the primary package manager and runtime.
Commands can use either `npm` or `bun`.

### Essential Commands

```bash
bun dev              # Start Next.js development server (recommended)
npm run dev          # Start Next.js development server (alternative)
npm run build        # Build for production
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

### Code Quality Commands

```bash
npm run lint         # Run ESLint
npm run biocheck     # Run Biome check with auto-fix (recommended)
npm run fix          # Alias for biocheck
npm run format       # Format code with Biome (unsafe mode)
npm run format:check # Check code formatting without changes
npm run lint:biome   # Run Biome linter only
npm run lint:biome:fix # Run Biome linter with auto-fix
```

### Webhook Testing (Development)

```bash
npm run ngrok        # Start ngrok tunnel for webhook testing
```

To use ngrok for testing LemonSqueezy webhooks:

1. Add `NGROK_DOMAIN=your-subdomain.ngrok-free.app` to your `.env` file
2. Run `bun dev` in one terminal
3. Run `npm run ngrok` in another terminal
4. Configure LemonSqueezy webhook to:
   `https://your-subdomain.ngrok-free.app/api/webhooks/lemonsqueezy`

See [docs/NGROK_SETUP.md](docs/NGROK_SETUP.md) for detailed instructions.

### Deployment

```bash
npm run preview      # Build and preview with Cloudflare Workers
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Generate Cloudflare Types
```

## Validation System

### Zod Schema Validation

CompileStrength uses Zod for comprehensive runtime validation and TypeScript
type inference across all API endpoints and data models.

**Key Features:**

- Runtime request/response validation with detailed error messages
- Automatic TypeScript type inference from schemas
- Centralized schema definitions in `src/schemas/`
- Custom validation utilities and error handling
- Consistent API response format with structured error details

**Schema Organization:**

- `workout.schemas.ts` - Workout sessions, sets, programs, routines
- `user.schemas.ts` - User profiles and preferences
- `billing.schemas.ts` - LemonSqueezy subscription and billing data
- `ai.schemas.ts` - AI chat messages and compiler requests
- `common.schemas.ts` - Shared utilities (pagination, search, responses)

**API Validation Flow:**

1. All API endpoints validate request bodies using `validateRequest()`
2. Invalid requests return structured error responses with field-level details
3. Valid data is automatically typed according to schema
4. Responses follow consistent success/error format

**Example Usage:**

```typescript
// In API route
import { createWorkoutSetSchema } from "@/schemas";
import {
  createValidationErrorResponse,
  validateRequest,
  ValidationError,
} from "@/lib/validation";
import { transformTimestamps } from "@/lib/date-transform";

const body = await request.json();
const validatedData = validateRequest(createWorkoutSetSchema, body);
// validatedData is now fully typed according to schema

// Transform string dates to Date objects (type-safe)
const dataWithDates = transformTimestamps(validatedData);
```

**Type Inference:** Instead of manually defining interfaces, types are inferred
from Zod schemas:

```typescript
import type { CreateWorkoutSet, WorkoutSession } from "@/schemas";
// Types automatically derived from schema definitions
```

## Environment Configuration

### Required Environment Variables

**Authentication:**

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret (min 32 chars)
- `BETTER_AUTH_URL` - Base URL for auth (e.g., https://yourdomain.com)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Public auth URL

**LemonSqueezy Billing:**

- `LEMONSQUEEZY_API_KEY` - API key from LemonSqueezy settings
- `LEMONSQUEEZY_STORE_ID` - Your store ID from LemonSqueezy
- `LEMONSQUEEZY_WEBHOOK_SECRET` - Webhook signing secret
- `LEMONSQUEEZY_WEBHOOK_URL` - Optional, webhook URL for development

**Optional:**

- `OPENAI_API_KEY` - Optional, for AI workout compiler features
- `NGROK_DOMAIN` - Optional, your ngrok static domain for webhook testing (e.g.,
  `your-subdomain.ngrok-free.app`)

### Environment Setup

1. Use `.env` file for local development with Next.js
2. Use `wrangler secret put` for production secrets (after deployment)
3. Set `NEXT_PUBLIC_*` variables in `wrangler.jsonc` under `vars` section
4. Note: `.env` is used for local dev, secrets must be set in Cloudflare for
   production
5. For webhook testing, add `NGROK_DOMAIN` to `.env` and run `npm run ngrok`

## Cloudflare Workers Specific

### Configuration

- Uses `nodejs_compat` compatibility flag
- OpenNext.js adapter for Cloudflare deployment
- Assets served from `.open-next/assets`
- Worker script at `.open-next/worker.js`
- **Database Driver**: Uses @neondatabase/serverless with HTTP transport (not
  WebSocket)
  - This driver is specifically designed for serverless/edge runtimes
  - Avoids connection timeouts common with traditional PostgreSQL drivers in
    Workers
  - No connection pooling needed - each request creates a lightweight HTTP
    connection

### Deployment Process

1. OpenNext.js builds the application for Cloudflare
2. Static assets are uploaded to Cloudflare Assets
3. Worker handles dynamic requests with Node.js compatibility

## Code Conventions

### Component Structure

- Shadcn/ui components in `src/components/ui/`
- Page components in `src/app/` following App Router conventions
- Custom hooks in `src/hooks/`

### Toast Notifications

CompileStrength uses **Sonner** for non-blocking toast notifications:

- **Package**: `sonner` - Modern, customizable toast library
- **Setup**: `<Toaster />` component mounted in root layout
  (`src/app/layout.tsx`)
- **Usage**: Import `toast` from `"sonner"` and use `toast.error()`,
  `toast.success()`, etc.
- **Styling**: Automatically inherits dark mode from app theme

**Example Usage:**

```typescript
import { toast } from "sonner";

// Error notifications
toast.error("Failed to save workout");

// Success notifications
toast.success("Workout completed successfully");
```

**Never use `alert()` or `confirm()` dialogs** - always use toast notifications
for user feedback.

### Styling

- TailwindCSS v4 with CSS-first configuration
- Dark mode enforced via `html` class in layout
- Component styling follows Shadcn/ui patterns
- Follow [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) for brand guidelines

### Code Quality

- **Biome**: Primary tool for formatting and linting
  - Configuration in `biome.json`
  - Uses tab indentation, double quotes
  - Auto-organizes imports
  - Supports CSS with Tailwind directives
- **ESLint**: Secondary linting (Next.js specific rules)
  - Configuration in `eslint.config.mjs`
- Use `npm run biocheck` before committing
- Biome enforces consistent code style across the project

### Type Safety & Validation

- Strict TypeScript configuration
- **Zod Schemas**: All API endpoints use Zod for runtime validation
  - Prefer inferred types from schemas over manual interfaces
  - Import types from `@/schemas` for consistency
  - Use `validateRequest()` utility in API routes
- Environment variables validated via @t3-oss/env-nextjs
- Drizzle ORM provides database type safety with full TypeScript inference

### API Development Guidelines

- All API endpoints MUST validate request bodies using Zod schemas
- Use structured error responses via validation utilities
- Follow consistent response format:
  `{ success: boolean, data?: any, error?: string }`
- Handle validation errors with proper HTTP status codes (400 for validation
  failures)
- Prefer schema-inferred types over manually defined interfaces

## AI Integration

### Mastra Framework

- Weather agent example in `src/agents/weatherAgent.ts`
- Chat API endpoint at `src/app/api/chat/route.ts`
- Uses AI SDK React for streaming responses

## Billing & Subscription System

### LemonSqueezy Integration

CompileStrength uses LemonSqueezy for subscription billing with full webhook
integration.

**Key Features:**

- Subscription management (create, pause, cancel, change plans)
- 7-day free trial period for new subscriptions
- Usage tracking and limits (1 compile/week, 5 edits, 50 messages)
- Webhook-based sync for real-time subscription updates
- Trial users have full premium access during trial period
- Expired/cancelled users can view app but see upgrade prompts

### Route Structure

**Public Routes (No Auth Required):**

- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/tools/*` - Free fitness calculators (FFMI, etc.)

**Protected Routes (Auth Required):**

- `/app/*` - All dashboard pages require authentication
  - `/app` - Main dashboard (shows workout overview)
  - `/app/compiler` - AI workout compiler
  - `/app/programs` - Workout programs
  - `/app/log-workout` - Log workout sessions
  - `/app/settings` - User settings
  - `/app/billing` - Subscription management

### Subscription Status Handling

**Valid Subscription Statuses (grants access):**

- `active` - Paid and active subscription
- `on_trial` - In 7-day trial period
- `paused` - Paused but can be resumed

**Invalid Statuses (show upgrade prompts):**

- `past_due` - Payment failed
- `unpaid` - Subscription unpaid
- `cancelled` - Subscription cancelled
- `expired` - Subscription expired

### Usage Limits

Each subscription period tracks:

- **Compiles**: 1 per week (AI workout generation)
- **Routine Edits**: 5 per routine
- **AI Messages**: 50 per conversation

Usage periods reset based on subscription start date (not calendar week).

### Webhook Events

Webhook endpoint at `/api/webhooks/lemonsqueezy` handles:

- `subscription_created` - New subscription started
- `subscription_updated` - Subscription modified
- `subscription_cancelled` - Subscription cancelled
- `subscription_resumed` - Subscription reactivated
- `subscription_paused` - Subscription paused
- `subscription_unpaused` - Subscription unpaused
- `subscription_expired` - Subscription expired

All events are stored in `WebhookEvents` table and processed asynchronously.

### Testing

No specific test framework is configured. Check with the user for preferred
testing approach before adding tests.
