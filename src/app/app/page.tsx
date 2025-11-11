import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { db } from "@/db";
import {
	exercises,
	programExercises,
	workoutDays,
	workoutPrograms,
} from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";

interface Exercise {
	id: string;
	name: string;
	muscleGroups: string[];
	equipment: string | null;
	sets: number;
	reps: string;
	restPeriod: number | null;
	notes: string;
	order: number;
	weight?: number;
}

interface WorkoutDay {
	id: string;
	name: string;
	type: string;
	dayNumber: number;
	exercises: Exercise[];
}

// Type guards for runtime validation
function isWorkoutDay(value: unknown): value is WorkoutDay {
	if (typeof value !== "object" || value === null) return false;
	const day = value as Record<string, unknown>;
	return (
		typeof day.id === "string" &&
		typeof day.name === "string" &&
		typeof day.type === "string" &&
		typeof day.dayNumber === "number" &&
		Array.isArray(day.exercises)
	);
}

// Cached function to get user routines - cache for 5 minutes
const getCachedUserRoutines = unstable_cache(
	async (userId: string) => {
		try {
			console.log("📋 Fetching workout routines for user from DB:", userId);

			// Get only the most recent active program for dashboard display
			const programs = await db
				.select()
				.from(workoutPrograms)
				.where(eq(workoutPrograms.userId, userId))
				.orderBy(desc(workoutPrograms.createdAt))
				.limit(1); // Only get the most recent routine for dashboard

			console.log("✅ Found", programs.length, "workout programs");

			if (programs.length === 0) {
				return [];
			}

			const program = programs[0];

			// Get workout days for this program
			const days = await db
				.select()
				.from(workoutDays)
				.where(eq(workoutDays.programId, program.id))
				.orderBy(workoutDays.dayNumber);

			// Get first few exercises from first few days for dashboard preview
			const daysWithLimitedExercises = await Promise.all(
				days.slice(0, 6).map(async (day) => {
					// Limit to first 6 days
					// Get only first 3 exercises per day for dashboard preview
					const programExercisesWithDetails = await db
						.select({
							id: programExercises.id,
							sets: programExercises.sets,
							reps: programExercises.reps,
							restSeconds: programExercises.restSeconds,
							notes: programExercises.notes,
							order: programExercises.order,
							exercise: {
								id: exercises.id,
								name: exercises.name,
								muscleGroup: exercises.muscleGroup,
								equipmentType: exercises.equipmentType,
							},
						})
						.from(programExercises)
						.innerJoin(exercises, eq(programExercises.exerciseId, exercises.id))
						.where(eq(programExercises.workoutDayId, day.id))
						.orderBy(programExercises.order)
						.limit(3); // Only get first 3 exercises per day for performance

					return {
						id: day.id,
						name: day.name,
						type: day.type,
						dayNumber: day.dayNumber,
						exercises: programExercisesWithDetails.map((pe) => ({
							id: pe.exercise.id,
							name: pe.exercise.name,
							muscleGroups: [pe.exercise.muscleGroup],
							equipment: pe.exercise.equipmentType,
							sets: pe.sets,
							reps: pe.reps,
							restPeriod: pe.restSeconds,
							notes: pe.notes || "",
							order: pe.order,
						})),
					};
				}),
			);

			const routine = {
				id: program.id,
				name: program.name,
				description: program.description || "",
				difficulty: program.experienceLevel,
				frequency: program.frequency,
				duration: program.durationWeeks,
				goals: program.goalType.split(","),
				days: daysWithLimitedExercises,
				createdAt: program.createdAt,
				updatedAt: program.updatedAt,
				isActive: program.isActive,
			};

			return [routine];
		} catch (error) {
			console.error("Error fetching routines from database:", error);
			return [];
		}
	},
	["user-routines"], // Cache key prefix
	{
		revalidate: 300, // Cache for 5 minutes
		tags: ["user-routines"], // Tag for cache invalidation
	},
);

export default async function DashboardPage() {
	const session = await requireAuth();
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Fetch user's actual workout routines (cached for performance)
	const userRoutines = await getCachedUserRoutines(session.user.id);

	// Generate week days based on user's routines
	const weekDays =
		userRoutines.length > 0
			? // If user has routines, show the first routine's days
				userRoutines[0].days
					.slice(0, 7)
					.filter(isWorkoutDay)
					.map((day, index) => ({
						day:
							["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] ||
							`Day ${index + 1}`,
						workout: day.name,
						status:
							index === 3 ? "today" : index < 3 ? "completed" : "upcoming",
					}))
			: // Fallback to default data
				[
					{ day: "Mon", workout: "No routine yet", status: "upcoming" },
					{ day: "Tue", workout: "No routine yet", status: "upcoming" },
					{ day: "Wed", workout: "No routine yet", status: "upcoming" },
					{ day: "Thu", workout: "Generate routine", status: "today" },
					{ day: "Fri", workout: "Use AI Compiler", status: "upcoming" },
					{ day: "Sat", workout: "Create program", status: "upcoming" },
					{ day: "Sun", workout: "Rest day", status: "upcoming" },
				];

	// Generate recent activity from user's routines
	const recentActivity =
		userRoutines.length > 0
			? userRoutines[0].days
					.slice(0, 2)
					.flatMap((day: any) =>
						day.exercises.slice(0, 3).map((exercise: any) => ({
							exercise: exercise.name,
							sets: exercise.sets,
							reps: parseInt(exercise.reps.toString().split("-")[0], 10) || 8,
							weight: exercise.weight || 225,
							date: "From your routine",
						})),
					)
					.slice(0, 5)
			: // Fallback data
				[
					{
						exercise: "Create a routine",
						sets: 1,
						reps: 1,
						weight: 0,
						date: "Use AI Compiler",
					},
					{
						exercise: "Get started",
						sets: 1,
						reps: 1,
						weight: 0,
						date: "Visit /compiler",
					},
				];

	return (
		<DashboardClient
			userName={session.user.name}
			today={today}
			weekDays={weekDays}
			recentActivity={recentActivity}
		/>
	);
}
