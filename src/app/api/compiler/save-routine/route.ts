import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
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
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const validatedData = validateRequest(saveRoutineSchema, body);
		const { routine: rawRoutine } = validatedData;

		// Transform string dates to Date objects using type-safe helper
		const routine = transformTimestamps(rawRoutine);

		const savedProgram = await saveWorkoutRoutineToDb(routine, session.user.id);

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
