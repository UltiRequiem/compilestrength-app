import { z } from "zod";
import { exerciseSchema } from "../../schemas/exercise";

export const addExerciseSchema = z.object({
	dayName: z
		.string()
		.describe("Name of the workout day to add the exercise to"),
	exercise: exerciseSchema,
});
