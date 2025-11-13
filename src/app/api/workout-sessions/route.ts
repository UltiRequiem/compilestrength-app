import { and, desc, eq, isNull } from "drizzle-orm";
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
	createWorkoutSessionSchema,
	updateWorkoutSessionSchema,
} from "@/schemas";

export async function GET() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Check for active (incomplete) session
		const activeSessions = await db
			.select()
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, session.user.id),
					isNull(workoutSessions.completedAt),
				),
			)
			.orderBy(desc(workoutSessions.startTime))
			.limit(1);

		if (activeSessions.length > 0) {
			// Fetch sets for the active session
			const sets = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.sessionId, activeSessions[0].id))
				.orderBy(workoutSets.completedAt);

			return NextResponse.json({
				...activeSessions[0],
				sets,
			});
		}

		return NextResponse.json(null);
	} catch (error) {
		console.error("Error fetching workout session:", error);
		return NextResponse.json(
			{ error: "Failed to fetch workout session" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validatedData = validateRequest(createWorkoutSessionSchema, body);
		const { workoutDayId, notes } = validatedData;

		// Check if there's already an active session
		const activeSessions = await db
			.select()
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, session.user.id),
					isNull(workoutSessions.completedAt),
				),
			);

		if (activeSessions.length > 0) {
			return NextResponse.json(
				{ error: "You already have an active workout session" },
				{ status: 400 },
			);
		}

		// Create new session
		const [newSession] = await db
			.insert(workoutSessions)
			.values({
				userId: session.user.id,
				workoutDayId,
				notes,
			})
			.returning();

		return NextResponse.json(newSession);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error creating workout session:", error);
		return createErrorResponse("Failed to create workout session");
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
		const validatedData = validateRequest(updateWorkoutSessionSchema, body);
		const { sessionId, endTime, notes, completed } = validatedData;

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 },
			);
		}

		const updateData: Partial<{
			endTime: Date;
			notes: string;
			completedAt: Date;
		}> = {};

		if (endTime) updateData.endTime = new Date(endTime);
		if (notes !== undefined) updateData.notes = notes;
		if (completed) updateData.completedAt = new Date();

		const [updatedSession] = await db
			.update(workoutSessions)
			.set(updateData)
			.where(
				and(
					eq(workoutSessions.id, sessionId),
					eq(workoutSessions.userId, session.user.id),
				),
			)
			.returning();

		return NextResponse.json(updatedSession);
	} catch (error) {
		if (error instanceof ValidationError) {
			return createValidationErrorResponse(error);
		}
		console.error("Error updating workout session:", error);
		return createErrorResponse("Failed to update workout session");
	}
}
