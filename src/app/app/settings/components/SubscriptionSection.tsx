import { CheckCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionSection() {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CreditCard className="h-5 w-5" />
					Subscription
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="rounded-lg border-2 border-primary p-6 glow-green">
					<div className="mb-4 flex items-start justify-between">
						<div>
							<h3 className="text-xl font-bold">Pro Plan</h3>
							<p className="text-sm text-muted-foreground">
								Full access to all features
							</p>
						</div>
						<Badge className="bg-primary">Active</Badge>
					</div>
					<ul className="mb-4 space-y-2 text-sm">
						<li className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-primary" />
							AI Program Generation
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-primary" />
							Gains Debugger
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-primary" />
							Coach Chat (Unlimited)
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-primary" />
							Advanced Analytics
						</li>
					</ul>
					<p className="text-sm text-muted-foreground">
						Renews on Dec 7, 2024 • $9.99/month
					</p>
				</div>

				<div className="space-y-2">
					<h4 className="text-sm font-medium">Payment Method</h4>
					<div className="flex items-center gap-3">
						<CreditCard className="h-5 w-5" />
						<div>
							<p className="font-semibold">•••• •••• •••• 4242</p>
							<p className="text-sm text-muted-foreground">Expires 12/28</p>
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						Update Payment Method
					</Button>
					<Button variant="outline" size="sm">
						Manage Billing
					</Button>
					<Button variant="destructive" size="sm">
						Cancel Subscription
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}