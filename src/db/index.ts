import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb() {
	const databaseUrl =
		process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}

	const sql = neon(databaseUrl);
	const db = drizzle(sql, { schema });

	return db;
}

export { schema };
export type Database = ReturnType<typeof getDb>;
