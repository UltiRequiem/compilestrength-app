import { tool } from "ai";
import type { WorkoutDay } from "@/stores/workout-routine-store";
import { workoutDaySchema } from "./schema";

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
