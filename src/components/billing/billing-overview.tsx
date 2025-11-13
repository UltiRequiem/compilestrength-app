import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { BillingOverviewClient } from "@/components/billing/billing-overview-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isValidSubscription } from "@/lib/subscription-utils";

/**
 * Billing Overview Component
 * Displays a summary of the user's current subscription status
 */
export async function BillingOverview() {
	const userSubscriptions = await getUserSubscriptions();

	// Find the most relevant subscription (active > on_trial > paused > others)
	const activeSubscription = userSubscriptions.find((sub) =>
		isValidSubscription(sub.status),
	);

	if (!activeSubscription) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Billing Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground mb-2">
								Current Plan
							</p>
							<p className="text-2xl font-bold">Free</p>
						</div>
						<div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
							<p className="text-sm text-muted-foreground">
								Upgrade to Pro to unlock AI-powered program generation, advanced
								analytics, and unlimited workout tracking.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Get plan details
	const plan = await db
		.select()
		.from(plans)
		.where(eq(plans.id, activeSubscription.planId))
		.limit(1)
		.then((rows) => rows[0]);

	return (
		<BillingOverviewClient subscription={activeSubscription} plan={plan} />
	);
}
