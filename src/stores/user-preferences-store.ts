import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type UserPreferencesState = {
	units: "lbs" | "kg";
	restTimerDefault: number;
	trainingGoal: string | null;
	experienceLevel: string | null;
	availableDays: number | null;
	isLoading: boolean;
	hasLoadedFromServer: boolean;
};

export type UserPreferencesActions = {
	setUnits: (units: "lbs" | "kg") => void;
	setRestTimerDefault: (seconds: number) => void;
	setTrainingGoal: (goal: string | null) => void;
	setExperienceLevel: (level: string | null) => void;
	setAvailableDays: (days: number | null) => void;
	setLoading: (loading: boolean) => void;
	setHasLoadedFromServer: (loaded: boolean) => void;
	setPreferences: (preferences: Partial<UserPreferencesState>) => void;
	resetPreferences: () => void;
};

export type UserPreferencesStore = UserPreferencesState &
	UserPreferencesActions;

export const defaultInitState: UserPreferencesState = {
	units: "lbs",
	restTimerDefault: 90,
	trainingGoal: null,
	experienceLevel: null,
	availableDays: null,
	isLoading: false,
	hasLoadedFromServer: false,
};

export const createUserPreferencesStore = (
	initState: UserPreferencesState = defaultInitState,
) => {
	return createStore<UserPreferencesStore>()(
		subscribeWithSelector((set, _get) => ({
			...initState,
			setUnits: (units) => set({ units }),
			setRestTimerDefault: (restTimerDefault) => set({ restTimerDefault }),
			setTrainingGoal: (trainingGoal) => set({ trainingGoal }),
			setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
			setAvailableDays: (availableDays) => set({ availableDays }),
			setLoading: (isLoading) => set({ isLoading }),
			setHasLoadedFromServer: (hasLoadedFromServer) =>
				set({ hasLoadedFromServer }),
			setPreferences: (preferences) =>
				set((state) => ({ ...state, ...preferences })),
			resetPreferences: () => set(defaultInitState),
		})),
	);
};

export const convertWeight = (
	weight: number,
	fromUnit: "lbs" | "kg",
	toUnit: "lbs" | "kg",
): number => {
	if (fromUnit === "lbs" && toUnit === "kg") {
		return Math.round((weight / 2.205) * 10) / 10;
	}

	if (fromUnit === "kg" && toUnit === "lbs") {
		return Math.round(weight * 2.205 * 10) / 10;
	}

	return weight;
};

export const formatWeight = (weight: number, unit: "lbs" | "kg"): string => {
	return `${weight} ${unit}`;
};
