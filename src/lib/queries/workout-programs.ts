import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exercises,
	programExercises,
	workoutDays,
	workoutPrograms,
} from "@/db/schema";

export async function getActiveWorkoutProgramsByUserId(userId: string) {
	// Fetch user's workout programs with their days and exercises
	const programs = await db
		.select()
		.from(workoutPrograms)
		.where(
			and(
				eq(workoutPrograms.userId, userId),
				eq(workoutPrograms.isActive, true),
			),
		)
		.orderBy(desc(workoutPrograms.createdAt));

	// For each program, fetch its days and exercises
	const programsWithDetails = await Promise.all(
		programs.map(async (program) => {
			const days = await db
				.select()
				.from(workoutDays)
				.where(eq(workoutDays.programId, program.id));

			const daysWithExercises = await Promise.all(
				days.map(async (day) => {
					const programExs = await db
						.select({
							id: programExercises.id,
							sets: programExercises.sets,
							reps: programExercises.reps,
							restSeconds: programExercises.restSeconds,
							notes: programExercises.notes,
							order: programExercises.order,
							exerciseId: exercises.id,
							exerciseName: exercises.name,
							exerciseDescription: exercises.description,
							muscleGroup: exercises.muscleGroup,
							equipmentType: exercises.equipmentType,
							difficulty: exercises.difficulty,
						})
						.from(programExercises)
						.innerJoin(exercises, eq(programExercises.exerciseId, exercises.id))
						.where(eq(programExercises.workoutDayId, day.id))
						.orderBy(programExercises.order);

					return {
						...day,
						exercises: programExs,
					};
				}),
			);

			return {
				...program,
				days: daysWithExercises,
			};
		}),
	);

	return programsWithDetails;
}
