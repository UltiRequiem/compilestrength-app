import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Get authenticated user ID by validating session
 * This is used in API routes that are pre-filtered by middleware for session cookies
 */
export async function getAuthenticatedUserId(): Promise<string> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("User session not found or invalid");
		}

		return session.user.id;
	} catch (error) {
		console.error("Authentication error:", error);
		throw new Error("Authentication failed");
	}
}

/**
 * Create standardized unauthorized response
 */
export function createUnauthorizedResponse() {
	return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
