import { tool } from "ai";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";
import { routineSchema } from "./schema";

export const createWorkoutRoutine = tool({
	description:
		"Create a complete workout routine based on user profile and goals",
	inputSchema: routineSchema,
	async execute(routine) {
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
