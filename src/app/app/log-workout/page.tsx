"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { WorkoutInProgress } from "@/components/log-workout/workout-in-progress";
import { WorkoutListing } from "@/components/log-workout/workout-listing";
import { useActiveSession } from "@/hooks/use-active-session";
import { useWorkoutPrograms } from "@/hooks/use-workout-programs";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { useRequireAuth } from "@/lib/auth-client";

export default function LogWorkoutPage() {
	const { session, isPending } = useRequireAuth();
	const hasCheckedSession = useRef(false);
	const hasSetTimer = useRef(false);

	const {
		programs,
		loading,
		loadPrograms,
		selectProgram,
		selectDay,
		selectedProgram,
		selectedDay: selectedDayId,
		getCurrentProgram,
		getCurrentDay,
	} = useWorkoutPrograms();

	const {
		workoutSession,
		exercises,
		checkActiveSession,
		getSessionStartTime,
		startWorkout,
		initializeExercises,
		isStarting,
		completeSet,
		updateSetValue,
		finishWorkout,
		abortWorkout,
		getCompletedSetsCount,
		getTotalSetsCount,
	} = useActiveSession();

	const workoutTimer = useWorkoutTimer();
	const { setInitialElapsedTime } = workoutTimer;

	useEffect(() => {
		if (!session) return;
		hasCheckedSession.current = false; // Reset when session changes
		hasSetTimer.current = false; // Reset timer flag too
		loadPrograms();
	}, [session, loadPrograms]);

	useEffect(() => {
		if (!session || programs.length === 0 || hasCheckedSession.current) return;

		const restoreSession = async () => {
			hasCheckedSession.current = true;
			console.log("Restoring session with programs:", programs.length);
			const result = await checkActiveSession(programs);
			console.log("checkActiveSession result:", result);
			if (result) {
				console.log("Setting program and day:", result.programId, result.dayId);
				selectProgram(result.programId);
				selectDay(result.dayId);
				// Don't set timer here - do it after workoutSession is set
			} else {
				console.log("No active session found");
			}
		};

		restoreSession();
	}, [session, programs.length]);

	// Separate useEffect to initialize timer after workoutSession is set (only once)
	useEffect(() => {
		if (workoutSession && workoutSession.startTime && !hasSetTimer.current) {
			hasSetTimer.current = true;
			const initialElapsed = getSessionStartTime();
			console.log(
				"Setting initial elapsed time after session set:",
				initialElapsed,
			);
			setInitialElapsedTime(initialElapsed);
		}
	}, [workoutSession, getSessionStartTime, setInitialElapsedTime]);

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
		return (
			<WorkoutListing
				programs={programs}
				selectedProgram={selectedProgram}
				selectedDay={selectedDayId}
				selectProgram={selectProgram}
				selectDay={selectDay}
				currentProgram={getCurrentProgram()}
				currentDay={getCurrentDay()}
				startWorkout={startWorkout}
				initializeExercises={initializeExercises}
				isStarting={isStarting}
			/>
		);
	}

	return (
		<WorkoutInProgress
			exercises={exercises}
			completeSet={completeSet}
			updateSetValue={updateSetValue}
			finishWorkout={finishWorkout}
			abortWorkout={abortWorkout}
			getCompletedSetsCount={getCompletedSetsCount}
			getTotalSetsCount={getTotalSetsCount}
			currentDay={getCurrentDay()}
			workoutTimer={workoutTimer}
		/>
	);
}
