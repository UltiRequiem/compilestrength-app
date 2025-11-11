"use server";

import { and, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions, usageTracking } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getActiveSubscription } from "./lemonsqueezy";

type UsagePeriod = typeof usageTracking.$inferSelect;

/**
 * Get or create the current usage period for a subscription
 */
async function getCurrentUsagePeriod(
	subscriptionId: string,
): Promise<UsagePeriod> {
	const subscription = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.id, subscriptionId))
		.limit(1);

	if (!subscription[0]) {
		throw new Error("Subscription not found");
	}

	const sub = subscription[0];

	// Calculate period based on subscription creation date
	// Periods start from the subscription creation date and last 7 days
	const subCreatedAt = new Date(sub.createdAt);
	const now = new Date();

	// Calculate the number of weeks since subscription started
	const daysSinceStart = Math.floor(
		(now.getTime() - subCreatedAt.getTime()) / (1000 * 60 * 60 * 24),
	);
	const weekNumber = Math.floor(daysSinceStart / 7);

	// Calculate the current period start and end
	const periodStart = new Date(subCreatedAt);
	periodStart.setDate(periodStart.getDate() + weekNumber * 7);

	const periodEnd = new Date(periodStart);
	periodEnd.setDate(periodEnd.getDate() + 7);

	// Check if we have a usage record for this period
	const existingPeriod = await db
		.select()
		.from(usageTracking)
		.where(
			and(
				eq(usageTracking.subscriptionId, subscriptionId),
				eq(usageTracking.userId, sub.userId),
				gte(usageTracking.periodStart, periodStart),
				lte(usageTracking.periodEnd, periodEnd),
			),
		)
		.limit(1);

	if (existingPeriod.length > 0) {
		return existingPeriod[0];
	}

	// Create new period
	const newPeriod = await db
		.insert(usageTracking)
		.values({
			userId: sub.userId,
			subscriptionId,
			periodStart,
			periodEnd,
			compilesUsed: 0,
			compilesLimit: 1,
			routineEditsUsed: 0,
			routineEditsLimit: 5,
			aiMessagesUsed: 0,
			aiMessagesLimit: 50,
		})
		.returning();

	return newPeriod[0];
}

/**
 * Get current user's usage for the current period
 */
export async function getCurrentUsage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	const subscription = await getActiveSubscription();

	if (!subscription) {
		return null;
	}

	return await getCurrentUsagePeriod(subscription.id);
}

/**
 * Check if user can perform a compile (has not exceeded limit)
 */
export async function canCompile(): Promise<{
	allowed: boolean;
	used: number;
	limit: number;
	resetsAt?: Date;
}> {
	const usage = await getCurrentUsage();

	if (!usage) {
		return { allowed: false, used: 0, limit: 1 };
	}

	return {
		allowed: usage.compilesUsed < usage.compilesLimit,
		used: usage.compilesUsed,
		limit: usage.compilesLimit,
		resetsAt: new Date(usage.periodEnd),
	};
}

/**
 * Increment compile usage
 */
export async function incrementCompileUsage() {
	const usage = await getCurrentUsage();

	if (!usage) {
		throw new Error("No active subscription");
	}

	if (usage.compilesUsed >= usage.compilesLimit) {
		throw new Error("Compile limit reached for this period");
	}

	await db
		.update(usageTracking)
		.set({
			compilesUsed: usage.compilesUsed + 1,
			updatedAt: new Date(),
		})
		.where(eq(usageTracking.id, usage.id));

	return {
		used: usage.compilesUsed + 1,
		limit: usage.compilesLimit,
	};
}

/**
 * Check if user can edit routine
 */
export async function canEditRoutine(): Promise<{
	allowed: boolean;
	used: number;
	limit: number;
	resetsAt?: Date;
}> {
	const usage = await getCurrentUsage();

	if (!usage) {
		return { allowed: false, used: 0, limit: 5 };
	}

	return {
		allowed: usage.routineEditsUsed < usage.routineEditsLimit,
		used: usage.routineEditsUsed,
		limit: usage.routineEditsLimit,
		resetsAt: new Date(usage.periodEnd),
	};
}

/**
 * Increment routine edit usage
 */
export async function incrementRoutineEditUsage() {
	const usage = await getCurrentUsage();

	if (!usage) {
		throw new Error("No active subscription");
	}

	if (usage.routineEditsUsed >= usage.routineEditsLimit) {
		throw new Error("Routine edit limit reached for this period");
	}

	await db
		.update(usageTracking)
		.set({
			routineEditsUsed: usage.routineEditsUsed + 1,
			updatedAt: new Date(),
		})
		.where(eq(usageTracking.id, usage.id));

	return {
		used: usage.routineEditsUsed + 1,
		limit: usage.routineEditsLimit,
	};
}

/**
 * Check if user can send AI message
 */
export async function canSendMessage(): Promise<{
	allowed: boolean;
	used: number;
	limit: number;
	resetsAt?: Date;
}> {
	const usage = await getCurrentUsage();

	if (!usage) {
		return { allowed: false, used: 0, limit: 50 };
	}

	return {
		allowed: usage.aiMessagesUsed < usage.aiMessagesLimit,
		used: usage.aiMessagesUsed,
		limit: usage.aiMessagesLimit,
		resetsAt: new Date(usage.periodEnd),
	};
}

/**
 * Increment AI message usage
 */
export async function incrementMessageUsage() {
	const usage = await getCurrentUsage();

	if (!usage) {
		throw new Error("No active subscription");
	}

	if (usage.aiMessagesUsed >= usage.aiMessagesLimit) {
		throw new Error("AI message limit reached for this period");
	}

	await db
		.update(usageTracking)
		.set({
			aiMessagesUsed: usage.aiMessagesUsed + 1,
			updatedAt: new Date(),
		})
		.where(eq(usageTracking.id, usage.id));

	return {
		used: usage.aiMessagesUsed + 1,
		limit: usage.aiMessagesLimit,
	};
}
