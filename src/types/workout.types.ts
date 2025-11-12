// Shared workout types used across the application

export interface Exercise {
	id: string;
	exerciseId?: string; // For DB references
	name?: string; // For display purposes
	exerciseName?: string; // Alternative naming
	muscleGroups?: string[];
	muscleGroup?: string; // Alternative naming
	equipment?: string;
	equipmentType?: string; // Alternative naming
	sets: number;
	reps: string; // e.g., "8-12", "10", "AMRAP"
	restPeriod?: number; // seconds
	restSeconds?: number; // Alternative naming
	weight?: number;
	notes?: string;
	order?: number;
	difficulty?: string;
	description?: string;
	videoUrl?: string;
}

export interface WorkoutDay {
	id: string;
	programId?: string;
	dayNumber?: number;
	name: string; // e.g., "Push Day", "Pull Day", "Legs"
	type?: string; // push, pull, legs, upper, lower, full, rest
	exercises: Exercise[];
	order?: number;
	description?: string;
}

export interface WorkoutProgram {
	id: string;
	userId?: string;
	name: string;
	description?: string;
	days: WorkoutDay[];
	goalType?: string; // strength, hypertrophy, endurance, general
	experienceLevel?: string; // beginner, intermediate, advanced
	frequency?: number; // workouts per week / days per week
	duration?: number; // weeks
	durationWeeks?: number; // Alternative naming
	difficulty?: "beginner" | "intermediate" | "advanced";
	goals?: string[]; // e.g., ["muscle_gain", "strength", "endurance"]
	isActive?: boolean;
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

export interface WorkoutRoutine extends WorkoutProgram {
	// Extended version used in compiler/store
	routine?: any; // JSON object containing the full routine structure
	agentType?: string; // bodybuilding, powerlifting, endurance, general
	conversationId?: string;
}

export interface Set {
	id?: string;
	number?: number;
	setNumber?: number; // Alternative naming
	weight: number;
	reps: number | null;
	rpe?: number | null; // Rate of Perceived Exertion 1-10
	completed?: boolean;
	completedAt?: Date | string;
	sessionId?: string;
	exerciseId?: string;
}

export interface ExerciseWithSets extends Exercise {
	completedSets: Set[];
}

export interface WorkoutSession {
	id: string;
	userId: string;
	workoutDayId?: string;
	startTime: Date | string;
	endTime?: Date | string;
	notes?: string;
	completedAt?: Date | string;
	sets?: Set[];
}

export interface PersonalRecord {
	id: string;
	userId: string;
	exerciseId: string;
	weight: number;
	reps: number;
	recordType: string; // 1rm, 3rm, 5rm, volume
	achievedAt: Date | string;
}

export interface UserProfile {
	experience: "beginner" | "intermediate" | "advanced";
	goals: string[];
	availableEquipment: string[];
	timeConstraints: {
		daysPerWeek: number;
		minutesPerSession: number;
	};
	physicalLimitations?: string[];
	preferences?: {
		favoriteExercises?: string[];
		exercisesToAvoid?: string[];
	};
}