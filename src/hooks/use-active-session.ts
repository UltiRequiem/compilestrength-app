import { useCallback, useState } from "react";
import type {
	ExerciseWithSets,
	WorkoutProgram,
} from "@/app/app/log-workout/types";

interface ActiveSession {
	id: string;
	workoutDayId: string;
	startTime: string;
	sets?: Array<{
		id: string;
		exerciseId: string;
		setNumber: number;
		weight: number;
		reps: number;
		rpe: number;
	}>;
}

export function useActiveSession() {
	const [workoutSession, setWorkoutSession] = useState<ActiveSession | null>(
		null,
	);
	const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
	const [isStarting, setIsStarting] = useState(false);

	const checkActiveSession = useCallback(async (programs: WorkoutProgram[]) => {
		if (programs.length === 0) return;

		try {
			const response = await fetch("/api/workout-sessions");
			if (response.ok) {
				const activeSession = await response.json();
				if (activeSession) {
					const session = activeSession as ActiveSession;
					setWorkoutSession(session);

					// Find the program and day for this session
					const sessionProgram = programs.find((p) =>
						p.days.some((d) => d.id === session.workoutDayId),
					);

					if (sessionProgram) {
						const currentDay = sessionProgram.days.find(
							(d) => d.id === session.workoutDayId,
						);
						if (currentDay) {
							// Rebuild exercises with completed sets from the session
							const exercisesWithSets: ExerciseWithSets[] =
								currentDay.exercises.map((ex) => {
									// Get completed sets for this exercise from the session
									const completedSetsFromDB =
										session.sets?.filter(
											(s) => s.exerciseId === ex.exerciseId,
										) || [];

									// Create the full set structure
									const completedSets = Array.from(
										{ length: ex.sets },
										(_, i) => {
											const existingSet = completedSetsFromDB.find(
												(s) => s.setNumber === i + 1,
											);

											if (existingSet) {
												// Use existing completed set
												return {
													id: existingSet.id,
													number: i + 1,
													setNumber: i + 1,
													weight: existingSet.weight,
													reps: existingSet.reps,
													rpe: existingSet.rpe,
													completed: true,
													sessionId: session.id,
													exerciseId: ex.id,
												};
											}
											// Create pending set
											return {
												id: `temp_pending_${ex.id}_${i}`,
												number: i + 1,
												setNumber: i + 1,
												weight: 0,
												reps: null,
												rpe: null,
												completed: false,
												sessionId: session.id,
												exerciseId: ex.id,
											};
										},
									);

									return {
										...ex,
										completedSets,
									};
								});

							setExercises(exercisesWithSets);
							return {
								programId: sessionProgram.id,
								dayId: session.workoutDayId,
							};
						}
					}
				}
			}
		} catch (error) {
			console.error("Error checking active session:", error);
		}
		return null;
	}, []);

	const startWorkout = async (selectedDay: string) => {
		if (!selectedDay) return null;

		setIsStarting(true);
		try {
			const response = await fetch("/api/workout-sessions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ workoutDayId: selectedDay }),
			});

			if (response.ok) {
				const sessionData = (await response.json()) as { id: string };
				setWorkoutSession(sessionData as ActiveSession);
				return sessionData;
			}

			const error = (await response.json()) as { error?: string };
			throw new Error(error.error || "Failed to start workout");
		} catch (error) {
			console.error("Error starting workout:", error);
			throw error;
		} finally {
			setIsStarting(false);
		}
	};

	interface WorkoutDay {
		exercises: Array<{
			id: string;
			name: string;
			sets: number;
			// Add other properties as needed
		}>;
	}

	const initializeExercises = (currentDay: WorkoutDay | undefined, sessionId: string) => {
		if (!currentDay) return;

		const exercisesWithSets: ExerciseWithSets[] = currentDay.exercises.map(
			(ex) => ({
				...ex,
				completedSets: Array.from({ length: ex.sets }, (_, i) => ({
					id: `temp_pending_${ex.id}_${i}`,
					number: i + 1,
					setNumber: i + 1,
					weight: 0,
					reps: null,
					rpe: null,
					completed: false,
					sessionId: sessionId,
					exerciseId: ex.id,
				})),
			}),
		);

		setExercises(exercisesWithSets);
	};

	const completeSet = async (exerciseIdx: number, setIdx: number) => {
		if (!workoutSession) return;

		const exercise = exercises[exerciseIdx];
		const set = exercise.completedSets[setIdx];

		if (!set.reps || !set.weight) {
			throw new Error("Please enter weight and reps");
		}

		const response = await fetch("/api/workout-sets", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId: workoutSession.id,
				exerciseId: exercise.exerciseId,
				setNumber: set.number,
				reps: set.reps,
				weight: set.weight,
				rpe: set.rpe,
			}),
		});

		if (response.ok) {
			const newSet = (await response.json()) as { id: string };
			const newExercises = [...exercises];
			newExercises[exerciseIdx].completedSets[setIdx] = {
				...set,
				id: newSet.id,
				completed: true,
			};
			setExercises(newExercises);
			return newSet;
		}

		throw new Error("Failed to save set");
	};

	const updateSetValue = (
		exerciseIdx: number,
		setIdx: number,
		field: "weight" | "reps" | "rpe",
		value: number,
	) => {
		const newExercises = [...exercises];
		newExercises[exerciseIdx].completedSets[setIdx][field] = value as any;
		setExercises(newExercises);
	};

	const finishWorkout = async () => {
		if (!workoutSession) return;

		const response = await fetch("/api/workout-sessions", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId: workoutSession.id,
				endTime: new Date().toISOString(),
				completed: true,
			}),
		});

		if (response.ok) {
			return await response.json();
		}

		throw new Error("Failed to finish workout");
	};

	const getSessionStartTime = useCallback(() => {
		if (!workoutSession) return 0;
		const startTime = new Date(workoutSession.startTime).getTime();
		const now = Date.now();
		return Math.floor((now - startTime) / 1000);
	}, [workoutSession]);

	const getCompletedSetsCount = useCallback(() => {
		return exercises.reduce(
			(acc, ex) => acc + ex.completedSets.filter((s) => s.completed).length,
			0,
		);
	}, [exercises]);

	const getTotalSetsCount = useCallback(() => {
		return exercises.reduce((acc, ex) => acc + ex.completedSets.length, 0);
	}, [exercises]);

	return {
		workoutSession,
		exercises,
		isStarting,
		checkActiveSession,
		startWorkout,
		initializeExercises,
		completeSet,
		updateSetValue,
		finishWorkout,
		getSessionStartTime,
		getCompletedSetsCount,
		getTotalSetsCount,
	};
}
