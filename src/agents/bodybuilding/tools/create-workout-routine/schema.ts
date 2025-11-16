import { z } from "zod";
import { workoutDaySchema } from "../../schemas/workout-day";

export const routineSchema = z.object({
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
