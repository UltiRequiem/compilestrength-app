# Deployment Checklist for Cloudflare Workers

This document provides a step-by-step guide to fix and deploy the application to Cloudflare Workers.

## Issue Summary

The application was failing in production with the error:
```
❌ Invalid environment variables: expected string, received undefined
```

This was caused by:
1. A bug where `NEXT_PUBLIC_BETTER_AUTH_URL` was mapped to the wrong environment variable
2. Missing environment variable configuration
3. Misunderstanding about build-time vs runtime variables

## Pre-Deployment Checklist

### Step 1: Verify Cloudflare Dashboard Configuration

Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Your Worker → Settings → Variables and Secrets

Ensure these environment variables are set (click "Add variable" if missing):

- [ ] `DATABASE_URL` - Your database connection string (e.g., from Turso, Neon, etc.)
- [ ] `BETTER_AUTH_SECRET` - A secure random string (min 32 characters)
- [ ] `BETTER_AUTH_URL` - Your production URL (e.g., `https://compilestrength.com`)
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL` - Your production URL (e.g., `https://compilestrength.com`)

**Important:** Variable names are case-sensitive and must match exactly as shown above.

### Step 2: Set Build-Time Environment Variables

When running the deployment command, you must set `NEXT_PUBLIC_BETTER_AUTH_URL`:

```bash
# Option 1: Set inline with deploy command
NEXT_PUBLIC_BETTER_AUTH_URL=https://compilestrength.com bun run deploy

# Option 2: Export before deploying
export NEXT_PUBLIC_BETTER_AUTH_URL=https://compilestrength.com
bun run deploy
```

### Step 3: Deploy

```bash
bun run deploy
```

This will:
1. Build your Next.js application (with NEXT_PUBLIC vars embedded)
2. Adapt it for Cloudflare Workers
3. Deploy to Cloudflare

**Note:** This project uses `bun` as the package manager.

## Verification

After deployment, visit your application and check:
- [ ] Homepage loads without errors
- [ ] `/login` route is accessible
- [ ] Console doesn't show environment variable errors

## Troubleshooting

### Issue: "Invalid environment variables" error persists

**Check:**
1. Variable names in Cloudflare dashboard match exactly (case-sensitive)
2. No typos in variable names
3. All four variables are set
4. You rebuilt and redeployed after setting variables

### Issue: Build fails with font errors

This is expected in restricted network environments. The fix doesn't affect font loading.

### Issue: Client-side code can't access auth URL

**Solution:** Ensure `NEXT_PUBLIC_BETTER_AUTH_URL` was set during build:
```bash
echo $NEXT_PUBLIC_BETTER_AUTH_URL  # Should output your URL
```

If not set, export it and rebuild:
```bash
export NEXT_PUBLIC_BETTER_AUTH_URL=https://compilestrength.com
bun run deploy
```

## Local Development

For local development:

1. Copy `.dev.vars.example` to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Edit `.dev.vars` with your local values:
   ```
   DATABASE_URL=file:local.db
   BETTER_AUTH_SECRET=local-dev-secret-at-least-32-chars
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. Run dev server:
   ```bash
   bun run dev
   ```

4. For Cloudflare Workers preview:
   ```bash
   bun run preview
   ```

## CI/CD Setup (Optional)

If using GitHub Actions or another CI/CD platform:

1. Add repository secrets:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `NEXT_PUBLIC_BETTER_AUTH_URL`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. In your workflow, set environment variables before build:
   ```yaml
   - name: Build and Deploy
     env:
       NEXT_PUBLIC_BETTER_AUTH_URL: ${{ secrets.NEXT_PUBLIC_BETTER_AUTH_URL }}
     run: bun run deploy
   ```

## Understanding the Fix

### What Was Wrong

**Bug in `src/env.ts`:**
```typescript
// Line 19 was WRONG:
NEXT_PUBLIC_BETTER_AUTH_URL: process.env.BETTER_AUTH_URL
// Should be:
NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
```

**Missing Configuration:**
- Environment variables weren't declared in TypeScript types
- No documentation about build-time vs runtime requirements

### What Was Fixed

1. ✅ Corrected environment variable mapping in `src/env.ts`
2. ✅ Added TypeScript type definitions in `env.d.ts`
3. ✅ Created comprehensive documentation
4. ✅ Added development templates and examples

### How It Works Now

With `nodejs_compat` enabled in `wrangler.jsonc`:
- Cloudflare Workers automatically populate `process.env` from the env binding
- Environment variables set in the dashboard are available at runtime
- `NEXT_PUBLIC_*` variables are embedded at build time and available everywhere

## Support

If you continue to experience issues:
1. Double-check all variable names match exactly
2. Verify variables are set in the correct Cloudflare environment (production vs staging)
3. Ensure you're setting `NEXT_PUBLIC_BETTER_AUTH_URL` during build
4. Check Cloudflare Workers logs for any additional error messages

## Quick Reference

| Variable | Where to Set | When Available |
|----------|--------------|----------------|
| `DATABASE_URL` | Cloudflare Dashboard | Runtime |
| `BETTER_AUTH_SECRET` | Cloudflare Dashboard | Runtime |
| `BETTER_AUTH_URL` | Cloudflare Dashboard | Runtime |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Build environment + Cloudflare Dashboard | Build time + Runtime |

Note: `NEXT_PUBLIC_*` must be set in BOTH places because it's embedded during build AND used at runtime.
