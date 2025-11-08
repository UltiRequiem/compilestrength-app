import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
	// For Cloudflare Workers, we'll get the DATABASE_URL from env
	// For local development, it comes from .env
	const databaseUrl =
		process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}

	// Reuse connection in development
	if (db) {
		return db;
	}

	// Create new postgres client
	client = postgres(databaseUrl, {
		prepare: false,
		max: 1, // Cloudflare Workers limitation
	});

	db = drizzle(client, { schema });

	return db;
}

export { schema };
export type Database = ReturnType<typeof getDb>;
