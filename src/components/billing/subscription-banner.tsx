import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { getActiveSubscription } from "@/app/actions/lemonsqueezy";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	getSubscriptionMessage,
	hasActiveSubscription,
} from "@/lib/subscription-utils";

/**
 * Banner component to show subscription status
 * Shows upgrade prompts for expired/cancelled users
 */
export async function SubscriptionBanner() {
	const subscription = await getActiveSubscription();
	const hasAccess = hasActiveSubscription(subscription);
	const { message, type } = getSubscriptionMessage(subscription);

	// Don't show banner if user has active access
	if (hasAccess && type === "success") {
		return null;
	}

	const icons = {
		success: CheckCircle2,
		warning: AlertTriangle,
		error: AlertCircle,
		info: Info,
	};

	const Icon = icons[type];

	// Show upgrade prompt for expired/cancelled users
	if (!hasAccess) {
		return (
			<Alert variant="destructive" className="mb-6">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Subscription Required</AlertTitle>
				<AlertDescription className="flex items-center justify-between">
					<span>{message}</span>
					<Link href="/app/billing">
						<Button variant="outline" size="sm">
							View Plans
						</Button>
					</Link>
				</AlertDescription>
			</Alert>
		);
	}

	// Show info banner for trial/paused users
	return (
		<Alert className="mb-6">
			<Icon className="h-4 w-4" />
			<AlertTitle>
				{subscription?.status === "on_trial"
					? "Free Trial Active"
					: "Subscription Status"}
			</AlertTitle>
			<AlertDescription className="flex items-center justify-between">
				<span>{message}</span>
				<Link href="/app/billing">
					<Button variant="outline" size="sm">
						Manage Subscription
					</Button>
				</Link>
			</AlertDescription>
		</Alert>
	);
}
