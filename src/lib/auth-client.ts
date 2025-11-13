"use client";

import { createAuthClient } from "better-auth/react";
import { cloudflareClient } from "better-auth-cloudflare/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { env } from "@/env";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [cloudflareClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export function useRequireAuth() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	return { session, isPending };
}
