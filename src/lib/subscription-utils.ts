import type { subscriptions } from "@/db/schema";

export type SubscriptionStatus =
	| "active"
	| "on_trial"
	| "paused"
	| "past_due"
	| "unpaid"
	| "cancelled"
	| "expired";

export type Subscription = typeof subscriptions.$inferSelect;

/**
 * Check if a subscription status is considered valid (user has access)
 * - active: paid and active
 * - on_trial: in trial period (7 days)
 * - paused: paused but can be resumed
 */
export function isValidSubscription(
	status: SubscriptionStatus | string,
): boolean {
	return status === "active" || status === "on_trial" || status === "paused";
}

/**
 * Check if a user's subscription grants them access to premium features
 */
export function hasActiveSubscription(
	subscription: Subscription | null | undefined,
): boolean {
	if (!subscription) return false;

	return isValidSubscription(subscription.status);
}

/**
 * Get user-friendly status message for subscription
 */
export function getSubscriptionMessage(
	subscription: Subscription | null | undefined,
): {
	hasAccess: boolean;
	message: string;
	type: "success" | "warning" | "error" | "info";
} {
	if (!subscription) {
		return {
			hasAccess: false,
			message: "No active subscription. Subscribe to access premium features.",
			type: "error",
		};
	}

	const status = subscription.status as SubscriptionStatus;

	switch (status) {
		case "active":
			return {
				hasAccess: true,
				message: "Your subscription is active",
				type: "success",
			};
		case "on_trial":
			return {
				hasAccess: true,
				message: `Trial active until ${subscription.trialEndsAt ? new Date(subscription.trialEndsAt).toLocaleDateString() : "end of trial"}`,
				type: "info",
			};
		case "paused":
			return {
				hasAccess: true,
				message: "Your subscription is paused. Resume to continue access.",
				type: "warning",
			};
		case "past_due":
			return {
				hasAccess: false,
				message: "Payment is past due. Please update your payment method.",
				type: "error",
			};
		case "unpaid":
			return {
				hasAccess: false,
				message: "Subscription unpaid. Please update your payment method.",
				type: "error",
			};
		case "cancelled":
			return {
				hasAccess: false,
				message:
					"Your subscription was cancelled. Subscribe again to regain access.",
				type: "error",
			};
		case "expired":
			return {
				hasAccess: false,
				message:
					"Your subscription has expired. Subscribe again to regain access.",
				type: "error",
			};
		default:
			return {
				hasAccess: false,
				message: "Subscription status unknown. Please contact support.",
				type: "error",
			};
	}
}

/**
 * Format price for display
 */
export function formatPrice(price: string | number, interval?: string | null) {
	const numPrice =
		typeof price === "string" ? Number.parseInt(price, 10) : price;
	const dollars = (numPrice / 100).toFixed(2);

	if (interval) {
		return `$${dollars}/${interval}`;
	}

	return `$${dollars}`;
}
