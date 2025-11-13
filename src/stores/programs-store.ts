import { create } from "zustand";

interface Exercise {
	id: string;
	name: string;
	muscleGroups: string[];
	equipment: string;
	sets: number;
	reps: string;
	restPeriod: number;
	notes?: string;
	order: number;
}

interface WorkoutDay {
	id: string;
	name: string;
	type: string;
	dayNumber: number;
	exercises: Exercise[];
}

interface WorkoutRoutine {
	id: string;
	name: string;
	description: string;
	difficulty: string;
	frequency: number;
	duration: number;
	goals: string[];
	days: WorkoutDay[];
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

interface ProgramsState {
	// State
	routines: WorkoutRoutine[];
	selectedRoutineId: string;
	isLoading: boolean;
	lastFetched: number | null;

	// Actions
	setRoutines: (routines: WorkoutRoutine[]) => void;
	setSelectedRoutineId: (id: string) => void;
	setLoading: (loading: boolean) => void;
	fetchRoutines: () => Promise<void>;
	addRoutine: (routine: WorkoutRoutine) => void;

	// Getters
	selectedRoutine: () => WorkoutRoutine | undefined;
	shouldRefetch: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const useProgramsStore = create<ProgramsState>()((set, get) => ({
	// Initial state
	routines: [],
	selectedRoutineId: "",
	isLoading: false,
	lastFetched: null,

	// Actions
	setRoutines: (routines) => {
		console.log("🏪 PROGRAMS STORE: Setting routines", routines.length);
		set({
			routines,
			lastFetched: Date.now(),
			// Auto-select first routine if none selected
			selectedRoutineId:
				get().selectedRoutineId || (routines.length > 0 ? routines[0].id : ""),
		});
	},

	setSelectedRoutineId: (id) => {
		console.log("🏪 PROGRAMS STORE: Setting selected routine", id);
		set({ selectedRoutineId: id });
	},

	setLoading: (isLoading) => {
		set({ isLoading });
	},

	fetchRoutines: async () => {
		const state = get();

		if (state.routines.length > 0 && !state.shouldRefetch()) {
			console.log("🏪 PROGRAMS STORE: Using cached data");
			return;
		}

		console.log("🏪 PROGRAMS STORE: Fetching fresh data from API");
		state.setLoading(true);

		try {
			const response = await fetch("/api/routines");

			if (response.ok) {
				const data = (await response.json()) as {
					success: boolean;
					routines: WorkoutRoutine[];
				};

				state.setRoutines(data.routines || []);
			} else {
				console.error("Failed to fetch routines:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching routines:", error);
		} finally {
			state.setLoading(false);
		}
	},

	addRoutine: (routine) => {
		console.log("🏪 PROGRAMS STORE: Adding new routine", routine.name);
		const currentRoutines = get().routines;
		set({
			routines: [routine, ...currentRoutines],
			selectedRoutineId: routine.id, // Select the new routine
			lastFetched: Date.now(),
		});
	},

	// Getters
	selectedRoutine: () => {
		const state = get();
		return state.routines.find((r) => r.id === state.selectedRoutineId);
	},

	shouldRefetch: () => {
		const state = get();
		if (!state.lastFetched) return true;
		return Date.now() - state.lastFetched > CACHE_DURATION;
	},
}));

// Action hooks for components
export const useProgramsActions = () => {
	const store = useProgramsStore();
	return {
		setSelectedRoutineId: store.setSelectedRoutineId,
		fetchRoutines: store.fetchRoutines,
		addRoutine: store.addRoutine,
	};
};

// Selector hooks to prevent unnecessary re-renders
export const useRoutines = () => useProgramsStore((state) => state.routines);
export const useSelectedRoutineId = () =>
	useProgramsStore((state) => state.selectedRoutineId);
export const useSelectedRoutine = () =>
	useProgramsStore((state) => state.selectedRoutine());
export const useIsLoadingPrograms = () =>
	useProgramsStore((state) => state.isLoading);
