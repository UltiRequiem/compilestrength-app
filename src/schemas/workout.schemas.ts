import { z } from "zod";

// Base schemas for validation

export const createWorkoutSessionSchema = z.object({
	workoutDayId: z.string().min(1, "Workout day ID is required"),
	notes: z.string().optional(),
});

export const updateWorkoutSessionSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
	endTime: z.string().datetime().optional(),
	notes: z.string().optional(),
	completed: z.boolean().optional(),
});

export const createWorkoutSetSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
	exerciseId: z.string().min(1, "Exercise ID is required"),
	setNumber: z.number().int().min(1, "Set number must be at least 1"),
	reps: z.number().int().min(0, "Reps must be non-negative"),
	weight: z.number().min(0, "Weight must be non-negative"),
	rpe: z.number().int().min(1).max(10).optional(),
});

export const updateWorkoutSetSchema = z.object({
	setId: z.string().min(1, "Set ID is required"),
	reps: z.number().int().min(0, "Reps must be non-negative"),
	weight: z.number().min(0, "Weight must be non-negative"),
	rpe: z.number().int().min(1).max(10).optional(),
});

export const deleteWorkoutSetSchema = z.object({
	setId: z.string().min(1, "Set ID is required"),
});

export const saveRoutineSchema = z.object({
	routine: z.object({
		id: z.string(),
		name: z.string().min(1, "Routine name is required"),
		description: z.string().optional(),
		days: z.array(
			z.object({
				id: z.string(),
				name: z.string().min(1, "Day name is required"),
				exercises: z.array(
					z.object({
						id: z.string(),
						name: z.string().min(1, "Exercise name is required"),
						muscleGroups: z.array(z.string()),
						equipment: z.string(),
						sets: z.number().int().min(1),
						reps: z.string().min(1),
						restPeriod: z.number().min(0),
						weight: z.number().min(0).optional(),
						notes: z.string().optional(),
						order: z.number().int().min(0),
					}),
				),
				order: z.number().int().min(0),
			}),
		),
		frequency: z.number().int().min(1).max(7),
		duration: z.number().int().min(1),
		difficulty: z.enum(["beginner", "intermediate", "advanced"]),
		goals: z.array(z.string()),
		createdAt: z.union([z.date(), z.string().datetime()]),
		updatedAt: z.union([z.date(), z.string().datetime()]),
	}),
});

// Database entity schemas (for type inference)

export const exerciseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	muscleGroup: z.string(),
	equipmentType: z.string(),
	difficulty: z.string(),
	videoUrl: z.string().optional(),
	createdAt: z.date(),
});

export const workoutProgramSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	goalType: z.string(),
	experienceLevel: z.string(),
	frequency: z.number().int(),
	durationWeeks: z.number().int(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const workoutDaySchema = z.object({
	id: z.string(),
	programId: z.string(),
	dayNumber: z.number().int(),
	name: z.string(),
	type: z.string(),
	description: z.string().optional(),
});

export const programExerciseSchema = z.object({
	id: z.string(),
	workoutDayId: z.string(),
	exerciseId: z.string(),
	sets: z.number().int(),
	reps: z.string(),
	restSeconds: z.number().int(),
	notes: z.string().optional(),
	order: z.number().int(),
});

export const workoutSessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	workoutDayId: z.string().optional(),
	startTime: z.date(),
	endTime: z.date().optional(),
	notes: z.string().optional(),
	completedAt: z.date().optional(),
});

export const workoutSetSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	exerciseId: z.string(),
	setNumber: z.number().int(),
	reps: z.number().int(),
	weight: z.number(),
	rpe: z.number().int().optional(),
	completedAt: z.date(),
});

export const personalRecordSchema = z.object({
	id: z.string(),
	userId: z.string(),
	exerciseId: z.string(),
	weight: z.number(),
	reps: z.number().int(),
	recordType: z.string(),
	achievedAt: z.date(),
});

export const workoutRoutineSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	routine: z.record(z.string(), z.unknown()),
	agentType: z.string(),
	conversationId: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Inferred types for use throughout the application
export type CreateWorkoutSession = z.infer<typeof createWorkoutSessionSchema>;
export type UpdateWorkoutSession = z.infer<typeof updateWorkoutSessionSchema>;
export type CreateWorkoutSet = z.infer<typeof createWorkoutSetSchema>;
export type UpdateWorkoutSet = z.infer<typeof updateWorkoutSetSchema>;
export type DeleteWorkoutSet = z.infer<typeof deleteWorkoutSetSchema>;
export type SaveRoutine = z.infer<typeof saveRoutineSchema>;

export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutProgram = z.infer<typeof workoutProgramSchema>;
export type WorkoutDay = z.infer<typeof workoutDaySchema>;
export type ProgramExercise = z.infer<typeof programExerciseSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type PersonalRecord = z.infer<typeof personalRecordSchema>;
export type WorkoutRoutine = z.infer<typeof workoutRoutineSchema>;
