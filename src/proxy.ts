import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const publicRoutes = ["/api/auth", "/api/webhooks"];

	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (pathname.startsWith("/api/")) {
		const sessionCookie = request.cookies.get("better-auth.session_token");

		if (!sessionCookie?.value) {
			return NextResponse.json(
				{ error: "Unauthorized - No session" },
				{ status: 401 },
			);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/((?!auth|webhooks|chat$).*)"],
};
