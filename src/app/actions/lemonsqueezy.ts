"use server";

import {
	cancelSubscription,
	createCheckout,
	getPrice,
	getProduct,
	getSubscription,
	listPrices,
	listProducts,
	updateSubscription,
	type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { configureLemonSqueezy } from "@/config/lemonsqueezy";
import { db } from "@/db";
import { plans, subscriptions, webhookEvents } from "@/db/schema";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { webhookHasData, webhookHasMeta } from "@/lib/lemonsqueezy-typeguards";
import type {
	NewPlan,
	Plan,
	NewSubscription,
	SubscriptionItem,
} from "./lemonsqueezy.types";


/**
 * Sync plans from LemonSqueezy to the database
 */
export async function syncPlans() {
	configureLemonSqueezy();

	// Fetch all the variants from the database.
	const productVariants: Plan[] = await db.select().from(plans);

	// Helper function to add a variant to the productVariants array and sync it with the database.
	async function _addVariant(variant: NewPlan) {
		console.log(`Syncing variant ${variant.name} with the database...`);

		// Sync the variant with the plan in the database.
		const [insertedPlan] = await db
			.insert(plans)
			.values(variant)
			.onConflictDoUpdate({ target: plans.variantId, set: variant })
			.returning();

		console.log(`${variant.name} synced with the database...`);

		productVariants.push(insertedPlan);
	}

	// Fetch products from the Lemon Squeezy store.
	const products = await listProducts({
		filter: { storeId: env.LEMONSQUEEZY_STORE_ID },
		include: ["variants"],
	});

	// Loop through all the variants.
	const allVariants = products.data?.included as Variant["data"][] | undefined;

	// for...of supports asynchronous operations, unlike forEach.
	if (allVariants) {
		for (const v of allVariants) {
			const variant = v.attributes;

			// Skip draft variants or if there's more than one variant, skip the default
			// variant. See https://docs.lemonsqueezy.com/api/variants
			if (
				variant.status === "draft" ||
				(allVariants.length !== 1 && variant.status === "pending")
			) {
				continue;
			}

			// Fetch the Product name.
			const productName =
				(await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

			// Fetch the Price object.
			const variantPriceObject = await listPrices({
				filter: {
					variantId: v.id,
				},
			});

			const currentPriceObj = variantPriceObject.data?.data.at(0);
			const isUsageBased =
				currentPriceObj?.attributes.usage_aggregation !== null;
			const interval = currentPriceObj?.attributes.renewal_interval_unit;
			const intervalCount =
				currentPriceObj?.attributes.renewal_interval_quantity;
			const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
			const trialIntervalCount =
				currentPriceObj?.attributes.trial_interval_quantity;

			const price = isUsageBased
				? currentPriceObj?.attributes.unit_price_decimal
				: currentPriceObj?.attributes.unit_price;

			const priceString = price !== null ? (price?.toString() ?? "") : "";

			const isSubscription =
				currentPriceObj?.attributes.category === "subscription";

			// If not a subscription, skip it.
			if (!isSubscription) {
				continue;
			}

			await _addVariant({
				name: variant.name,
				description: variant.description,
				price: priceString,
				interval,
				intervalCount,
				isUsageBased,
				productId: variant.product_id,
				productName,
				variantId: Number.parseInt(v.id, 10) as number,
				trialInterval,
				trialIntervalCount,
				sort: variant.sort,
			});
		}
	}

	return productVariants;
}

/**
 * Get the checkout URL for a plan
 */
export async function getCheckoutURL(variantId: number, embed = false) {
	configureLemonSqueezy();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("User is not authenticated.");
	}

	const checkout = await createCheckout(env.LEMONSQUEEZY_STORE_ID, variantId, {
		checkoutOptions: {
			embed,
			media: false,
			logo: !embed,
		},
		checkoutData: {
			email: session.user.email ?? undefined,
			custom: {
				user_id: session.user.id,
			},
		},
		productOptions: {
			enabledVariants: [variantId],
			redirectUrl: `${env.BETTER_AUTH_URL}/app/billing/?checkout=success`,
			receiptButtonText: "Go to Dashboard",
			receiptThankYouNote: "Thank you for subscribing to CompileStrength!",
		},
	});

	return checkout.data?.data.attributes.url;
}

/**
 * Get user subscriptions from the database
 */
export async function getUserSubscriptions() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	return await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.userId, session.user.id));
}

/**
 * Get user's active subscription
 */
export async function getActiveSubscription() {
	const userSubs = await getUserSubscriptions();

	return userSubs.find(
		(sub) => sub.status === "active" || sub.status === "on_trial",
	);
}

/**
 * Store a webhook event in the database
 */
export async function storeWebhookEvent(
	eventName: string,
	body: Record<string, unknown>,
) {
	const event = await db
		.insert(webhookEvents)
		.values({
			eventName,
			body,
			processed: false,
		})
		.returning();

	return event[0].id;
}

/**
 * Process a webhook event from the database
 */
export async function processWebhookEvent(webhookEventId: string) {
	configureLemonSqueezy();

	const dbWebhookEvent = await db
		.select()
		.from(webhookEvents)
		.where(eq(webhookEvents.id, webhookEventId))
		.limit(1);

	if (dbWebhookEvent.length < 1) {
		throw new Error(
			`Webhook event #${webhookEventId} not found in the database.`,
		);
	}

	const webhookEvent = dbWebhookEvent[0];
	let processingError = "";
	const eventBody = webhookEvent.body;

	if (!webhookHasMeta(eventBody)) {
		processingError = "Event body is missing the 'meta' property.";
	} else if (webhookHasData(eventBody)) {
		if (webhookEvent.eventName.startsWith("subscription_")) {
			const attributes = eventBody.data.attributes;
			const variantId = attributes.variant_id as string;

			// Get the plan
			const plan = await db
				.select()
				.from(plans)
				.where(eq(plans.variantId, Number.parseInt(variantId, 10)))
				.limit(1);

			if (plan.length < 1) {
				processingError = `Plan with variantId ${variantId} not found.`;
			} else {
				const subscriptionItem =
					attributes.first_subscription_item as SubscriptionItem;
				const priceId = subscriptionItem.price_id;

				// Get the price data from Lemon Squeezy.
				const priceData = await getPrice(priceId);
				if (priceData.error) {
					processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
				}

				const isUsageBased = subscriptionItem.is_usage_based;
				const price = isUsageBased
					? priceData.data?.data.attributes.unit_price_decimal
					: priceData.data?.data.attributes.unit_price;

				const updateData: NewSubscription = {
					lemonSqueezyId: eventBody.data.id,
					orderId: attributes.order_id as number,
					name: attributes.user_name as string,
					email: attributes.user_email as string,
					status: attributes.status as string,
					statusFormatted: attributes.status_formatted as string,
					renewsAt: attributes.renews_at as string,
					endsAt: attributes.ends_at as string,
					trialEndsAt: attributes.trial_ends_at as string,
					price: price?.toString() ?? "",
					isPaused: false,
					subscriptionItemId: subscriptionItem.id,
					isUsageBased: subscriptionItem.is_usage_based,
					userId: eventBody.meta.custom_data?.user_id ?? "",
					planId: plan[0].id,
				};

				// Create/update subscription in the database.
				try {
					await db.insert(subscriptions).values(updateData).onConflictDoUpdate({
						target: subscriptions.lemonSqueezyId,
						set: updateData,
					});

					// Revalidate billing page after subscription update
					revalidatePath("/app/billing");
				} catch (error) {
					processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`;
					console.error(error);
				}
			}
		}
	}

	// Update the webhook event in the database.
	await db
		.update(webhookEvents)
		.set({
			processed: true,
			processingError,
		})
		.where(eq(webhookEvents.id, webhookEventId));
}

/**
 * Cancel a subscription
 */
export async function cancelSub(id: string) {
	configureLemonSqueezy();

	// Get user subscriptions
	const userSubscriptions = await getUserSubscriptions();

	// Check if the subscription exists
	const subscription = userSubscriptions.find(
		(sub) => sub.lemonSqueezyId === id,
	);

	if (!subscription) {
		throw new Error(`Subscription #${id} not found.`);
	}

	const cancelledSub = await cancelSubscription(id);

	if (cancelledSub.error) {
		throw new Error(cancelledSub.error.message);
	}

	// Update the db
	try {
		await db
			.update(subscriptions)
			.set({
				status: cancelledSub.data?.data.attributes.status,
				statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
				endsAt: cancelledSub.data?.data.attributes.ends_at,
			})
			.where(eq(subscriptions.lemonSqueezyId, id));
	} catch (_error) {
		console.error(_error);
		throw new Error(`Failed to cancel Subscription #${id} in the database.`);
	}

	revalidatePath("/");

	return cancelledSub;
}

/**
 * Pause a subscription
 */
export async function pauseUserSubscription(id: string) {
	configureLemonSqueezy();

	const userSubscriptions = await getUserSubscriptions();

	const subscription = userSubscriptions.find(
		(sub) => sub.lemonSqueezyId === id,
	);

	if (!subscription) {
		throw new Error(`Subscription #${id} not found.`);
	}

	const returnedSub = await updateSubscription(id, {
		pause: {
			mode: "void",
		},
	});

	// Update the db
	try {
		await db
			.update(subscriptions)
			.set({
				status: returnedSub.data?.data.attributes.status,
				statusFormatted: returnedSub.data?.data.attributes.status_formatted,
				endsAt: returnedSub.data?.data.attributes.ends_at,
				isPaused: returnedSub.data?.data.attributes.pause !== null,
			})
			.where(eq(subscriptions.lemonSqueezyId, id));
	} catch (_error) {
		console.error(_error);
		throw new Error(`Failed to pause Subscription #${id} in the database.`);
	}

	revalidatePath("/");

	return returnedSub;
}

/**
 * Unpause a subscription
 */
export async function unpauseUserSubscription(id: string) {
	configureLemonSqueezy();

	const userSubscriptions = await getUserSubscriptions();

	const subscription = userSubscriptions.find(
		(sub) => sub.lemonSqueezyId === id,
	);

	if (!subscription) {
		throw new Error(`Subscription #${id} not found.`);
	}

	const returnedSub = await updateSubscription(id, {
		pause: null,
	});

	try {
		await db
			.update(subscriptions)
			.set({
				status: returnedSub.data?.data.attributes.status,
				statusFormatted: returnedSub.data?.data.attributes.status_formatted,
				endsAt: returnedSub.data?.data.attributes.ends_at,
				isPaused: returnedSub.data?.data.attributes.pause !== null,
			})
			.where(eq(subscriptions.lemonSqueezyId, id));
	} catch (_error) {
		console.error(_error);
		throw new Error(`Failed to unpause Subscription #${id} in the database.`);
	}

	revalidatePath("/");

	return returnedSub;
}

/**
 * Get subscription URLs (update payment method, customer portal)
 */
export async function getSubscriptionURLs(id: string) {
	configureLemonSqueezy();

	// Verify subscription ownership before accessing external API
	const userSubscriptions = await getUserSubscriptions();
	const ownedSubscription = userSubscriptions.find(
		(sub) => sub.lemonSqueezyId === id,
	);

	if (!ownedSubscription) {
		throw new Error(
			"Unauthorized: Subscription does not belong to current user",
		);
	}

	const subscription = await getSubscription(id);

	if (subscription.error) {
		throw new Error(subscription.error.message);
	}

	return subscription.data?.data.attributes.urls;
}

/**
 * Change plan
 */
export async function changePlan(currentPlanId: string, newPlanId: string) {
	configureLemonSqueezy();

	// Get user subscriptions
	const userSubscriptions = await getUserSubscriptions();

	// Check if the subscription exists
	const subscription = userSubscriptions.find(
		(sub) => sub.planId === currentPlanId,
	);

	if (!subscription) {
		throw new Error(
			`No subscription with plan id #${currentPlanId} was found.`,
		);
	}

	// Get the new plan details from the database.
	const newPlan = await db
		.select()
		.from(plans)
		.where(eq(plans.id, newPlanId))
		.limit(1);

	if (newPlan.length < 1) {
		throw new Error(`Plan #${newPlanId} not found.`);
	}

	// Send request to Lemon Squeezy to change the subscription.
	const updatedSub = await updateSubscription(subscription.lemonSqueezyId, {
		variantId: newPlan[0].variantId,
	});

	// Save in db
	try {
		await db
			.update(subscriptions)
			.set({
				planId: newPlanId,
				price: newPlan[0].price,
				endsAt: updatedSub.data?.data.attributes.ends_at,
			})
			.where(eq(subscriptions.lemonSqueezyId, subscription.lemonSqueezyId));
	} catch (_error) {
		console.error(_error);
		throw new Error(
			`Failed to update Subscription #${subscription.lemonSqueezyId} in the database.`,
		);
	}

	revalidatePath("/");

	return updatedSub;
}
