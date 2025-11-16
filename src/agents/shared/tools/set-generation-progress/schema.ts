import { z } from "zod";

export const setGenerationProgressSchema = z.object({
	steps: z.array(
		z.object({
			step: z.string(),
			description: z.string(),
			completed: z.boolean(),
		}),
	),
});
