import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-middleware";
import {
	createWorkoutSession,
	getActiveWorkoutSession,
	updateWorkoutSession,
} from "@/lib/queries";
import {
	createErrorResponse,
	createValidationErrorResponse,
	ValidationError,
	validateRequest,
} from "@/lib/validation";
import {
	createWorkoutSessionSchema,
	updateWorkoutSessionSchema,
} from "@/schemas";

export async function GET() {
	try {
		const userId = await getAuthenticatedUserId();
		const activeSession = await getActiveWorkoutSession(userId);

		return NextResponse.json(activeSession);
	} catch (error) {
		console.error("Error fetching workout session:", error);

		return NextResponse.json(
			{ error: "Failed to fetch workout session" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const userId = await getAuthenticatedUserId();
		const body = await request.json();

		const { workoutDayId, notes } = validateRequest(
			createWorkoutSessionSchema,
			body,
		);

		const newSession = await createWorkoutSession(userId, workoutDayId, notes);

		return NextResponse.json(newSession);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		console.error("Error creating workout session:", error);

		return createErrorResponse("Failed to create workout session");
	}
}

export async function PATCH(request: Request) {
	try {
		const userId = await getAuthenticatedUserId();
		const body = await request.json();
		const validatedData = validateRequest(updateWorkoutSessionSchema, body);
		const { sessionId, endTime, notes, completed } = validatedData;

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 },
			);
		}

		const updatedSession = await updateWorkoutSession(sessionId, userId, {
			endTime: endTime ? new Date(endTime) : undefined,
			notes,
			completed,
		});

		return NextResponse.json(updatedSession);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error updating workout session:", error);
		return createErrorResponse("Failed to update workout session");
	}
}
