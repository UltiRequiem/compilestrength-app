import { tool } from "ai";
import { userProfileSchema } from "./schema";

export const updateUserProfile = tool({
	description:
		"Update or set the user's profile information including experience, goals, and constraints",
	inputSchema: userProfileSchema,
	async execute(profile) {
		const goals = profile.goals.join(", ");

		return {
			success: true,
			message: `Updated user profile with ${profile.experience} experience level targeting ${goals}`,
			profile,
		};
	},
});
