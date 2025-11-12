import { createId } from "@paralleldrive/cuid2";
import {
	boolean,
	index,
	integer,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "../auth.schema";

export const plans = pgTable("Plan", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	productId: integer("productId").notNull(),
	productName: text("productName"),
	variantId: integer("variantId").notNull().unique(),
	name: text("name").notNull(),
	description: text("description"),
	price: text("price").notNull(),
	isUsageBased: boolean("isUsageBased").default(false),
	interval: text("interval"),
	intervalCount: integer("intervalCount"),
	trialInterval: text("trialInterval"),
	trialIntervalCount: integer("trialIntervalCount"),
	sort: integer("sort"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const subscriptions = pgTable(
	"Subscription",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		lemonSqueezyId: text("lemonSqueezyId").unique().notNull(),
		orderId: integer("orderId").notNull(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		status: text("status").notNull(),
		statusFormatted: text("statusFormatted").notNull(),
		renewsAt: text("renewsAt"),
		endsAt: text("endsAt"),
		trialEndsAt: text("trialEndsAt"),
		price: text("price").notNull(),
		isUsageBased: boolean("isUsageBased").default(false),
		isPaused: boolean("isPaused").default(false),
		subscriptionItemId: integer("subscriptionItemId"),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		planId: text("planId")
			.notNull()
			.references(() => plans.id),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("Subscription_userId_idx").on(table.userId),
		planIdIdx: index("Subscription_planId_idx").on(table.planId),
		lemonSqueezyIdIdx: index("Subscription_lemonSqueezyId_idx").on(
			table.lemonSqueezyId,
		),
	}),
);

export const webhookEvents = pgTable(
	"WebhookEvent",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		eventName: text("eventName").notNull(),
		processed: boolean("processed").default(false),
		body: json("body").notNull(),
		processingError: text("processingError"),
	},
	(table) => ({
		eventNameIdx: index("WebhookEvent_eventName_idx").on(table.eventName),
		processedIdx: index("WebhookEvent_processed_idx").on(table.processed),
	}),
);

export const usageTracking = pgTable(
	"UsageTracking",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		subscriptionId: text("subscriptionId")
			.notNull()
			.references(() => subscriptions.id, { onDelete: "cascade" }),
		periodStart: timestamp("periodStart").notNull(),
		periodEnd: timestamp("periodEnd").notNull(),
		compilesUsed: integer("compilesUsed").notNull().default(0),
		compilesLimit: integer("compilesLimit").notNull().default(1),
		routineEditsUsed: integer("routineEditsUsed").notNull().default(0),
		routineEditsLimit: integer("routineEditsLimit").notNull().default(5),
		aiMessagesUsed: integer("aiMessagesUsed").notNull().default(0),
		aiMessagesLimit: integer("aiMessagesLimit").notNull().default(50),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("UsageTracking_userId_idx").on(table.userId),
		subscriptionIdIdx: index("UsageTracking_subscriptionId_idx").on(
			table.subscriptionId,
		),
		periodIdx: index("UsageTracking_period_idx").on(
			table.periodStart,
			table.periodEnd,
		),
	}),
);