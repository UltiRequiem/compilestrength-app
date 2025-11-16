import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-middleware";
import {
	createWorkoutSet,
	deleteWorkoutSet,
	updateWorkoutSet,
} from "@/lib/queries";
import {
	createErrorResponse,
	createValidationErrorResponse,
	ValidationError,
	validateRequest,
} from "@/lib/validation";
import {
	createWorkoutSetSchema,
	deleteWorkoutSetSchema,
	updateWorkoutSetSchema,
} from "@/schemas";

export async function POST(request: Request) {
	try {
		const userId = await getAuthenticatedUserId();
		const body = await request.json();
		const validatedData = createWorkoutSetSchema.parse(body);
		const { sessionId, exerciseId, setNumber, reps, weight, rpe } =
			validatedData;

		const newSet = await createWorkoutSet(
			sessionId,
			userId,
			exerciseId,
			setNumber,
			reps,
			weight || 0, // Fallback to 0 if weight is undefined
			rpe,
		);

		return NextResponse.json(newSet);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("Error creating workout set:", error);
		return createErrorResponse("Failed to create workout set");
	}
}

export async function PATCH(request: Request) {
	try {
		const userId = await getAuthenticatedUserId();
		const body = await request.json();
		const validatedData = updateWorkoutSetSchema.parse(body);
		const { setId, reps, weight, rpe } = validatedData;

		const updatedSet = await updateWorkoutSet(
			setId,
			userId,
			reps,
			weight || 0,
			rpe,
		);

		return NextResponse.json(updatedSet);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("Error updating workout set:", error);
		return createErrorResponse("Failed to update workout set");
	}
}

export async function DELETE(request: Request) {
	try {
		const userId = await getAuthenticatedUserId();
		const { searchParams } = new URL(request.url);
		const setId = searchParams.get("setId");
		const validatedData = validateRequest(deleteWorkoutSetSchema, { setId });
		const validatedSetId = validatedData.setId;

		const result = await deleteWorkoutSet(validatedSetId, userId);

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("Error deleting workout set:", error);
		return createErrorResponse("Failed to delete workout set");
	}
}
