import { z } from "zod";
import { exerciseSchema } from "./exercise";

export const workoutDaySchema = z.object({
	name: z
		.string()
		.describe('Name of the workout day (e.g., "Push Day", "Pull Day")'),
	exercises: z.array(exerciseSchema).describe("List of exercises for this day"),
});
