"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";
import {
	cancelSub,
	getSubscriptionURLs,
	pauseUserSubscription,
	unpauseUserSubscription,
} from "@/app/actions/lemonsqueezy";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { plans, subscriptions } from "@/db/schema";
import {
	formatPrice,
	getSubscriptionMessage,
	type SubscriptionStatus,
} from "@/lib/subscription-utils";

type Subscription = typeof subscriptions.$inferSelect;
type Plan = typeof plans.$inferSelect;

export function SubscriptionCard({
	subscription,
	plan,
}: {
	subscription: Subscription;
	plan: Plan;
}) {
	const [loading, setLoading] = useState(false);
	const [urls, setUrls] =
		useState<Awaited<ReturnType<typeof getSubscriptionURLs>>>();

	const status = subscription.status as SubscriptionStatus;
	const { hasAccess, message, type } = getSubscriptionMessage(subscription);

	// Load URLs when needed
	const loadUrls = async () => {
		if (!urls) {
			const loadedUrls = await getSubscriptionURLs(subscription.lemonSqueezyId);
			setUrls(loadedUrls);
		}
	};

	const handleCancel = async () => {
		if (!confirm("Are you sure you want to cancel your subscription?")) {
			return;
		}

		setLoading(true);
		try {
			await cancelSub(subscription.lemonSqueezyId);
			window.location.reload();
		} catch (error) {
			console.error("Error cancelling subscription:", error);
			alert("Error cancelling subscription. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handlePause = async () => {
		setLoading(true);
		try {
			await pauseUserSubscription(subscription.lemonSqueezyId);
			window.location.reload();
		} catch (error) {
			console.error("Error pausing subscription:", error);
			alert("Error pausing subscription. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleUnpause = async () => {
		setLoading(true);
		try {
			await unpauseUserSubscription(subscription.lemonSqueezyId);
			window.location.reload();
		} catch (error) {
			console.error("Error unpausing subscription:", error);
			alert("Error unpausing subscription. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle>
							{plan.productName} - {plan.name}
						</CardTitle>
						<CardDescription className="mt-2">
							<span
								className={
									type === "success"
										? "text-green-600"
										: type === "error"
											? "text-red-600"
											: type === "warning"
												? "text-yellow-600"
												: "text-blue-600"
								}
							>
								{message}
							</span>
						</CardDescription>
					</div>
					{hasAccess && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" disabled={loading}>
									<MoreVerticalIcon className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{!subscription.isPaused && (
									<DropdownMenuItem onClick={handlePause}>
										Pause payments
									</DropdownMenuItem>
								)}
								{subscription.isPaused && (
									<DropdownMenuItem onClick={handleUnpause}>
										Resume payments
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									onClick={async () => {
										await loadUrls();
										if (urls?.customer_portal) {
											window.open(urls.customer_portal, "_blank");
										}
									}}
								>
									Customer portal ↗
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={async () => {
										await loadUrls();
										if (urls?.update_payment_method) {
											window.open(urls.update_payment_method, "_blank");
										}
									}}
								>
									Update payment method
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleCancel}
									className="text-destructive"
								>
									Cancel subscription
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">Price</p>
						<p className="font-medium">
							{formatPrice(subscription.price, plan.interval)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Status</p>
						<p className="font-medium">{subscription.statusFormatted}</p>
					</div>
					{subscription.renewsAt && (
						<div>
							<p className="text-muted-foreground">Renews on</p>
							<p className="font-medium">
								{new Date(subscription.renewsAt).toLocaleDateString()}
							</p>
						</div>
					)}
					{subscription.endsAt && (
						<div>
							<p className="text-muted-foreground">Ends on</p>
							<p className="font-medium">
								{new Date(subscription.endsAt).toLocaleDateString()}
							</p>
						</div>
					)}
					{subscription.trialEndsAt && status === "on_trial" && (
						<div>
							<p className="text-muted-foreground">Trial ends</p>
							<p className="font-medium">
								{new Date(subscription.trialEndsAt).toLocaleDateString()}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
