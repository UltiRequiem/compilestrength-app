import { tool } from "ai";
import { setGenerationProgressSchema } from "./schema";

export const setGenerationProgress = tool({
	description: "Update the progress of routine generation for user feedback",
	inputSchema: setGenerationProgressSchema,
	execute: async ({ steps }) => {
		return {
			success: true,
			message: "Updated generation progress",
			steps,
		};
	},
});
