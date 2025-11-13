import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exercises,
	programExercises,
	workoutDays,
	workoutPrograms,
} from "@/db/schema";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";
import { inferDayType } from "./utils";

export async function saveWorkoutRoutineToDb(
	routine: WorkoutRoutine,
	userId: string,
) {
	console.log("💾 Saving workout routine to database:", routine.name);

	try {
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
			console.log("! Workout routine already exists, skipping save");
			return existingProgram[0];
		}

		const [program] = await db
			.insert(workoutPrograms)
			.values({
				userId,
				name: routine.name,
				description: routine.description || "",
				goalType: routine.goals.join(","),
				experienceLevel: routine.difficulty,
				frequency: routine.frequency,
				durationWeeks: routine.duration,
				isActive: true,
			})
			.returning();

		for (const [dayIndex, day] of routine.days.entries()) {
			const [workoutDay] = await db
				.insert(workoutDays)
				.values({
					programId: program.id,
					dayNumber: dayIndex + 1,
					name: day.name,
					type: inferDayType(day.name),
					description: `Day ${dayIndex + 1} - ${day.name}`,
				})
				.returning();

			console.log("✅ Created workout day:", workoutDay.id, day.name);

			for (const [exerciseIndex, exercise] of day.exercises.entries()) {
				const existingExercise = await db
					.select()
					.from(exercises)
					.where(eq(exercises.name, exercise.name))
					.limit(1);

				let exerciseId: string;

				if (existingExercise.length === 0) {
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
