import { eq } from "drizzle-orm";
import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, plans } from "@/db/schema";
import { SubscriptionCard } from "./subscription-card";

export async function Subscriptions() {
	const userSubscriptions = await getUserSubscriptions();

	if (userSubscriptions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Active Subscription</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						You don't have any active subscriptions. Choose a plan below to get
						started.
					</p>
				</CardContent>
			</Card>
		);
	}

	// Get plan details for all subscriptions
	const subscriptionsWithPlans = await Promise.all(
		userSubscriptions.map(async (sub) => {
			const plan = await db
				.select()
				.from(plans)
				.where(eq(plans.id, sub.planId))
				.limit(1);

			return {
				...sub,
				plan: plan[0],
			};
		}),
	);

	// Sort: active first, then on_trial, then others
	const sortedSubscriptions = subscriptionsWithPlans.sort((a, b) => {
		const statusOrder = {
			active: 1,
			on_trial: 2,
			paused: 3,
			past_due: 4,
			unpaid: 5,
			cancelled: 6,
			expired: 7,
		};
		return (
			(statusOrder[a.status as keyof typeof statusOrder] || 99) -
			(statusOrder[b.status as keyof typeof statusOrder] || 99)
		);
	});

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Your Subscriptions</h2>
			{sortedSubscriptions.map((subscription) => (
				<SubscriptionCard
					key={subscription.id}
					subscription={subscription}
					plan={subscription.plan}
				/>
			))}
		</div>
	);
}
