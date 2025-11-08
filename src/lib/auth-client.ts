"use client";

import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { env } from "../env";

export const authClient = createAuthClient({
	baseURL: env.BETTER_AUTH_URL|| "http://localhost:3000",
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
