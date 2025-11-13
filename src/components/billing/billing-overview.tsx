import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
	formatPrice,
	getSubscriptionMessage,
	isValidSubscription,
} from "@/lib/subscription-utils";

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

	const { message, type } = getSubscriptionMessage(activeSubscription);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground mb-2">Current Plan</p>
						<p className="text-2xl font-bold">
							{plan?.productName || "Pro"} - {plan?.name || "Monthly"}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-muted-foreground mb-1">Price</p>
							<p className="font-semibold">
								{formatPrice(activeSubscription.price, plan?.interval ?? null)}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-1">Status</p>
							<p
								className={`font-semibold ${
									type === "success"
										? "text-green-600"
										: type === "error"
											? "text-red-600"
											: type === "warning"
												? "text-yellow-600"
												: "text-blue-600"
								}`}
							>
								{activeSubscription.statusFormatted}
							</p>
						</div>
					</div>

					{activeSubscription.renewsAt && (
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Next Billing Date
							</p>
							<p className="font-semibold">
								{new Date(activeSubscription.renewsAt).toLocaleDateString(
									"en-US",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)}
							</p>
						</div>
					)}

					{activeSubscription.trialEndsAt &&
						activeSubscription.status === "on_trial" && (
							<div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
								<p className="text-sm font-medium text-blue-600">
									Trial Period Active
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Your trial ends on{" "}
									{new Date(activeSubscription.trialEndsAt).toLocaleDateString(
										"en-US",
										{
											year: "numeric",
											month: "long",
											day: "numeric",
										},
									)}
									. You won't be charged until then.
								</p>
							</div>
						)}

					{type !== "success" && (
						<div
							className={`p-4 rounded-lg border ${
								type === "error"
									? "bg-red-500/5 border-red-500/20"
									: type === "warning"
										? "bg-yellow-500/5 border-yellow-500/20"
										: "bg-blue-500/5 border-blue-500/20"
							}`}
						>
							<p
								className={`text-sm ${
									type === "error"
										? "text-red-600"
										: type === "warning"
											? "text-yellow-600"
											: "text-blue-600"
								}`}
							>
								{message}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
