import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// Skip auth check for specific routes
	const { pathname } = request.nextUrl;

	// Public routes that don't require authentication
	const publicRoutes = [
		"/api/auth",
		"/api/webhooks",
		"/api/chat", // General chat API (no auth needed for basic chat)
	];

	// Check if current path is a public route
	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	// For all other API routes, check authentication via cookie inspection
	// Edge Runtime compatible approach - check for auth session cookie
	if (pathname.startsWith("/api/")) {
		const sessionCookie = request.cookies.get("better-auth.session_token");

		if (!sessionCookie?.value) {
			return NextResponse.json(
				{ error: "Unauthorized - No session" },
				{ status: 401 },
			);
		}

		// Pass the request through - individual routes will handle full auth validation
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Match all API routes except auth and webhooks
		"/api/((?!auth|webhooks|chat$).*)",
	],
};
