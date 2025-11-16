import { z } from "zod";

export const planSchema = z.object({
	id: z.string(),
	productId: z.number().int(),
	productName: z.string().optional(),
	variantId: z.number().int(),
	name: z.string(),
	description: z.string().optional(),
	price: z.string(),
	isUsageBased: z.boolean().optional(),
	interval: z.string().optional(),
	intervalCount: z.number().int().optional(),
	trialInterval: z.string().optional(),
	trialIntervalCount: z.number().int().optional(),
	sort: z.number().int().optional(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
});

export const subscriptionSchema = z.object({
	id: z.string(),
	lemonSqueezyId: z.string(),
	orderId: z.number().int(),
	name: z.string(),
	email: z.email(),
	status: z.string(),
	statusFormatted: z.string(),
	renewsAt: z.string().optional(),
	endsAt: z.string().optional(),
	trialEndsAt: z.string().optional(),
	price: z.string(),
	isUsageBased: z.boolean().optional(),
	isPaused: z.boolean().optional(),
	subscriptionItemId: z.number().int().optional(),
	userId: z.string(),
	planId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const webhookEventSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	eventName: z.string(),
	processed: z.boolean().optional(),
	body: z.record(z.string(), z.unknown()),
	processingError: z.string().optional(),
});

export const usageTrackingSchema = z.object({
	id: z.string(),
	userId: z.string(),
	subscriptionId: z.string(),
	periodStart: z.date(),
	periodEnd: z.date(),
	compilesUsed: z.number().int(),
	compilesLimit: z.number().int(),
	routineEditsUsed: z.number().int(),
	routineEditsLimit: z.number().int(),
	aiMessagesUsed: z.number().int(),
	aiMessagesLimit: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Plan = z.infer<typeof planSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;
export type UsageTracking = z.infer<typeof usageTrackingSchema>;
