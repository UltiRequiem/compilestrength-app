import { createId } from "@paralleldrive/cuid2";
import {
	index,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "../auth.schema";

export const agentConversations = pgTable(
	"AgentConversation",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		agentType: text("agentType").notNull(), // bodybuilding, powerlifting, endurance, general
		messages: json("messages").notNull(), // Array of UIMessage objects
		userProfile: json("userProfile"), // User profile data collected during conversation
		status: text("status").notNull().default("active"), // active, completed, archived
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("AgentConversation_userId_idx").on(table.userId),
		statusIdx: index("AgentConversation_status_idx").on(table.status),
	}),
);