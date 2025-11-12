import { Suspense } from "react";
import { Plans } from "@/components/billing/plans";
import { SubscriptionRefresh } from "@/components/billing/subscription-refresh";
import { Subscriptions } from "@/components/billing/subscriptions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
	const _session = await requireAuth();

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
				{/* Current Subscription */}
				<Suspense
					fallback={
						<Card>
							<CardHeader>
								<CardTitle>Loading subscription...</CardTitle>
							</CardHeader>
						</Card>
					}
				>
					<Subscriptions />
				</Suspense>

				{/* Available Plans */}
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
			</div>
		</>
	);
}
