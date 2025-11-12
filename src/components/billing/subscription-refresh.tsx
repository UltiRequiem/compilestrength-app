"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Component that checks for checkout success and refreshes subscription data
 */
export function SubscriptionRefresh() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Check if user just returned from checkout
		const checkoutSuccess = searchParams.get("checkout");

		if (checkoutSuccess === "success") {
			// Remove the query parameter
			const url = new URL(window.location.href);
			url.searchParams.delete("checkout");
			window.history.replaceState({}, "", url.toString());

			// Refresh the page to get updated subscription data
			router.refresh();
		}
	}, [searchParams, router]);

	return null;
}
