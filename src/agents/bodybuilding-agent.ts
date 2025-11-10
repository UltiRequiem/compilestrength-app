import { tool } from "ai";
import { z } from "zod";
import type {
	Exercise,
	WorkoutDay,
	WorkoutRoutine,
} from "@/stores/workout-routine-store";

const exerciseSchema = z.object({
	name: z.string().describe("The name of the exercise"),
	muscleGroups: z
		.array(z.string())
		.describe("Primary and secondary muscle groups targeted"),
	equipment: z.string().describe("Equipment needed for the exercise"),
	sets: z.number().min(1).describe("Number of sets to perform"),
	reps: z.string().describe('Number of reps (e.g., "8-12", "10", "AMRAP")'),
	restPeriod: z.number().min(30).describe("Rest period in seconds"),
	weight: z
		.number()
		.optional()
		.describe("Starting weight in pounds (optional)"),
	notes: z.string().optional().describe("Exercise-specific notes or form cues"),
});

const workoutDaySchema = z.object({
	name: z
		.string()
		.describe('Name of the workout day (e.g., "Push Day", "Pull Day")'),
	exercises: z.array(exerciseSchema).describe("List of exercises for this day"),
});

const userProfileSchema = z.object({
	experience: z
		.enum(["beginner", "intermediate", "advanced"])
		.describe("Training experience level"),
	goals: z
		.array(z.string())
		.describe("Training goals (e.g., muscle_gain, strength, fat_loss)"),
	availableEquipment: z.array(z.string()).describe("Available equipment"),
	timeConstraints: z.object({
		daysPerWeek: z
			.number()
			.min(1)
			.max(7)
			.describe("Number of training days per week"),
		minutesPerSession: z
			.number()
			.min(30)
			.describe("Minutes available per session"),
	}),
	physicalLimitations: z
		.array(z.string())
		.optional()
		.describe("Any injuries or physical limitations"),
	preferences: z
		.object({
			favoriteExercises: z.array(z.string()).optional(),
			exercisesToAvoid: z.array(z.string()).optional(),
		})
		.optional(),
});

const routineSchema = z.object({
	name: z.string().describe("Name of the workout routine"),
	description: z
		.string()
		.optional()
		.describe("Brief description of the routine"),
	days: z.array(workoutDaySchema).describe("Workout days in the routine"),
	frequency: z.number().min(1).max(7).describe("Training frequency per week"),
	duration: z.number().min(4).describe("Program duration in weeks"),
	difficulty: z
		.enum(["beginner", "intermediate", "advanced"])
		.describe("Routine difficulty level"),
	goals: z.array(z.string()).describe("Primary goals of the routine"),
});

// Tool to update user profile
export const updateUserProfile = tool({
	description:
		"Update or set the user's profile information including experience, goals, and constraints",
	inputSchema: userProfileSchema,
	execute: async (profile) => {
		// This will be called by the API route to update the Zustand store
		return {
			success: true,
			message: `Updated user profile with ${profile.experience} experience level targeting ${profile.goals.join(
				", ",
			)}`,
			profile,
		};
	},
});

// Tool to create or update the entire workout routine
export const createWorkoutRoutine = tool({
	description:
		"Create a complete workout routine based on user profile and goals",
	inputSchema: routineSchema,
	execute: async (routine) => {
		const routineWithMetadata: WorkoutRoutine = {
			id: crypto.randomUUID(),
			...routine,
			createdAt: new Date(),
			updatedAt: new Date(),
			days: routine.days.map((day, dayIndex) => ({
				id: crypto.randomUUID(),
				...day,
				order: dayIndex,
				exercises: day.exercises.map((exercise, exerciseIndex) => ({
					id: crypto.randomUUID(),
					...exercise,
					order: exerciseIndex,
				})),
			})),
		};

		return {
			success: true,
			message: `Created ${routine.name} - a ${routine.difficulty} ${routine.frequency}x/week routine`,
			routine: routineWithMetadata,
		};
	},
});

// Tool to add a workout day
export const addWorkoutDay = tool({
	description: "Add a new workout day to the existing routine",
	inputSchema: workoutDaySchema,
	execute: async (day) => {
		const dayWithId: WorkoutDay = {
			id: crypto.randomUUID(),
			...day,
			order: 0, // Will be set by the store
			exercises: day.exercises.map((exercise, index) => ({
				id: crypto.randomUUID(),
				...exercise,
				order: index,
			})),
		};

		return {
			success: true,
			message: `Added ${day.name} with ${day.exercises.length} exercises`,
			day: dayWithId,
		};
	},
});

// Tool to add an exercise to a specific day
export const addExercise = tool({
	description: "Add a new exercise to a specific workout day",
	inputSchema: z.object({
		dayName: z
			.string()
			.describe("Name of the workout day to add the exercise to"),
		exercise: exerciseSchema,
	}),
	execute: async ({ dayName, exercise }) => {
		const exerciseWithId: Exercise = {
			id: crypto.randomUUID(),
			...exercise,
			order: 0, // Will be set by the store
		};

		return {
			success: true,
			message: `Added ${exercise.name} to ${dayName}`,
			dayName,
			exercise: exerciseWithId,
		};
	},
});

// Tool to explain exercise selection and reasoning
export const explainChoice = tool({
	description:
		"Provide detailed explanation for exercise selection, programming choices, or routine structure",
	inputSchema: z.object({
		topic: z
			.string()
			.describe(
				"What to explain (exercise choice, rep range, frequency, etc.)",
			),
		reasoning: z
			.string()
			.describe("Detailed explanation of the reasoning behind the choice"),
		evidence: z
			.string()
			.optional()
			.describe("Scientific evidence or principles supporting the choice"),
	}),
	execute: async ({ topic, reasoning, evidence }) => {
		return {
			success: true,
			message: `Explained ${topic}`,
			explanation: {
				topic,
				reasoning,
				evidence,
			},
		};
	},
});

// Tool to set generation progress
export const setGenerationProgress = tool({
	description: "Update the progress of routine generation for user feedback",
	inputSchema: z.object({
		steps: z.array(
			z.object({
				step: z.string(),
				description: z.string(),
				completed: z.boolean(),
			}),
		),
	}),
	execute: async ({ steps }) => {
		return {
			success: true,
			message: "Updated generation progress",
			steps,
		};
	},
});

export const BODYBUILDING_SYSTEM_PROMPT = `You are CompileStrength's Bodybuilding Programming AI Assistant, a world-class expert in hypertrophy-focused training and muscle development.

Your expertise includes:
- Evidence-based muscle hypertrophy principles
- Progressive overload strategies
- Exercise selection for maximum muscle growth
- Volume, intensity, and frequency optimization
- Body part specialization techniques
- Periodization for bodybuilding
- Form and technique optimization
- Recovery and adaptation strategies

Your role is to:
1. Gather comprehensive user information through natural conversation
2. Create personalized bodybuilding routines optimized for muscle growth
3. Provide detailed explanations for all programming decisions
4. Continuously refine and improve routines based on user feedback

**Information Gathering Process:**
Always collect this information before creating a routine:
- Training experience (beginner/intermediate/advanced)
- Primary goals (muscle gain, strength, fat loss, specific body parts)
- Available equipment (home gym, commercial gym, specific limitations)
- Time constraints (days per week, session duration)
- Physical limitations or injuries
- Exercise preferences and dislikes
- Previous training history

**Programming Principles:**
- Prioritize compound movements for beginners, add isolation for intermediate/advanced
- Use progressive overload as the primary driver of growth
- Recommend 10-20 sets per muscle group per week based on experience
- Use rep ranges of 6-20 for hypertrophy, with most work in 8-15 range
- Program adequate recovery: 48-72 hours between hitting same muscle groups
- Include both heavy and light days for optimal growth
- Focus on full range of motion and mind-muscle connection

**Routine Structure Guidelines:**
- Beginners: 3-4 days, full body or upper/lower splits
- Intermediate: 4-5 days, push/pull/legs or upper/lower splits
- Advanced: 5-6 days, push/pull/legs, body part splits, or specialized routines

**Communication Style:**
- Be conversational and encouraging
- Ask follow-up questions to understand user needs
- Always explain the "why" behind your recommendations
- Use evidence-based reasoning
- Provide alternatives when possible
- Be enthusiastic about helping users achieve their goals
- DO NOT use markdown formatting (no #, **, -, etc.) - use plain text only
- Use simple text formatting instead of markdown

**IMPORTANT - Routine Display Rules:**
- NEVER write out the full routine details (exercises, sets, reps) in the chat
- The routine is automatically displayed in the right panel via the tools
- Only provide high-level summaries, explanations, and notes in chat
- Focus on explaining your programming choices, reasoning, and tips
- Example: "I've created a 4-day push/pull/legs split for you. I chose barbell bench press as the main chest builder because..." instead of listing every exercise

**Tool Usage:**
- Use updateUserProfile when gathering user information
- Use createWorkoutRoutine for complete routine creation (the routine will appear in the right panel automatically)
- Use addWorkoutDay or addExercise for routine modifications
- Use explainChoice to provide reasoning for your decisions and programming notes
- Use setGenerationProgress to show routine creation steps
- After using createWorkoutRoutine, provide a brief summary and explanation, NOT the full details

Start each conversation by introducing yourself and asking about the user's bodybuilding goals and experience level. Keep the conversation flowing naturally while gathering the information you need to create their optimal routine.

Remember: Every recommendation should be backed by scientific principles and tailored to the individual user's needs, goals, and constraints.`;

export const bodybuildingTools = {
	updateUserProfile,
	createWorkoutRoutine,
	addWorkoutDay,
	addExercise,
	explainChoice,
	setGenerationProgress,
};
