import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { workoutSessions, workoutSets } from "@/db/schema";

export async function createWorkoutSet(
	sessionId: string,
	userId: string,
	exerciseId: string,
	setNumber: number,
	reps: number,
	weight: number,
	rpe?: number,
) {
	// Verify the session belongs to the user
	const [workoutSession] = await db
		.select()
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.id, sessionId),
				eq(workoutSessions.userId, userId),
			),
		);

	if (!workoutSession) {
		throw new Error("Session not found or unauthorized");
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

	return newSet;
}

export async function updateWorkoutSet(
	setId: string,
	userId: string,
	reps: number,
	weight: number,
	rpe?: number,
) {
	// Verify the set belongs to the user
	const [existingSet] = await db
		.select({
			setId: workoutSets.id,
			sessionId: workoutSessions.id,
			userId: workoutSessions.userId,
		})
		.from(workoutSets)
		.innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id))
		.where(eq(workoutSets.id, setId));

	if (!existingSet || existingSet.userId !== userId) {
		throw new Error("Set not found or unauthorized");
	}

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

	return updatedSet;
}

export async function deleteWorkoutSet(setId: string, userId: string) {
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

	if (!existingSet || existingSet.userId !== userId) {
		throw new Error("Set not found or unauthorized");
	}

	// Delete set
	await db.delete(workoutSets).where(eq(workoutSets.id, setId));

	return { success: true };
}
