import { and, desc, eq, sql } from "drizzle-orm";
import { DebuggerClient } from "@/components/debugger/debugger-client";
import { db } from "@/db";
import { exercises, workoutSessions, workoutSets } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";

export default async function DebuggerPage() {
	const sessionData = await requireAuth();

	// Fetch recent workout sessions for analysis
	const recentSessions = await db
		.select({
			id: workoutSessions.id,
			completedAt: workoutSessions.completedAt,
		})
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
			),
		)
		.orderBy(desc(workoutSessions.completedAt))
		.limit(20);

	// Fetch exercise data with sets for analysis
	const exerciseData = await db
		.select({
			exerciseId: workoutSets.exerciseId,
			exerciseName: exercises.name,
			weight: workoutSets.weight,
			reps: workoutSets.reps,
			rpe: workoutSets.rpe,
			completedAt: workoutSessions.completedAt,
			sessionId: workoutSets.sessionId,
		})
		.from(workoutSets)
		.innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
		.innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id))
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
			),
		)
		.orderBy(desc(workoutSessions.completedAt))
		.limit(100);

	// Analyze progressive overload for each exercise
	const exerciseHistory = new Map<
		string,
		Array<{ weight: number; reps: number; date: Date }>
	>();

	exerciseData.forEach((set) => {
		if (!exerciseHistory.has(set.exerciseName)) {
			exerciseHistory.set(set.exerciseName, []);
		}
		exerciseHistory.get(set.exerciseName)?.push({
			weight: Number(set.weight),
			reps: set.reps,
			date: new Date(set.completedAt!),
		});
	});

	const issues: Array<{
		id: string;
		severity: "critical" | "warning" | "info";
		title: string;
		description: string;
		details: string[];
		trend: string;
	}> = [];

	const workingWell: Array<{ id: string; text: string }> = [];

	// Check for progressive overload issues
	exerciseHistory.forEach((history, exerciseName) => {
		if (history.length >= 4) {
			// Sort by date descending (most recent first)
			const sorted = history.sort(
				(a, b) => b.date.getTime() - a.date.getTime(),
			);
			const last4 = sorted.slice(0, 4);

			// Check if weight has been stagnant
			const weights = last4.map((s) => s.weight);
			const allSame = weights.every((w) => w === weights[0]);

			if (allSame && history.length >= 6) {
				// Check last 6 weeks
				const last6Weeks = sorted.filter(
					(s) => s.date.getTime() > Date.now() - 6 * 7 * 24 * 60 * 60 * 1000,
				);
				if (
					last6Weeks.length >= 4 &&
					last6Weeks.every((s) => s.weight === weights[0])
				) {
					issues.push({
						id: `overload-${exerciseName}`,
						severity: "warning",
						title: "No Progressive Overload Detected",
						description: `Your ${exerciseName} weight hasn't increased recently`,
						details: [
							`at ${exerciseName}`,
							`Last 4 sessions: ${weights[0]} lbs × ${last4
								.map((s) => s.reps)
								.join(", ")} reps`,
							`Recommended: Increase weight by 5 lbs or add 1-2 reps`,
						],
						trend: "flat",
					});
				} else {
					// Progressive overload is happening
					workingWell.push({
						id: `overload-good-${exerciseName}`,
						text: `Consistent progressive overload on ${exerciseName}`,
					});
				}
			}
		}
	});

	// Check for high RPE (fatigue accumulation)
	const recentRPE = exerciseData
		.filter((s) => s.rpe !== null && s.rpe !== undefined)
		.slice(0, 20)
		.map((s) => s.rpe as number);

	if (recentRPE.length >= 10) {
		const avgRPE =
			recentRPE.reduce((sum, rpe) => sum + rpe, 0) / recentRPE.length;

		if (avgRPE >= 9) {
			issues.push({
				id: "fatigue-high-rpe",
				severity: "info",
				title: "High Fatigue Accumulation",
				description: "Your average RPE has been consistently high",
				details: [
					`Average RPE: ${avgRPE.toFixed(1)} (last ${recentRPE.length} sets)`,
					"Recommended: Consider a deload week or reduce intensity",
					"Signs: Training at or near failure consistently",
				],
				trend: "high",
			});
		}
	}

	// Check training frequency
	if (recentSessions.length >= 4) {
		const uniqueDates = new Set(
			recentSessions.map((s) => new Date(s.completedAt!).toDateString()),
		);
		const weeksTracked = 4; // Looking at last 4 sessions
		const sessionsPerWeek = uniqueDates.size / weeksTracked;

		if (sessionsPerWeek < 2 && uniqueDates.size >= 4) {
			issues.push({
				id: "frequency-low",
				severity: "info",
				title: "Low Training Frequency",
				description: "You're training less than 2 times per week",
				details: [
					`Current: ~${sessionsPerWeek.toFixed(1)} sessions/week`,
					"Recommended: 3-5 sessions/week for optimal progress",
					"Research suggests: Higher frequency leads to better results",
				],
				trend: "low",
			});
		} else if (sessionsPerWeek >= 3) {
			workingWell.push({
				id: "frequency-good",
				text: `Great training frequency (~${sessionsPerWeek.toFixed(
					1,
				)} sessions/week)`,
			});
		}
	}

	// Check exercise variety
	const uniqueExercises = new Set(exerciseData.map((s) => s.exerciseName));
	if (uniqueExercises.size >= 5) {
		workingWell.push({
			id: "variety-good",
			text: `Good exercise variety (${uniqueExercises.size} different exercises)`,
		});
	}

	// If no issues found and user has data, add positive message
	if (issues.length === 0 && exerciseData.length > 0) {
		workingWell.push({
			id: "overall-good",
			text: "Your training is progressing well overall",
		});
	}

	// Calculate last analyzed time
	const lastAnalyzed =
		recentSessions.length > 0
			? new Date(recentSessions[0].completedAt!).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})
			: "Never";

	// Mock previous analyses (would be stored in database in production)
	const previousAnalyses =
		recentSessions.length >= 2
			? recentSessions.slice(0, 2).map((session, idx) => ({
					id: session.id,
					date: new Date(session.completedAt!).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					}),
					issuesFound: idx === 0 ? issues.length : 2,
					issuesResolved: idx === 0 ? 0 : 1,
				}))
			: [];

	return (
		<DebuggerClient
			issues={issues}
			workingWell={workingWell}
			previousAnalyses={previousAnalyses}
			lastAnalyzed={lastAnalyzed}
		/>
	);
}
