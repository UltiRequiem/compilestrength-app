import { tool } from "ai";
import type { Exercise } from "@/stores/workout-routine-store";
import { addExerciseSchema } from "./schema";

export const addExercise = tool({
	description: "Add a new exercise to a specific workout day",
	inputSchema: addExerciseSchema,
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
