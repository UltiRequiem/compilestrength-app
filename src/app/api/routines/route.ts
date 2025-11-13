import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import {
	exercises,
	programExercises,
	workoutDays,
	workoutPrograms,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		const programs = await db
			.select()
			.from(workoutPrograms)
			.where(eq(workoutPrograms.userId, session.user.id))
			.orderBy(workoutPrograms.createdAt);

		const routinesWithDetails = await Promise.all(
			programs.map(async (program) => {
				const days = await db
					.select()
					.from(workoutDays)
					.where(eq(workoutDays.programId, program.id))
					.orderBy(workoutDays.dayNumber);

				const daysWithExercises = await Promise.all(
					days.map(async (day) => {
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
							.innerJoin(
								exercises,
								eq(programExercises.exerciseId, exercises.id),
							)
							.where(eq(programExercises.workoutDayId, day.id))
							.orderBy(programExercises.order);

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

				return {
					id: program.id,
					name: program.name,
					description: program.description || "",
					difficulty: program.experienceLevel,
					frequency: program.frequency,
					duration: program.durationWeeks,
					goals: program.goalType.split(","),
					days: daysWithExercises,
					createdAt: program.createdAt,
					updatedAt: program.updatedAt,
					isActive: program.isActive,
				};
			}),
		);

		return Response.json({
			success: true,
			routines: routinesWithDetails,
		});
	} catch (error) {
		console.error("Get routines API error:", error);
		return new Response("Failed to fetch workout routines", { status: 500 });
	}
}
