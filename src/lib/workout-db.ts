import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exercises,
	programExercises,
	workoutDays,
	workoutPrograms,
} from "@/db/schema";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";

export async function saveWorkoutRoutineToDb(
	routine: WorkoutRoutine,
	userId: string,
) {
	console.log("💾 Saving workout routine to database:", routine.name);

	try {
		// Check if a program with the same name and user already exists
		const existingProgram = await db
			.select()
			.from(workoutPrograms)
			.where(
				and(
					eq(workoutPrograms.userId, userId),
					eq(workoutPrograms.name, routine.name),
				),
			)
			.limit(1);

		if (existingProgram.length > 0) {
			console.log("⚠️ Workout routine already exists, skipping save");
			return existingProgram[0];
		}

		// First, create the workout program
		const [program] = await db
			.insert(workoutPrograms)
			.values({
				userId,
				name: routine.name,
				description: routine.description || "",
				goalType: routine.goals.join(","), // Store goals as comma-separated string
				experienceLevel: routine.difficulty,
				frequency: routine.frequency,
				durationWeeks: routine.duration,
				isActive: true,
			})
			.returning();

		console.log("✅ Created workout program:", program.id);

		// Then, create workout days and exercises
		for (const [dayIndex, day] of routine.days.entries()) {
			// Create workout day
			const [workoutDay] = await db
				.insert(workoutDays)
				.values({
					programId: program.id,
					dayNumber: dayIndex + 1,
					name: day.name,
					type: inferDayType(day.name), // Helper function to determine day type
					description: `Day ${dayIndex + 1} - ${day.name}`,
				})
				.returning();

			console.log("✅ Created workout day:", workoutDay.id, day.name);

			// Create exercises for this day
			for (const [exerciseIndex, exercise] of day.exercises.entries()) {
				// First, ensure the exercise exists in the exercises table
				const existingExercise = await db
					.select()
					.from(exercises)
					.where(eq(exercises.name, exercise.name))
					.limit(1);

				let exerciseId: string;

				if (existingExercise.length === 0) {
					// Create new exercise
					const [newExercise] = await db
						.insert(exercises)
						.values({
							name: exercise.name,
							description: exercise.notes || "",
							muscleGroup: exercise.muscleGroups[0], // Use primary muscle group
							equipmentType: exercise.equipment,
							difficulty: routine.difficulty, // Use routine difficulty as default
						})
						.returning();
					exerciseId = newExercise.id;
					console.log(
						"✅ Created new exercise:",
						newExercise.id,
						exercise.name,
					);
				} else {
					exerciseId = existingExercise[0].id;
					console.log("📝 Using existing exercise:", exerciseId, exercise.name);
				}

				// Create program exercise (the exercise assignment to this workout day)
				await db.insert(programExercises).values({
					workoutDayId: workoutDay.id,
					exerciseId: exerciseId,
					sets: exercise.sets,
					reps: exercise.reps,
					restSeconds: exercise.restPeriod,
					notes: exercise.notes || "",
					order: exerciseIndex,
				});

				console.log("✅ Created program exercise assignment");
			}
		}

		console.log("🎉 Successfully saved complete workout routine to database!");
		return program;
	} catch (error) {
		console.error("❌ Error saving workout routine to database:", error);
		throw error;
	}
}

function inferDayType(dayName: string): string {
	const name = dayName.toLowerCase();
	if (name.includes("push")) return "push";
	if (name.includes("pull")) return "pull";
	if (name.includes("leg")) return "legs";
	if (name.includes("upper")) return "upper";
	if (name.includes("lower")) return "lower";
	if (name.includes("full")) return "full";
	return "other"; // Default fallback
}
