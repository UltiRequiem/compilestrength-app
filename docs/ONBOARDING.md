# CompileStrength Onboarding Guide

Welcome to CompileStrength! This guide will help you understand the codebase,
set up your development environment, and start contributing effectively.

## 🚀 Quick Start Checklist

- [ ] Clone repository and install dependencies
- [ ] Set up environment variables
- [ ] Initialize database
- [ ] Run development server
- [ ] Verify basic functionality
- [ ] Review project architecture
- [ ] Complete first development task

## 📋 Prerequisites

### Required Software

- **Bun** (v1.0+) - Primary package manager and runtime
- **Node.js** (v18+) - Alternative runtime for development
- **Git** - Version control
- **PostgreSQL** - Database (via Neon for serverless)

### Recommended Tools

- **VS Code** - IDE with TypeScript/React extensions
- **Drizzle Studio** - Database GUI (included in project)
- **Ngrok** - Webhook testing (for billing integration)
- **Biome** - Code formatting/linting (configured)

## ⚙️ Development Setup

### 1. Repository Setup

```bash
# Clone repository
git clone <repository-url>
cd compilestrength

# Install dependencies (prefer Bun)
bun install

# Alternative with npm
npm install
```

### 2. Environment Configuration

Create `.env` file in project root:

```bash
# Database
DATABASE_URL="postgresql://user:pass@your-neon-host.neon.tech/neondb?sslmode=require"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-32-char-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# LemonSqueezy Billing (Optional for basic development)
LEMONSQUEEZY_API_KEY="your-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"

# AI Features (Optional)
OPENAI_API_KEY="sk-your-openai-key"

# Webhook Testing (Optional)
NGROK_DOMAIN="your-subdomain.ngrok-free.app"
```

**Getting Credentials:**

- **Neon Database**: Sign up at [neon.tech](https://neon.tech), create database,
  copy connection string
- **Better Auth Secret**: Generate with `openssl rand -base64 32`
- **LemonSqueezy**: See [LEMONSQUEEZY_SETUP.md](./LEMONSQUEEZY_SETUP.md)
- **OpenAI**: Get API key from
  [platform.openai.com](https://platform.openai.com)

### 3. Database Setup

```bash
# Push schema to database
bunx drizzle-kit push

# Open database GUI (optional)
bunx drizzle-kit studio

# Generate auth schema (if needed)
npx @better-auth/cli generate --config src/lib/auth.ts --output src/db/auth.schema.ts -y
```

### 4. Start Development

```bash
# Start development server
bun dev
# or
npm run dev

# Server will run on http://localhost:3000
```

### 5. Verify Setup

Test these key areas:

1. **Landing Page**: Visit `http://localhost:3000`
2. **Authentication**: Go to `/signup` and create account
3. **Dashboard**: Access `/app` after login
4. **Tools**: Test `/tools/ffmi-calculator`
5. **Database**: Check data in Drizzle Studio

## 🏗️ Project Architecture

### Tech Stack Overview

**Frontend:**

- **Next.js 15** - React framework with App Router
- **React 19** - UI framework
- **TailwindCSS v4** - Styling
- **Zustand** - State management (user preferences)
- **Shadcn/ui** - Component library

**Backend:**

- **Cloudflare Workers** - Serverless deployment
- **Neon PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Authentication with Cloudflare integration

**Key Integrations:**

- **LemonSqueezy** - Subscription billing
- **OpenAI** - AI workout generation
- **Mastra** - AI agent framework

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── app/              # Protected dashboard pages
│   ├── tools/            # Public fitness calculators
│   └── actions/          # Server actions
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── billing/          # Subscription components
│   └── dashboard/        # Dashboard components
├── db/                   # Database schema & connection
├── schemas/              # Zod validation schemas
├── lib/                  # Core utilities
│   ├── queries/          # Database query functions
│   └── auth-*.ts         # Authentication utilities
├── stores/               # Zustand state management
├── providers/            # React context providers
└── agents/               # AI agents (Mastra)
```

### Key Concepts

**Route Structure:**

- **Public**: `/`, `/tools/*`, `/login`, `/signup`
- **Protected**: `/app/*` (requires authentication)
- **API**: `/api/*` (server endpoints)

**Database Models:**

- **Auth**: Users, sessions, accounts (Better Auth)
- **Workouts**: Programs, exercises, sessions, sets
- **Billing**: Plans, subscriptions, webhooks, usage tracking

**State Management:**

- **Global**: User preferences via Zustand
- **Local**: React state for component-specific data
- **Server**: Database state via Drizzle ORM

## 🛠️ Development Workflow

### Code Quality Standards

**Formatting & Linting:**

```bash
# Run Biome check with auto-fix (recommended)
npm run biocheck

# Format code
npm run format

# ESLint check
npm run lint
```

**TypeScript & Build:**

```bash
# Build check
npm run build

# TypeScript check
npm run check
```

**Always run before committing:**

```bash
npm run biocheck && npm run check
```

### Database Operations

**Schema Changes:**

```bash
# Modify schema in src/db/schema.ts
# Push changes to database
bunx drizzle-kit push

# Generate migrations (optional)
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

**Database Management:**

```bash
# Open GUI
bunx drizzle-kit studio

# Reset database (DEV ONLY)
bun run scripts/reset-db.ts

# Regenerate auth schema
npx @better-auth/cli generate
```

### Testing Billing Integration

```bash
# Start ngrok for webhook testing
npm run ngrok

# Configure LemonSqueezy webhook to:
# https://your-subdomain.ngrok-free.app/api/webhooks/lemonsqueezy
```

See [NGROK_SETUP.md](./NGROK_SETUP.md) for details.

## 📚 Key Files to Understand

### Core Configuration

- `CLAUDE.md` - Comprehensive project documentation
- `package.json` - Dependencies and scripts
- `wrangler.jsonc` - Cloudflare Workers configuration
- `biome.json` - Code formatting/linting rules
- `drizzle.config.ts` - Database configuration

### Database Schema

- `src/db/schema.ts` - Main database schema
- `src/db/auth.schema.ts` - Better Auth tables
- `src/schemas/` - Zod validation schemas

### Authentication

- `src/lib/auth.ts` - Better Auth configuration
- `src/lib/auth-utils.ts` - Authentication helpers
- `src/lib/auth-middleware.ts` - Proxy authentication

### State Management

- `src/stores/user-preferences-store.ts` - Global preferences
- `src/providers/user-preferences-store-provider.tsx` - SSR-safe provider

### Styling & Components

- `docs/STYLE_GUIDE.md` - Brand guidelines and design system
- `src/components/ui/` - Reusable UI components
- `src/app/globals.css` - Global styles and Tailwind config

## 🎯 Common Development Tasks

### Adding a New API Endpoint

1. Create route file: `src/app/api/your-endpoint/route.ts`
2. Add Zod schema: `src/schemas/your-feature.schemas.ts`
3. Implement with validation:

```typescript
import { validateRequest } from "@/lib/validation";
import { yourSchema } from "@/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = validateRequest(yourSchema, body);

  // Process data...

  return Response.json({ success: true });
}
```

### Creating a New Dashboard Page

1. Add page: `src/app/app/your-page/page.tsx`
2. Add to sidebar: Update `src/components/ui/sidebar.constants.ts`
3. Follow protected route pattern:

```typescript
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function YourPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Your content</div>;
}
```

### Adding Database Tables

1. Define schema: `src/db/schemas/your-feature.schema.ts`
2. Export from: `src/db/schema.ts`
3. Create queries: `src/lib/queries/your-feature.ts`
4. Push to database: `bunx drizzle-kit push`

### Integrating AI Features

1. Create agent: `src/agents/your-agent.ts`
2. Use Mastra framework:

```typescript
import { Mastra } from "@mastra/core";
import { openAI } from "@ai-sdk/openai";

export const yourAgent = new Mastra({
  provider: openAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});
```

## 🚨 Common Pitfalls

### Environment Variables

- **Missing Variables**: App crashes without required env vars
- **Wrong URLs**: Auth URLs must match exactly (trailing slashes matter)
- **Cloudflare Secrets**: Use `wrangler secret put` for production

### Database

- **Connection Issues**: Verify Neon URL format and SSL mode
- **Schema Sync**: Always `bunx drizzle-kit push` after schema changes
- **Migration Conflicts**: Reset DB if needed: `bun run scripts/reset-db.ts`

### Authentication

- **Session Issues**: Clear browser storage if auth breaks
- **Geolocation**: Better Auth tracks IP/location - normal in logs
- **Middleware**: Proxy setup required for Cloudflare Workers

### State Management

- **SSR Hydration**: Use providers correctly to avoid mismatches
- **State Reset**: Preferences reset on user changes (by design)
- **Selectors**: Use stable selectors to prevent infinite loops

### Styling

- **Terminal Theme**: Project rebranded - avoid green/terminal aesthetics
- **Monospace Fonts**: Don't use - fitness app, not terminal app
- **Brand Colors**: Use blue (`#3b82f6`) not green
- **Components**: Follow Shadcn/ui patterns consistently

## 🎨 Design Guidelines

Follow [STYLE_GUIDE.md](./STYLE_GUIDE.md) for:

- Color palette (zinc + blue, NOT green)
- Typography (Inter font, NO monospace)
- Component patterns
- Brand voice (fitness-focused, NOT developer-focused)

**Key Rules:**

- Use `text-blue-500` for accents, not `text-green-400`
- Reference training principles, not coding metaphors
- Professional fitness language, not terminal commands

## 🔄 Deployment

### Development Preview

```bash
# Build and preview with Cloudflare Workers
npm run preview
```

### Production Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Set secrets (first time only)
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put LEMONSQUEEZY_API_KEY
```

See README.md for complete deployment instructions.

## 📖 Additional Resources

### Project Documentation

- [README.md](../README.md) - Setup and deployment
- [CLAUDE.md](../CLAUDE.md) - Comprehensive project guide
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Design system
- [LEMONSQUEEZY_SETUP.md](./LEMONSQUEEZY_SETUP.md) - Billing integration
- [NGROK_SETUP.md](./NGROK_SETUP.md) - Webhook testing

### Framework Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Better Auth](https://www.better-auth.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)

### Platform Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Neon Database](https://neon.tech/docs)
- [LemonSqueezy API](https://docs.lemonsqueezy.com/)
- [OpenAI API](https://platform.openai.com/docs)

## 🆘 Getting Help

### Development Issues

1. **Check Environment**: Verify all required env vars are set
2. **Database Issues**: Use `bunx drizzle-kit studio` to inspect data
3. **Build Errors**: Run `npm run check` for TypeScript issues
4. **Auth Problems**: Check Better Auth logs and session data

### Code Standards

1. **Formatting**: Run `npm run biocheck` before committing
2. **Validation**: All API endpoints should use Zod schemas
3. **Types**: Import from `@/schemas` for consistent typing
4. **Queries**: Use organized functions from `src/lib/queries/`

### Resources

- **Architecture**: Reference `CLAUDE.md` for detailed patterns
- **Styling**: Follow `STYLE_GUIDE.md` for brand consistency
- **Billing**: See `LEMONSQUEEZY_SETUP.md` for integration details
- **API Design**: Check existing endpoints for patterns

## ✅ First Day Tasks

Complete these to get familiar with the codebase:

1. **Setup**: Get development environment running
2. **Explore**: Create account and test main features
3. **Code Review**: Read through key files listed above
4. **Small Fix**: Find and fix a small issue or improvement
5. **Documentation**: Update this guide if you found any gaps!

Welcome to the team! 🎉
