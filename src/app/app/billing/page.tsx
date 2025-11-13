import { Suspense } from "react";
import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { BillingOverview } from "@/components/billing/billing-overview";
import { Plans } from "@/components/billing/plans";
import { SubscriptionRefresh } from "@/components/billing/subscription-refresh";
import { Subscriptions } from "@/components/billing/subscriptions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";
import { isValidSubscription } from "@/lib/subscription-utils";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
	const _session = await requireAuth();

	// Fetch user subscriptions to check if they have an active one
	const userSubscriptions = await getUserSubscriptions();

	// Check if user has any active/trial/paused subscriptions
	const hasActiveSubscription =
		userSubscriptions.length > 0 &&
		userSubscriptions.some((sub) => isValidSubscription(sub.status));

	return (
		<>
			<SubscriptionRefresh />
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Billing</h1>
				<p className="text-muted-foreground">
					Manage your subscription and billing settings
				</p>
			</div>

			<div className="space-y-8">
				{/* Billing Overview */}
				<Suspense
					fallback={
						<Card>
							<CardHeader>
								<CardTitle>Loading overview...</CardTitle>
							</CardHeader>
						</Card>
					}
				>
					<BillingOverview />
				</Suspense>

				{/* Subscription Management - only show if has active subscription */}
				{hasActiveSubscription && (
					<Suspense
						fallback={
							<Card>
								<CardHeader>
									<CardTitle>Loading subscription details...</CardTitle>
								</CardHeader>
							</Card>
						}
					>
						<Subscriptions />
					</Suspense>
				)}

				{/* Available Plans - only show if no active subscription */}
				{!hasActiveSubscription && (
					<Suspense
						fallback={
							<Card>
								<CardHeader>
									<CardTitle>Loading plans...</CardTitle>
								</CardHeader>
							</Card>
						}
					>
						<Plans />
					</Suspense>
				)}
			</div>
		</>
	);
}
