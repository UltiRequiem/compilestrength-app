"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { WorkoutInProgress } from "@/components/log-workout/workout-in-progress";
import { WorkoutListing } from "@/components/log-workout/workout-listing";
import { useActiveSession } from "@/hooks/use-active-session";
import { useWorkoutPrograms } from "@/hooks/use-workout-programs";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { useRequireAuth } from "@/lib/auth-client";

export default function LogWorkoutPage() {
	const { session, isPending } = useRequireAuth();

	const { programs, loading, loadPrograms, selectProgram, selectDay } =
		useWorkoutPrograms();

	const { workoutSession, checkActiveSession, getSessionStartTime } =
		useActiveSession();

	const { setInitialElapsedTime } = useWorkoutTimer();

	useEffect(() => {
		if (!session) return;
		loadPrograms();
	}, [session, loadPrograms]);

	useEffect(() => {
		if (!session || programs.length === 0) return;

		const restoreSession = async () => {
			const result = await checkActiveSession(programs);
			if (result) {
				selectProgram(result.programId);
				selectDay(result.dayId);
				const initialElapsed = getSessionStartTime();
				setInitialElapsedTime(initialElapsed);
			}
		};

		restoreSession();
	}, [
		session,
		programs,
		checkActiveSession,
		selectProgram,
		selectDay,
		getSessionStartTime,
		setInitialElapsedTime,
	]);

	if (isPending || loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!session) {
		return null;
	}

	if (!workoutSession) {
		return <WorkoutListing />;
	}

	return <WorkoutInProgress />;
}
