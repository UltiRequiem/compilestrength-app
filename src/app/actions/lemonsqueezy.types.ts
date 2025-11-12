import { plans, subscriptions } from "@/db/schema";

export type NewPlan = typeof plans.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export interface SubscriptionItem {
	id: number;
	price_id: number;
	is_usage_based: boolean;
}