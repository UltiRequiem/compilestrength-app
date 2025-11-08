# Compile Strength

Production: Cloudflare Workers.

## Environment Variables

This application requires the following environment variables:

- `DATABASE_URL` - Database connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth (must be at least 32 characters)
- `BETTER_AUTH_URL` - Base URL for Better Auth
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Public-facing URL for Better Auth

### Local Development

1. Copy `.dev.vars.example` to `.dev.vars`
2. Fill in the required values in `.dev.vars`
3. Run `bun run dev` for Next.js development or `bun run preview` for Cloudflare Workers preview

### Production Deployment

Environment variables must be configured in two places:

#### 1. Build-Time Variables (required for Next.js build)

`NEXT_PUBLIC_*` variables must be set during the build process:
- If building locally: set in your shell environment before running `bun run deploy`
- If using CI/CD: set as repository secrets and pass to the build step

Example for local build:
```bash
export NEXT_PUBLIC_BETTER_AUTH_URL=https://your-domain.com
bun run deploy
```

#### 2. Runtime Variables (for Cloudflare Workers)

Server-side variables must be set in the Cloudflare Workers dashboard:

1. Go to your Worker settings in the Cloudflare dashboard  
2. Navigate to Settings → Variables and Secrets
3. Add each environment variable:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `NEXT_PUBLIC_BETTER_AUTH_URL` (yes, this needs to be set here too for consistency)

**Methods to set variables:**
- As **Environment Variables** in the dashboard (recommended for non-sensitive values)
- As **Secrets** via `wrangler secret put VARIABLE_NAME` (for sensitive values)

**Important:** With the `nodejs_compat` compatibility flag enabled, these variables will automatically be available in `process.env` at runtime.

## Deployment

```bash
bun run deploy
```
