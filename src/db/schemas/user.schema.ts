import {
	integer,
	pgTable,
	text,
} from "drizzle-orm/pg-core";
import { users } from "../auth.schema";

export const userPreferences = pgTable("UserPreferences", {
	userId: text("userId")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	units: text("units").notNull().default("lbs"), // lbs or kg
	restTimerDefault: integer("restTimerDefault").notNull().default(90), // seconds
	trainingGoal: text("trainingGoal"), // strength, hypertrophy, endurance
	experienceLevel: text("experienceLevel"), // beginner, intermediate, advanced
	availableDays: integer("availableDays"), // days per week
});