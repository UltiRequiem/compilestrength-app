import { z } from "zod";

export const explainChoiceSchema = z.object({
	topic: z
		.string()
		.describe("What to explain (exercise choice, rep range, frequency, etc.)"),
	reasoning: z
		.string()
		.describe("Detailed explanation of the reasoning behind the choice"),
	evidence: z
		.string()
		.optional()
		.describe("Scientific evidence or principles supporting the choice"),
});
