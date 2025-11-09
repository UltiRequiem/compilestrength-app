import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	database: drizzleAdapter(getDb(), {
		provider: "pg",
		usePlural: true,
	}),
	...withCloudflare(
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
		},
	),
});

export type Session = typeof auth.$Infer.Session;
