import type { NextRequest } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-middleware";
import { transformTimestamps } from "@/lib/date-transform";
import {
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ValidationError,
	validateRequest,
} from "@/lib/validation";
import { saveWorkoutRoutineToDb } from "@/lib/workout-db";
import { saveRoutineSchema } from "@/schemas";

export async function POST(req: NextRequest) {
	try {
		const userId = await getAuthenticatedUserId();
		const body = await req.json();
		const validatedData = validateRequest(saveRoutineSchema, body);
		const { routine: rawRoutine } = validatedData;

		const routine = transformTimestamps(rawRoutine);

		const savedProgram = await saveWorkoutRoutineToDb(routine, userId);

		return createSuccessResponse(
			{ programId: savedProgram.id },
			"Workout routine saved successfully",
		);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}

		console.error("Save routine API error:", error);

		return createErrorResponse("Failed to save workout routine");
	}
}
