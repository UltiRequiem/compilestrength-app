import { tool } from "ai";
import { explainChoiceSchema } from "./schema";

export const explainChoice = tool({
	description:
		"Provide detailed explanation for exercise selection, programming choices, or routine structure",
	inputSchema: explainChoiceSchema,
	execute: async ({ topic, reasoning, evidence }) => {
		return {
			success: true,
			message: `Explained ${topic}`,
			explanation: {
				topic,
				reasoning,
				evidence,
			},
		};
	},
});
