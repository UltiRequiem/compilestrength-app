"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCheckoutURL } from "@/app/actions/lemonsqueezy";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { plans } from "@/db/schema";
import { formatPrice } from "@/lib/subscription-utils";

type Plan = typeof plans.$inferSelect;

export function Plan({ plan }: { plan: Plan }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSignup = async () => {
		try {
			setLoading(true);
			const checkoutUrl = await getCheckoutURL(plan.variantId, false);

			if (checkoutUrl) {
				router.push(checkoutUrl);
			}
		} catch (error) {
			console.error("Error creating checkout:", error);
			alert("Error creating checkout. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{plan.productName}</CardTitle>
				<CardDescription>{plan.name}</CardDescription>
			</CardHeader>
			<CardContent>
				{plan.description && (
					<div
						className="text-sm text-muted-foreground mb-4"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: LemonSqueezy provides safe HTML
						dangerouslySetInnerHTML={{ __html: plan.description }}
					/>
				)}
				<div className="text-3xl font-bold">
					{formatPrice(plan.price, plan.interval)}
				</div>
				{plan.trialIntervalCount && plan.trialInterval && (
					<p className="text-sm text-muted-foreground mt-2">
						{plan.trialIntervalCount} {plan.trialInterval} free trial
					</p>
				)}
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSignup}
					disabled={loading}
					className="w-full"
					size="lg"
				>
					{loading ? "Loading..." : "Subscribe"}
				</Button>
			</CardFooter>
		</Card>
	);
}
