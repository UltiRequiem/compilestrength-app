"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from "react";
import { useStore } from "zustand";
import { useSession } from "@/lib/auth-client";
import {
	createUserPreferencesStore,
	defaultInitState,
	type UserPreferencesStore,
} from "@/stores/user-preferences-store";

export type UserPreferencesStoreApi = ReturnType<
	typeof createUserPreferencesStore
>;

export const UserPreferencesStoreContext = createContext<
	UserPreferencesStoreApi | undefined
>(undefined);

export interface UserPreferencesStoreProviderProps {
	children: ReactNode;
}

export const UserPreferencesStoreProvider = ({
	children,
}: UserPreferencesStoreProviderProps) => {
	const storeRef = useRef<UserPreferencesStoreApi | null>(null);
	const { data: session } = useSession();
	const sessionUserId = session?.user?.id;

	if (storeRef.current === null) {
		storeRef.current = createUserPreferencesStore(defaultInitState);
	}

	// Reset preferences when user changes
	useEffect(() => {
		if (storeRef.current && sessionUserId) {
			const currentState = storeRef.current.getState();
			if (currentState.hasLoadedFromServer) {
				// Reset when switching users
				storeRef.current.getState().resetPreferences();
			}
		}
	}, [sessionUserId]);

	// Load user preferences from server when session is available
	useEffect(() => {
		const loadPreferences = async () => {
			if (
				session?.user &&
				storeRef.current &&
				!storeRef.current.getState().hasLoadedFromServer
			) {
				storeRef.current.getState().setLoading(true);

				try {
					const { getUserPreferences } = await import(
						"@/app/app/settings/actions"
					);

					const preferences = await getUserPreferences();

					if (preferences) {
						storeRef.current.getState().setPreferences({
							units: preferences.units as "lbs" | "kg",
							restTimerDefault: preferences.restTimerDefault,
							trainingGoal: preferences.trainingGoal,
							experienceLevel: preferences.experienceLevel,
							availableDays: preferences.availableDays,
						});
					}

					storeRef.current.getState().setHasLoadedFromServer(true);
				} catch (error) {
					console.error("Failed to load user preferences:", error);
				} finally {
					storeRef.current.getState().setLoading(false);
				}
			}
		};

		loadPreferences();
	}, [session]);

	return (
		<UserPreferencesStoreContext.Provider value={storeRef.current}>
			{children}
		</UserPreferencesStoreContext.Provider>
	);
};

export const useUserPreferencesStore = <T,>(
	selector: (store: UserPreferencesStore) => T,
): T => {
	const userPreferencesStoreContext = useContext(UserPreferencesStoreContext);

	if (!userPreferencesStoreContext) {
		throw new Error(
			`useUserPreferencesStore must be used within UserPreferencesStoreProvider`,
		);
	}

	return useStore(userPreferencesStoreContext, selector);
};

const unitsSelector = (state: UserPreferencesStore) => state.units;
const restTimerSelector = (state: UserPreferencesStore) =>
	state.restTimerDefault;
const trainingGoalSelector = (state: UserPreferencesStore) =>
	state.trainingGoal;
const experienceLevelSelector = (state: UserPreferencesStore) =>
	state.experienceLevel;

export const useUnits = () => useUserPreferencesStore(unitsSelector);
export const useRestTimerDefault = () =>
	useUserPreferencesStore(restTimerSelector);
export const useTrainingGoal = () =>
	useUserPreferencesStore(trainingGoalSelector);
export const useExperienceLevel = () =>
	useUserPreferencesStore(experienceLevelSelector);

const setUnitsSelector = (state: UserPreferencesStore) => state.setUnits;
const setRestTimerDefaultSelector = (state: UserPreferencesStore) =>
	state.setRestTimerDefault;
const setTrainingGoalSelector = (state: UserPreferencesStore) =>
	state.setTrainingGoal;
const setExperienceLevelSelector = (state: UserPreferencesStore) =>
	state.setExperienceLevel;
const setAvailableDaysSelector = (state: UserPreferencesStore) =>
	state.setAvailableDays;
const setPreferencesSelector = (state: UserPreferencesStore) =>
	state.setPreferences;
const resetPreferencesSelector = (state: UserPreferencesStore) =>
	state.resetPreferences;

export const useSetUnits = () => useUserPreferencesStore(setUnitsSelector);
export const useSetRestTimerDefault = () =>
	useUserPreferencesStore(setRestTimerDefaultSelector);
export const useSetTrainingGoal = () =>
	useUserPreferencesStore(setTrainingGoalSelector);
export const useSetExperienceLevel = () =>
	useUserPreferencesStore(setExperienceLevelSelector);
export const useSetAvailableDays = () =>
	useUserPreferencesStore(setAvailableDaysSelector);
export const useSetPreferences = () =>
	useUserPreferencesStore(setPreferencesSelector);
export const useResetPreferences = () =>
	useUserPreferencesStore(resetPreferencesSelector);
