import { z } from "zod";

export const userProfileSchema = z.object({
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
