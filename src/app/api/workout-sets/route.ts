import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { workoutSessions, workoutSets } from "@/db/schema";
import { auth } from "@/lib/auth";
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
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validatedData = createWorkoutSetSchema.parse(body);
		const { sessionId, exerciseId, setNumber, reps, weight, rpe } =
			validatedData;

		const [workoutSession] = await db
			.select()
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.id, sessionId),
					eq(workoutSessions.userId, session.user.id),
				),
			);

		if (!workoutSession) {
			return NextResponse.json(
				{ error: "Session not found or unauthorized" },
				{ status: 404 },
			);
		}

		const [newSet] = await db
			.insert(workoutSets)
			.values({
				sessionId,
				exerciseId,
				setNumber,
				reps,
				weight,
				rpe,
			})
			.returning();

		return NextResponse.json(newSet);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error creating workout set:", error);
		return createErrorResponse("Failed to create workout set");
	}
}

export async function PATCH(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validatedData = updateWorkoutSetSchema.parse(body);
		const { setId, reps, weight, rpe } = validatedData;

		// Verify the set belongs to the user's session
		const [existingSet] = await db
			.select({
				setId: workoutSets.id,
				sessionId: workoutSessions.id,
				userId: workoutSessions.userId,
			})
			.from(workoutSets)
			.innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id))
			.where(eq(workoutSets.id, setId));

		if (!existingSet || existingSet.userId !== session.user.id) {
			return NextResponse.json(
				{ error: "Set not found or unauthorized" },
				{ status: 404 },
			);
		}

		// Update set
		const [updatedSet] = await db
			.update(workoutSets)
			.set({
				reps,
				weight,
				rpe,
				completedAt: new Date(),
			})
			.where(eq(workoutSets.id, setId))
			.returning();

		return NextResponse.json(updatedSet);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error updating workout set:", error);
		return createErrorResponse("Failed to update workout set");
	}
}

export async function DELETE(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const setId = searchParams.get("setId");
		const validatedData = validateRequest(deleteWorkoutSetSchema, { setId });
		const validatedSetId = validatedData.setId;

		// Verify the set belongs to the user's session
		const [existingSet] = await db
			.select({
				setId: workoutSets.id,
				sessionId: workoutSessions.id,
				userId: workoutSessions.userId,
			})
			.from(workoutSets)
			.innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id))
			.where(eq(workoutSets.id, validatedSetId));

		if (!existingSet || existingSet.userId !== session.user.id) {
			return NextResponse.json(
				{ error: "Set not found or unauthorized" },
				{ status: 404 },
			);
		}

		// Delete set
		await db.delete(workoutSets).where(eq(workoutSets.id, validatedSetId));

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error deleting workout set:", error);
		return createErrorResponse("Failed to delete workout set");
	}
}
