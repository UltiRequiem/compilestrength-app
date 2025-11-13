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
} from "@/lib/subscription-utils";

type Subscription = typeof subscriptions.$inferSelect;
type Plan = typeof plans.$inferSelect;

interface BillingOverviewClientProps {
	subscription: Subscription;
	plan: Plan | null;
}

export function BillingOverviewClient({
	subscription,
	plan,
}: BillingOverviewClientProps) {
	const [loading, setLoading] = useState(false);
	const [urls, setUrls] =
		useState<Awaited<ReturnType<typeof getSubscriptionURLs>>>();

	const { message, type } = getSubscriptionMessage(subscription);

	// Load URLs when needed
	const loadUrls = async () => {
		if (!urls) {
			const loadedUrls = await getSubscriptionURLs(subscription.lemonSqueezyId);
			setUrls(loadedUrls);
			return loadedUrls;
		}
		return urls;
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
				<div className="flex items-center justify-between">
					<CardTitle>Billing Overview</CardTitle>
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
									const localUrls = await loadUrls();
									if (localUrls?.customer_portal) {
										window.open(localUrls.customer_portal, "_blank");
									}
								}}
							>
								Customer portal ↗
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={async () => {
									const localUrls = await loadUrls();
									if (localUrls?.update_payment_method) {
										window.open(localUrls.update_payment_method, "_blank");
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
				</div>
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
								{formatPrice(subscription.price, plan?.interval ?? null)}
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
								{subscription.statusFormatted}
							</p>
						</div>
					</div>

					{subscription.renewsAt && (
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Next Billing Date
							</p>
							<p className="font-semibold">
								{new Date(subscription.renewsAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					)}

					{subscription.trialEndsAt && subscription.status === "on_trial" && (
						<div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
							<p className="text-sm font-medium text-blue-600">
								Trial Period Active
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Your trial ends on{" "}
								{new Date(subscription.trialEndsAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
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
