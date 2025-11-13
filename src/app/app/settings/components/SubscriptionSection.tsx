import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionSection() {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CreditCard className="h-5 w-5" />
					Subscription & Billing
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-muted-foreground">
					Manage your subscription, view billing history, and update payment
					methods.
				</p>
				<Button asChild>
					<a href="/app/billing">Go to Billing</a>
				</Button>
			</CardContent>
		</Card>
	);
}
