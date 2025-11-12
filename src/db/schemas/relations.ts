import { relations } from "drizzle-orm";
import { users } from "../auth.schema";
import { agentConversations } from "./ai.schema";
import { plans, subscriptions, usageTracking } from "./billing.schema";
import { userPreferences } from "./user.schema";
import {
	workoutPrograms,
	workoutDays,
	exercises,
	programExercises,
	workoutSessions,
	workoutSets,
	personalRecords,
	workoutRoutines,
} from "./workout.schema";

// Workout Relations
export const workoutProgramsRelations = relations(
	workoutPrograms,
	({ one, many }) => ({
		user: one(users, {
			fields: [workoutPrograms.userId],
			references: [users.id],
		}),
		workoutDays: many(workoutDays),
	}),
);

export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
	program: one(workoutPrograms, {
		fields: [workoutDays.programId],
		references: [workoutPrograms.id],
	}),
	exercises: many(programExercises),
	workoutSessions: many(workoutSessions),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
	programExercises: many(programExercises),
	workoutSets: many(workoutSets),
	personalRecords: many(personalRecords),
}));

export const programExercisesRelations = relations(
	programExercises,
	({ one }) => ({
		workoutDay: one(workoutDays, {
			fields: [programExercises.workoutDayId],
			references: [workoutDays.id],
		}),
		exercise: one(exercises, {
			fields: [programExercises.exerciseId],
			references: [exercises.id],
		}),
	}),
);

export const workoutSessionsRelations = relations(
	workoutSessions,
	({ one, many }) => ({
		user: one(users, {
			fields: [workoutSessions.userId],
			references: [users.id],
		}),
		workoutDay: one(workoutDays, {
			fields: [workoutSessions.workoutDayId],
			references: [workoutDays.id],
		}),
		sets: many(workoutSets),
	}),
);

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
	session: one(workoutSessions, {
		fields: [workoutSets.sessionId],
		references: [workoutSessions.id],
	}),
	exercise: one(exercises, {
		fields: [workoutSets.exerciseId],
		references: [exercises.id],
	}),
}));

export const personalRecordsRelations = relations(
	personalRecords,
	({ one }) => ({
		user: one(users, {
			fields: [personalRecords.userId],
			references: [users.id],
		}),
		exercise: one(exercises, {
			fields: [personalRecords.exerciseId],
			references: [exercises.id],
		}),
	}),
);

export const workoutRoutinesRelations = relations(
	workoutRoutines,
	({ one }) => ({
		user: one(users, {
			fields: [workoutRoutines.userId],
			references: [users.id],
		}),
		conversation: one(agentConversations, {
			fields: [workoutRoutines.conversationId],
			references: [agentConversations.id],
		}),
	}),
);

// User Relations
export const userPreferencesRelations = relations(
	userPreferences,
	({ one }) => ({
		user: one(users, {
			fields: [userPreferences.userId],
			references: [users.id],
		}),
	}),
);

// AI Relations
export const agentConversationsRelations = relations(
	agentConversations,
	({ one, many }) => ({
		user: one(users, {
			fields: [agentConversations.userId],
			references: [users.id],
		}),
		routines: many(workoutRoutines),
	}),
);

// Billing Relations
export const plansRelations = relations(plans, ({ many }) => ({
	subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(
	subscriptions,
	({ one, many }) => ({
		user: one(users, {
			fields: [subscriptions.userId],
			references: [users.id],
		}),
		plan: one(plans, {
			fields: [subscriptions.planId],
			references: [plans.id],
		}),
		usageTracking: many(usageTracking),
	}),
);

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
	user: one(users, {
		fields: [usageTracking.userId],
		references: [users.id],
	}),
	subscription: one(subscriptions, {
		fields: [usageTracking.subscriptionId],
		references: [subscriptions.id],
	}),
}));