import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { workoutSessions, workoutSets } from "@/db/schema";

export async function getActiveWorkoutSession(userId: string) {
	const activeSessions = await db
		.select()
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, userId),
				isNull(workoutSessions.completedAt),
			),
		)
		.orderBy(desc(workoutSessions.startTime))
		.limit(1);

	if (activeSessions.length === 0) {
		return null;
	}

	// Fetch sets for the active session
	const sets = await db
		.select()
		.from(workoutSets)
		.where(eq(workoutSets.sessionId, activeSessions[0].id))
		.orderBy(workoutSets.completedAt);

	return {
		...activeSessions[0],
		sets,
	};
}

export async function createWorkoutSession(
	userId: string,
	workoutDayId: string,
	notes?: string,
) {
	// Check if there's already an active session
	const activeSessions = await db
		.select()
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, userId),
				isNull(workoutSessions.completedAt),
			),
		);

	if (activeSessions.length > 0) {
		throw new Error("You already have an active workout session");
	}

	// Create new session
	const [newSession] = await db
		.insert(workoutSessions)
		.values({
			userId,
			workoutDayId,
			notes,
		})
		.returning();

	return newSession;
}

export async function updateWorkoutSession(
	sessionId: string,
	userId: string,
	updateData: {
		endTime?: Date;
		notes?: string;
		completed?: boolean;
	},
) {
	const updatePayload: Partial<{
		endTime: Date;
		notes: string;
		completedAt: Date;
	}> = {};

	if (updateData.endTime) updatePayload.endTime = updateData.endTime;
	if (updateData.notes !== undefined) updatePayload.notes = updateData.notes;
	if (updateData.completed) updatePayload.completedAt = new Date();

	const [updatedSession] = await db
		.update(workoutSessions)
		.set(updatePayload)
		.where(
			and(
				eq(workoutSessions.id, sessionId),
				eq(workoutSessions.userId, userId),
			),
		)
		.returning();

	return updatedSession;
}
