// Main bodybuilding agent exports

// Shared tool imports
import { explainChoice, setGenerationProgress } from "../shared/tools";
export { explainChoice, setGenerationProgress };
export { BODYBUILDING_SYSTEM_PROMPT } from "./prompts";

// Tool imports
import { addExercise } from "./tools/add-exercise";
import { addWorkoutDay } from "./tools/add-workout-day";
import { createWorkoutRoutine } from "./tools/create-workout-routine";
import { updateUserProfile } from "./tools/update-user-profile";

// Re-export tools
export { addExercise, addWorkoutDay, createWorkoutRoutine, updateUserProfile };

// Combined tools object for easy import
export const bodybuildingTools = {
	updateUserProfile,
	createWorkoutRoutine,
	addWorkoutDay,
	addExercise,
	explainChoice,
	setGenerationProgress,
};
