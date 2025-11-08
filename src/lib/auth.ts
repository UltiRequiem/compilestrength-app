import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { getDb } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	...withCloudflare(
		{
			autoDetectIpAddress: true,
			geolocationTracking: true,
			cf: {},
			postgres: {
				db: getDb(),
				options: {
					usePlural: true,
					debugLogs: true,
				},
			},
		},
		{
			emailAndPassword: {
				enabled: true,
			},
			secret: env.BETTER_AUTH_SECRET,
			baseURL: env.BETTER_AUTH_URL,
		}
	),
});

export type Session = typeof auth.$Infer.Session;
