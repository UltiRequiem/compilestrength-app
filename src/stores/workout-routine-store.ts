import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Exercise {
	id: string;
	name: string;
	muscleGroups: string[];
	equipment: string;
	sets: number;
	reps: string; // e.g., "8-12", "10", "AMRAP"
	restPeriod: number; // seconds
	weight?: number;
	notes?: string;
	order: number;
}

export interface WorkoutDay {
	id: string;
	name: string; // e.g., "Push Day", "Pull Day", "Legs"
	exercises: Exercise[];
	order: number;
}

export interface WorkoutRoutine {
	id: string;
	name: string;
	description?: string;
	days: WorkoutDay[];
	frequency: number; // days per week
	duration: number; // weeks
	difficulty: "beginner" | "intermediate" | "advanced";
	goals: string[]; // e.g., ["muscle_gain", "strength", "endurance"]
	createdAt: Date;
	updatedAt: Date;
}

export interface UserProfile {
	experience: "beginner" | "intermediate" | "advanced";
	goals: string[];
	availableEquipment: string[];
	timeConstraints: {
		daysPerWeek: number;
		minutesPerSession: number;
	};
	physicalLimitations?: string[];
	preferences?: {
		favoriteExercises?: string[];
		exercisesToAvoid?: string[];
	};
}

interface WorkoutRoutineState {
	routine: WorkoutRoutine | null;
	userProfile: UserProfile | null;
	isGenerating: boolean;
	generationProgress: {
		step: string;
		description: string;
		completed: boolean;
	}[];
}

interface WorkoutRoutineActions {
	// Routine management
	setRoutine: (routine: WorkoutRoutine | null) => void;
	updateRoutine: (update: Partial<WorkoutRoutine>) => void;

	// Exercise management
	addExercise: (
		dayId: string,
		exercise: Omit<Exercise, "id" | "order">,
	) => void;
	updateExercise: (
		dayId: string,
		exerciseId: string,
		update: Partial<Exercise>,
	) => void;
	removeExercise: (dayId: string, exerciseId: string) => void;
	reorderExercises: (dayId: string, exerciseIds: string[]) => void;

	// Day management
	addDay: (day: Omit<WorkoutDay, "id" | "order">) => void;
	updateDay: (dayId: string, update: Partial<WorkoutDay>) => void;
	removeDay: (dayId: string) => void;
	reorderDays: (dayIds: string[]) => void;

	// User profile
	setUserProfile: (profile: UserProfile | null) => void;
	updateUserProfile: (update: Partial<UserProfile>) => void;

	// Generation state
	setIsGenerating: (generating: boolean) => void;
	setGenerationProgress: (
		progress: { step: string; description: string; completed: boolean }[],
	) => void;
	updateGenerationStep: (step: string, completed: boolean) => void;

	// Utility actions
	reset: () => void;
}

type WorkoutRoutineStore = WorkoutRoutineState & WorkoutRoutineActions;

const initialState: WorkoutRoutineState = {
	routine: null,
	userProfile: null,
	isGenerating: false,
	generationProgress: [],
};

export const useWorkoutRoutineStore = create<WorkoutRoutineStore>()(
	subscribeWithSelector((set) => ({
		...initialState,

		// Routine management
		setRoutine: (routine) => {
			console.log("🏪 STORE: setRoutine called with:", routine);
			set({ routine });
			console.log("🏪 STORE: setRoutine completed");
		},

		updateRoutine: (update) =>
			set((state) => ({
				routine: state.routine
					? {
							...state.routine,
							...update,
							updatedAt: new Date(),
						}
					: null,
			})),

		// Exercise management
		addExercise: (dayId, exerciseData) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.map((day) => {
							if (day.id === dayId) {
								const newExercise: Exercise = {
									...exerciseData,
									id: crypto.randomUUID(),
									order: day.exercises.length,
								};
								return {
									...day,
									exercises: [...day.exercises, newExercise],
								};
							}
							return day;
						}),
						updatedAt: new Date(),
					},
				};
			}),

		updateExercise: (dayId, exerciseId, update) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.map((day) => {
							if (day.id === dayId) {
								return {
									...day,
									exercises: day.exercises.map((exercise) =>
										exercise.id === exerciseId
											? { ...exercise, ...update }
											: exercise,
									),
								};
							}
							return day;
						}),
						updatedAt: new Date(),
					},
				};
			}),

		removeExercise: (dayId, exerciseId) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.map((day) => {
							if (day.id === dayId) {
								return {
									...day,
									exercises: day.exercises.filter(
										(exercise) => exercise.id !== exerciseId,
									),
								};
							}
							return day;
						}),
						updatedAt: new Date(),
					},
				};
			}),

		reorderExercises: (dayId, exerciseIds) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.map((day) => {
							if (day.id === dayId) {
								const exerciseMap = new Map(
									day.exercises.map((ex) => [ex.id, ex]),
								);
								const reorderedExercises = exerciseIds.map((id, index) => {
									const exercise = exerciseMap.get(id);
									if (exercise) {
										return { ...exercise, order: index };
									}
									throw new Error(`Exercise with id ${id} not found`);
								});
								return { ...day, exercises: reorderedExercises };
							}
							return day;
						}),
						updatedAt: new Date(),
					},
				};
			}),

		// Day management
		addDay: (dayData) =>
			set((state) => {
				if (!state.routine) return state;

				const newDay: WorkoutDay = {
					...dayData,
					id: crypto.randomUUID(),
					order: state.routine.days.length,
				};

				return {
					routine: {
						...state.routine,
						days: [...state.routine.days, newDay],
						updatedAt: new Date(),
					},
				};
			}),

		updateDay: (dayId, update) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.map((day) =>
							day.id === dayId ? { ...day, ...update } : day,
						),
						updatedAt: new Date(),
					},
				};
			}),

		removeDay: (dayId) =>
			set((state) => {
				if (!state.routine) return state;

				return {
					routine: {
						...state.routine,
						days: state.routine.days.filter((day) => day.id !== dayId),
						updatedAt: new Date(),
					},
				};
			}),

		reorderDays: (dayIds) =>
			set((state) => {
				if (!state.routine) return state;

				const dayMap = new Map(state.routine.days.map((day) => [day.id, day]));
				const reorderedDays = dayIds.map((id, index) => {
					const day = dayMap.get(id);
					if (day) {
						return { ...day, order: index };
					}
					throw new Error(`Day with id ${id} not found`);
				});

				return {
					routine: {
						...state.routine,
						days: reorderedDays,
						updatedAt: new Date(),
					},
				};
			}),

		// User profile
		setUserProfile: (profile) => {
			console.log("🏪 STORE: setUserProfile called with:", profile);
			set({ userProfile: profile });
			console.log("🏪 STORE: setUserProfile completed");
		},

		updateUserProfile: (update) =>
			set((state) => ({
				userProfile: state.userProfile
					? {
							...state.userProfile,
							...update,
						}
					: null,
			})),

		// Generation state
		setIsGenerating: (generating) => set({ isGenerating: generating }),

		setGenerationProgress: (progress) => set({ generationProgress: progress }),

		updateGenerationStep: (step, completed) =>
			set((state) => ({
				generationProgress: state.generationProgress.map((p) =>
					p.step === step ? { ...p, completed } : p,
				),
			})),

		// Utility
		reset: () => set(initialState),
	})),
);

// Selectors for better performance
export const useRoutine = () =>
	useWorkoutRoutineStore((state) => state.routine);
export const useUserProfile = () =>
	useWorkoutRoutineStore((state) => state.userProfile);
export const useIsGenerating = () =>
	useWorkoutRoutineStore((state) => state.isGenerating);
export const useGenerationProgress = () =>
	useWorkoutRoutineStore((state) => state.generationProgress);

// Actions with stable references
export const useWorkoutRoutineActions = () => {
	const store = useWorkoutRoutineStore();

	return useMemo(
		() => ({
			setRoutine: store.setRoutine,
			updateRoutine: store.updateRoutine,
			addExercise: store.addExercise,
			updateExercise: store.updateExercise,
			removeExercise: store.removeExercise,
			reorderExercises: store.reorderExercises,
			addDay: store.addDay,
			updateDay: store.updateDay,
			removeDay: store.removeDay,
			reorderDays: store.reorderDays,
			setUserProfile: store.setUserProfile,
			updateUserProfile: store.updateUserProfile,
			setIsGenerating: store.setIsGenerating,
			setGenerationProgress: store.setGenerationProgress,
			updateGenerationStep: store.updateGenerationStep,
			reset: store.reset,
		}),
		[store],
	);
};
