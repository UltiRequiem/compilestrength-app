import { and, desc, eq, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { workoutSessions, workoutSets } from "@/db/schema";

export async function getActiveWorkoutSession(userId: string) {
	// Clean up any sessions older than 24 hours that aren't completed
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const cleanupResult = await db
		.update(workoutSessions)
		.set({ completedAt: new Date() })
		.where(
			and(
				eq(workoutSessions.userId, userId),
				isNull(workoutSessions.completedAt),
				lt(workoutSessions.startTime, oneDayAgo),
			),
		);

	// console.log("Session cleanup - cleaned up sessions:", cleanupResult);

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

	// console.log("getActiveWorkoutSession - found sessions:", activeSessions.length);

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
	if (updateData.completed !== undefined)
		updatePayload.completedAt = new Date();

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

export async function deleteWorkoutSession(sessionId: string, userId: string) {
	// console.log("deleteWorkoutSession - deleting session:", sessionId, "for user:", userId);

	// First delete all workout sets for this session
	await db.delete(workoutSets).where(eq(workoutSets.sessionId, sessionId));

	// Then delete the session
	const [deletedSession] = await db
		.delete(workoutSessions)
		.where(
			and(
				eq(workoutSessions.id, sessionId),
				eq(workoutSessions.userId, userId),
			),
		)
		.returning();

	// console.log("deleteWorkoutSession - deleted session:", deletedSession);
	return deletedSession;
}
