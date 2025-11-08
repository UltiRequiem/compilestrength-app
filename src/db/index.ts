import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb() {
	// For Cloudflare Workers, we'll get the DATABASE_URL from env
	// For local development, it comes from .env
	const databaseUrl =
		process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}

	// Use Neon serverless driver - works perfectly in Cloudflare Workers
	// This uses HTTP instead of WebSocket, which is more reliable in Workers
	const sql = neon(databaseUrl);
	const db = drizzle(sql, { schema });

	return db;
}

export { schema };
export type Database = ReturnType<typeof getDb>;
