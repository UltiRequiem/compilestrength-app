import { z } from "zod";

export const exerciseSchema = z.object({
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
