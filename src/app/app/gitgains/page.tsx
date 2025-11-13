import { and, count, desc, eq, sql } from "drizzle-orm";
import { GitGainsClient } from "@/components/gitgains/gitgains-client";
import { db } from "@/db";
import { exercises, workoutSessions, workoutSets } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";

export default async function GitGainsPage() {
	const sessionData = await requireAuth();

	// 1. Fetch recent workout sessions with aggregated stats (optimized single query)
	const recentSessionsWithStats = await db
		.select({
			id: workoutSessions.id,
			completedAt: workoutSessions.completedAt,
			setCount: sql<number>`COUNT(${workoutSets.id})`.as("setCount"),
			totalVolume: sql<number>`SUM(${workoutSets.weight} * ${workoutSets.reps})`.as(
				"totalVolume",
			),
		})
		.from(workoutSessions)
		.leftJoin(workoutSets, eq(workoutSets.sessionId, workoutSessions.id))
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
			),
		)
		.groupBy(workoutSessions.id, workoutSessions.completedAt)
		.orderBy(desc(workoutSessions.completedAt))
		.limit(10);

	// 2. Format commits for display
	const commits = recentSessionsWithStats.map((session) => {
		const completedDate = new Date(session.completedAt!);

		return {
			id: session.id,
			date: completedDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			time: completedDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			}),
			type: "Workout",
			message: `${session.setCount || 0} sets, ${Math.round(session.totalVolume || 0)} lbs volume`,
			prs: [],
		};
	});

	// 3. Fetch Personal Records (highest weight for each exercise)
	// More efficient: Use GROUP BY with MAX in database, limit to top exercises
	const personalRecords = await db
		.select({
			exerciseName: exercises.name,
			exerciseId: workoutSets.exerciseId,
			maxWeight: sql<number>`MAX(${workoutSets.weight})`.as("maxWeight"),
		})
		.from(workoutSets)
		.innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
		.innerJoin(
			workoutSessions,
			eq(workoutSets.sessionId, workoutSessions.id),
		)
		.where(eq(workoutSessions.userId, sessionData.user.id))
		.groupBy(exercises.name, workoutSets.exerciseId)
		.orderBy(desc(sql`MAX(${workoutSets.weight})`))
		.limit(6);

	// For each PR, get the specific set details (reps and date)
	const prsWithDetails = await Promise.all(
		personalRecords.map(async (pr) => {
			const [prSet] = await db
				.select({
					reps: workoutSets.reps,
					completedAt: workoutSessions.completedAt,
				})
				.from(workoutSets)
				.innerJoin(
					workoutSessions,
					eq(workoutSets.sessionId, workoutSessions.id),
				)
				.where(
					and(
						eq(workoutSets.exerciseId, pr.exerciseId),
						eq(workoutSets.weight, pr.maxWeight),
						eq(workoutSessions.userId, sessionData.user.id),
					),
				)
				.orderBy(desc(workoutSessions.completedAt))
				.limit(1);

			return {
				id: `pr-${pr.exerciseName}`,
				exercise: pr.exerciseName,
				record: `${pr.maxWeight} lbs × ${prSet?.reps || 1}`,
				date: prSet?.completedAt
					? new Date(prSet.completedAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})
					: "N/A",
				hasVideo: false,
			};
		}),
	);

	const prs = prsWithDetails;

	// 4. Calculate insights
	// Total workouts this month
	const firstDayOfMonth = new Date();
	firstDayOfMonth.setDate(1);
	firstDayOfMonth.setHours(0, 0, 0, 0);

	const [thisMonthWorkouts] = await db
		.select({ count: count() })
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
				sql`${workoutSessions.completedAt} >= ${firstDayOfMonth}`,
			),
		);

	// Calculate current streak
	const allSessions = await db
		.select({ completedAt: workoutSessions.completedAt })
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
			),
		)
		.orderBy(desc(workoutSessions.completedAt))
		.limit(30);

	let currentStreak = 0;
	if (allSessions.length > 0) {
		const sessionsMap = new Set(
			allSessions.map((s) => new Date(s.completedAt!).toDateString()),
		);
		const today = new Date();
		const checkDate = new Date(today);
		while (sessionsMap.has(checkDate.toDateString())) {
			currentStreak++;
			checkDate.setDate(checkDate.getDate() - 1);
		}
	}

	// Calculate total volume this month
	const thisMonthSets = await db
		.select({
			weight: workoutSets.weight,
			reps: workoutSets.reps,
		})
		.from(workoutSets)
		.innerJoin(
			workoutSessions,
			eq(workoutSets.sessionId, workoutSessions.id),
		)
		.where(
			and(
				eq(workoutSessions.userId, sessionData.user.id),
				sql`${workoutSessions.completedAt} IS NOT NULL`,
				sql`${workoutSessions.completedAt} >= ${firstDayOfMonth}`,
			),
		);

	const totalVolumeThisMonth = thisMonthSets.reduce(
		(sum, set) => sum + Number(set.weight) * set.reps,
		0,
	);

	const insights = [
		{
			id: "insight-total-workouts",
			title: "Workouts This Month",
			value: `${thisMonthWorkouts?.count || 0} sessions`,
			period: "and counting",
			icon: "Activity",
			color: "text-primary",
		},
		{
			id: "insight-longest-streak",
			title: "Current Streak",
			value: `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`,
			period: currentStreak > 0 ? "keep it up!" : "start today",
			icon: "Award",
			color: "text-primary",
		},
		{
			id: "insight-total-volume",
			title: "Total Volume This Month",
			value: totalVolumeThisMonth,
			period: `across ${thisMonthWorkouts?.count || 0} workouts`,
			icon: "TrendingUp",
			color: "text-primary",
		},
	];

	return <GitGainsClient commits={commits} prs={prs} insights={insights} />;
}
