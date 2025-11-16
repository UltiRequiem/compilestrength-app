import { useCallback, useState } from "react";
import type {
	ExerciseWithSets,
	WorkoutDay,
	WorkoutProgram,
} from "@/types/workout.types";

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

interface NewSessionResponse {
	id: string;
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
			const response = await fetch("/api/workout-sessions", {
				cache: "no-store",
				headers: {
					"Cache-Control": "no-cache",
				},
			});
			if (response.ok) {
				const activeSession = await response.json();
				console.log("checkActiveSession - API response:", activeSession);
				if (activeSession) {
					const session = activeSession as ActiveSession;
					setWorkoutSession(session);
					console.log(
						"checkActiveSession - Session set, workoutDayId:",
						session.workoutDayId,
					);

					// Find the program and day for this session
					const sessionProgram = programs.find((p) =>
						p.days.some((d) => d.id === session.workoutDayId),
					);
					console.log(
						"checkActiveSession - Found program:",
						sessionProgram?.name,
						"programs available:",
						programs.length,
					);

					if (sessionProgram) {
						const currentDay = sessionProgram.days.find(
							(d) => d.id === session.workoutDayId,
						);
						console.log(
							"checkActiveSession - Found current day:",
							currentDay?.name,
							"exercises:",
							currentDay?.exercises?.length,
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

							console.log(
								"checkActiveSession - Built exercises:",
								exercisesWithSets.length,
								"setting exercises",
							);
							setExercises(exercisesWithSets);
							console.log("checkActiveSession - Exercises set successfully");

							// Verify exercises were set
							setTimeout(() => {
								console.log(
									"checkActiveSession - Verify exercises after timeout, current exercises array length should be:",
									exercisesWithSets.length,
								);
							}, 100);
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
				const sessionData = (await response.json()) as NewSessionResponse;
				// Create a minimal ActiveSession with the data we have
				const partialSession: ActiveSession = {
					id: sessionData.id,
					workoutDayId: selectedDay,
					startTime: new Date().toISOString(),
					sets: [],
				};
				setWorkoutSession(partialSession);
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

	const initializeExercises = (
		currentDay: WorkoutDay | undefined,
		sessionId: string,
	) => {
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

		if (exerciseIdx < 0 || exerciseIdx >= exercises.length) {
			throw new Error("Invalid exercise index");
		}

		const exercise = exercises[exerciseIdx];

		if (setIdx < 0 || setIdx >= exercise.completedSets.length) {
			throw new Error("Invalid set index");
		}

		const set = exercise.completedSets[setIdx];

		// Better validation - ensure we have valid numbers
		if (set.reps === null || set.reps === undefined || set.reps < 0) {
			throw new Error("Please enter valid reps (must be 0 or more)");
		}
		if (set.weight === null || set.weight === undefined || set.weight < 0) {
			throw new Error("Please enter valid weight (must be 0 or more)");
		}

		console.log("completeSet - sending data:", {
			sessionId: workoutSession.id,
			exerciseId: exercise.exerciseId,
			setNumber: set.number,
			reps: set.reps,
			weight: set.weight,
			rpe: set.rpe,
		});

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
		if (exerciseIdx < 0 || exerciseIdx >= exercises.length) {
			console.warn("Invalid exercise index:", exerciseIdx);
			return;
		}

		const exercise = exercises[exerciseIdx];
		if (
			!exercise.completedSets ||
			setIdx < 0 ||
			setIdx >= exercise.completedSets.length
		) {
			console.warn("Invalid set index:", setIdx);
			return;
		}

		const newExercises = [...exercises];
		if (field === "weight" || field === "reps" || field === "rpe") {
			(newExercises[exerciseIdx].completedSets[setIdx][field] as number) =
				value;
		}
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
			setWorkoutSession(null);
			setExercises([]);
			return await response.json();
		}

		throw new Error("Failed to finish workout");
	};

	const abortWorkout = async () => {
		if (!workoutSession) return;

		const response = await fetch("/api/workout-sessions", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId: workoutSession.id,
			}),
		});

		if (response.ok) {
			// Clear local state immediately
			setWorkoutSession(null);
			setExercises([]);
			return await response.json();
		}

		throw new Error("Failed to abort workout");
	};

	const getSessionStartTime = useCallback(() => {
		console.log(
			"getSessionStartTime called - workoutSession:",
			!!workoutSession,
			"startTime:",
			workoutSession?.startTime,
		);
		if (!workoutSession || !workoutSession.startTime) return 0;
		try {
			const startTime = new Date(workoutSession.startTime).getTime();
			if (Number.isNaN(startTime)) return 0;
			const now = Date.now();
			const elapsed = Math.floor((now - startTime) / 1000);
			console.log(
				"getSessionStartTime - calculated elapsed:",
				elapsed,
				"seconds",
			);
			return elapsed;
		} catch {
			return 0;
		}
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
		abortWorkout,
		getSessionStartTime,
		getCompletedSetsCount,
		getTotalSetsCount,
	};
}
