import { createId } from "@paralleldrive/cuid2";
import {
	boolean,
	index,
	integer,
	json,
	pgTable,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "../auth.schema";

export const workoutPrograms = pgTable(
	"WorkoutProgram",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		goalType: text("goalType").notNull(), // strength, hypertrophy, endurance, general
		experienceLevel: text("experienceLevel").notNull(), // beginner, intermediate, advanced
		frequency: integer("frequency").notNull(), // workouts per week
		durationWeeks: integer("durationWeeks").notNull(),
		isActive: boolean("isActive").notNull().default(true),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("WorkoutProgram_userId_idx").on(table.userId),
	}),
);

export const workoutDays = pgTable(
	"WorkoutDay",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		programId: text("programId")
			.notNull()
			.references(() => workoutPrograms.id, { onDelete: "cascade" }),
		dayNumber: integer("dayNumber").notNull(), // 1-7 for day of week
		name: text("name").notNull(), // "Push Day A", "Pull Day B"
		type: text("type").notNull(), // push, pull, legs, upper, lower, full, rest
		description: text("description"),
	},
	(table) => ({
		programIdIdx: index("WorkoutDay_programId_idx").on(table.programId),
	}),
);

export const exercises = pgTable("Exercise", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull().unique(),
	description: text("description"),
	muscleGroup: text("muscleGroup").notNull(), // chest, back, legs, shoulders, arms, core
	equipmentType: text("equipmentType").notNull(), // barbell, dumbbell, machine, bodyweight, cable
	difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
	videoUrl: text("videoUrl"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const programExercises = pgTable(
	"ProgramExercise",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		workoutDayId: text("workoutDayId")
			.notNull()
			.references(() => workoutDays.id, { onDelete: "cascade" }),
		exerciseId: text("exerciseId")
			.notNull()
			.references(() => exercises.id),
		sets: integer("sets").notNull(),
		reps: text("reps").notNull(), // "8-12" or "10" for ranges
		restSeconds: integer("restSeconds").notNull().default(90),
		notes: text("notes"),
		order: integer("order").notNull(), // order in workout
	},
	(table) => ({
		workoutDayIdIdx: index("ProgramExercise_workoutDayId_idx").on(
			table.workoutDayId,
		),
		exerciseIdIdx: index("ProgramExercise_exerciseId_idx").on(table.exerciseId),
	}),
);

export const workoutSessions = pgTable(
	"WorkoutSession",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		workoutDayId: text("workoutDayId").references(() => workoutDays.id),
		startTime: timestamp("startTime").notNull().defaultNow(),
		endTime: timestamp("endTime"),
		notes: text("notes"),
		completedAt: timestamp("completedAt"),
	},
	(table) => ({
		userIdIdx: index("WorkoutSession_userId_idx").on(table.userId),
		workoutDayIdIdx: index("WorkoutSession_workoutDayId_idx").on(
			table.workoutDayId,
		),
	}),
);

export const workoutSets = pgTable(
	"WorkoutSet",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		sessionId: text("sessionId")
			.notNull()
			.references(() => workoutSessions.id, { onDelete: "cascade" }),
		exerciseId: text("exerciseId")
			.notNull()
			.references(() => exercises.id),
		setNumber: integer("setNumber").notNull(),
		reps: integer("reps").notNull(),
		weight: real("weight").notNull(),
		rpe: integer("rpe"), // Rate of Perceived Exertion 1-10
		completedAt: timestamp("completedAt").notNull().defaultNow(),
	},
	(table) => ({
		sessionIdIdx: index("WorkoutSet_sessionId_idx").on(table.sessionId),
		exerciseIdIdx: index("WorkoutSet_exerciseId_idx").on(table.exerciseId),
	}),
);

export const personalRecords = pgTable(
	"PersonalRecord",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		exerciseId: text("exerciseId")
			.notNull()
			.references(() => exercises.id),
		weight: real("weight").notNull(),
		reps: integer("reps").notNull(),
		recordType: text("recordType").notNull(), // 1rm, 3rm, 5rm, volume
		achievedAt: timestamp("achievedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("PersonalRecord_userId_idx").on(table.userId),
		exerciseIdIdx: index("PersonalRecord_exerciseId_idx").on(table.exerciseId),
	}),
);

export const workoutRoutines = pgTable(
	"WorkoutRoutine",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		routine: json("routine").notNull(), // JSON object containing the full routine structure
		agentType: text("agentType").notNull().default("bodybuilding"), // bodybuilding, powerlifting, endurance, general
		conversationId: text("conversationId"),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("WorkoutRoutine_userId_idx").on(table.userId),
		conversationIdIdx: index("WorkoutRoutine_conversationId_idx").on(
			table.conversationId,
		),
	}),
);
