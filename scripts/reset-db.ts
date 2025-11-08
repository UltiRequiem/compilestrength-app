import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function resetDatabase() {
	console.log("🗑️  Dropping all tables...");

	// Drop all tables
	await sql`DROP SCHEMA public CASCADE`;
	await sql`CREATE SCHEMA public`;
	await sql`GRANT ALL ON SCHEMA public TO public`;

	console.log("✅ Database reset complete!");
}

resetDatabase().catch((error) => {
	console.error("❌ Error resetting database:", error);
	process.exit(1);
});
