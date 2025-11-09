import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { withCloudflare } from "better-auth-cloudflare";
import { db } from "@/db";
import { env } from "@/env";

const cloudflareConfig = withCloudflare(
	{
		autoDetectIpAddress: true,
		geolocationTracking: true,
		cf: {},
	},
	{
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
			usePlural: true,
		}),
	},
);

export const auth = betterAuth(cloudflareConfig);

export type Session = typeof auth.$Infer.Session;
