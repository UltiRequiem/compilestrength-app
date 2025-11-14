"use client";

import {
	CheckCircle,
	Circle,
	Clock,
	Dumbbell,
	Edit,
	Loader2,
	Pause,
	Play,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useActiveSession } from "@/hooks/use-active-session";
import { useWorkoutPrograms } from "@/hooks/use-workout-programs";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { useRequireAuth } from "@/lib/auth-client";
import {
	useRestTimerDefault,
	useUnits,
} from "@/providers/user-preferences-store-provider";
import { formatTime } from "./utils";

export default function LogWorkoutPage() {
	const { session, isPending } = useRequireAuth();
	const router = useRouter();

	// Custom hooks
	const {
		programs,
		loading,
		selectedProgram,
		selectedDay,
		loadPrograms,
		selectProgram,
		selectDay,
		getCurrentProgram,
		getCurrentDay,
	} = useWorkoutPrograms();

	const {
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
	} = useActiveSession();

	const {
		elapsedTime,
		isRunning,
		restTimer,
		isResting,
		toggleTimer,
		startRest,
		setInitialElapsedTime,
	} = useWorkoutTimer();

	// Use global preferences
	const units = useUnits();
	const defaultRestTime = useRestTimerDefault();

	// Load programs and check for active session
	useEffect(() => {
		if (!session) return;

		loadPrograms();
	}, [session, loadPrograms]);

	// Check for active session after programs are loaded
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

	const handleStartWorkout = async () => {
		if (!selectedDay) return;

		try {
			const sessionData = await startWorkout(selectedDay);
			const currentDay = getCurrentDay();
			if (sessionData && currentDay) {
				initializeExercises(currentDay, sessionData.id);
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to start workout");
		}
	};

	const handleCompleteSet = async (exerciseIdx: number, setIdx: number) => {
		try {
			await completeSet(exerciseIdx, setIdx);
			const exercise = exercises[exerciseIdx];
			// Auto-start rest timer
			startRest(exercise.restSeconds || defaultRestTime);
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to save set");
		}
	};

	const handleFinishWorkout = async () => {
		try {
			await finishWorkout();
			router.push("/app");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to finish workout",
			);
		}
	};

	// Get computed values from hooks
	const completedSets = getCompletedSetsCount();
	const totalSets = getTotalSetsCount();

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

	// Show workout selection if no active session
	if (!workoutSession) {
		const currentProgram = getCurrentProgram();
		const currentDay = getCurrentDay();

		return (
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Start a Workout</h1>
					<p className="text-muted-foreground">
						Select a workout program and day to begin logging your session
					</p>
				</div>

				{programs.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
							<h3 className="text-xl font-semibold mb-2">
								No Workout Programs
							</h3>
							<p className="text-muted-foreground mb-6">
								You don't have any workout programs yet. Create a program to
								start logging workouts.
							</p>
							<Button onClick={() => router.push("/app/programs")}>
								Create Program
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Select Workout</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<label className="text-sm font-medium mb-2 block">
										Workout Program
									</label>
									<Select
										value={selectedProgram || undefined}
										onValueChange={selectProgram}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a program" />
										</SelectTrigger>
										<SelectContent>
											{programs.map((program) => (
												<SelectItem key={program.id} value={program.id}>
													{program.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{currentProgram && currentProgram.days.length > 0 && (
									<div>
										<label className="text-sm font-medium mb-2 block">
											Workout Day
										</label>
										<Select
											value={selectedDay || undefined}
											onValueChange={selectDay}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a day" />
											</SelectTrigger>
											<SelectContent>
												{currentProgram.days.map((day) => (
													<SelectItem key={day.id} value={day.id}>
														{day.name} ({day.type})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</CardContent>
						</Card>

						{currentDay && (
							<Card>
								<CardHeader>
									<CardTitle>Workout Preview</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold text-lg">
												{currentDay.name}
											</h3>
											{currentDay.description && (
												<p className="text-sm text-muted-foreground">
													{currentDay.description}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<p className="text-sm font-medium">
												Exercises ({currentDay.exercises.length}):
											</p>
											<ul className="space-y-1">
												{currentDay.exercises.map((ex, idx) => (
													<li
														key={ex.id}
														className="text-sm text-muted-foreground flex items-center gap-2"
													>
														<span className="text-primary">{idx + 1}.</span>
														{ex.exerciseName} - {ex.sets} sets × {ex.reps} reps
													</li>
												))}
											</ul>
										</div>

										<Button
											size="lg"
											className="w-full"
											onClick={handleStartWorkout}
											disabled={!selectedDay || isStarting}
										>
											{isStarting ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Starting...
												</>
											) : (
												<>
													<Play className="h-4 w-4 mr-2" />
													Start Workout
												</>
											)}
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</div>
		);
	}

	// Active workout session
	const currentDay = getCurrentDay();

	return (
		<div className="mx-auto max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">
							{currentDay?.name || "Workout"} - In Progress
						</h1>
						<div className="mt-2 flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-primary" />
								<span className="terminal-text text-lg text-primary">
									{formatTime(elapsedTime)}
								</span>
							</div>
							{isResting && restTimer !== null && (
								<Badge className="animate-pulse bg-primary text-lg px-3 py-1">
									Rest: {formatTime(restTimer)}
								</Badge>
							)}
						</div>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" size="icon" onClick={toggleTimer}>
							{isRunning ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</Button>
						<Button variant="outline" onClick={() => router.push("/app")}>
							<X className="h-4 w-4 mr-2" />
							Exit
						</Button>
					</div>
				</div>

				{/* Progress Bar */}
				{totalSets > 0 && (
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								{completedSets}/{totalSets} sets complete
							</span>
							<span className="text-muted-foreground">
								Est. {Math.ceil((totalSets - completedSets) * 3)} min remaining
							</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-secondary">
							<div
								className="h-full bg-primary transition-all duration-500"
								style={{ width: `${(completedSets / totalSets) * 100}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Exercises */}
			<div className="space-y-6">
				{exercises.map((exercise, exerciseIdx) => {
					const isCurrentExercise =
						exerciseIdx === 0 ||
						exercises[exerciseIdx - 1].completedSets.every((s) => s.completed);

					return (
						<Card
							key={exercise.id}
							className={`border-primary/20 ${
								isCurrentExercise &&
								!exercise.completedSets.every((s) => s.completed)
									? "border-primary glow-green"
									: ""
							}`}
						>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="flex items-center gap-3">
											{exercise.completedSets.every((s) => s.completed) ? (
												<CheckCircle className="h-5 w-5 text-primary" />
											) : (
												<Circle className="h-5 w-5" />
											)}
											{exercise.exerciseName}
										</CardTitle>
										<div className="mt-2 space-y-1">
											<p className="text-sm text-muted-foreground">
												Target: {exercise.sets} sets × {exercise.reps} reps
											</p>
											<div className="flex gap-2">
												<Badge variant="outline" className="text-xs">
													{exercise.muscleGroup}
												</Badge>
												<Badge variant="outline" className="text-xs">
													{exercise.equipmentType}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{/* Sets Table */}
								<div className="space-y-3">
									<div className="rounded-lg border border-border overflow-hidden">
										<table className="w-full text-sm">
											<thead className="bg-muted">
												<tr>
													<th className="p-2 text-left font-semibold w-16">
														Set
													</th>
													<th className="p-2 text-left font-semibold">
														Weight ({units})
													</th>
													<th className="p-2 text-left font-semibold">Reps</th>
													<th className="p-2 text-left font-semibold">RPE</th>
													<th className="p-2 text-left font-semibold w-24">
														Action
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-border">
												{exercise.completedSets.map((set, setIdx) => (
													<tr
														key={set.number}
														className={`${
															set.completed
																? "bg-primary/5"
																: "hover:bg-accent/50"
														} transition-colors`}
													>
														<td className="p-2 font-semibold">{set.number}</td>
														<td className="p-2">
															{set.completed ? (
																<span className="terminal-text text-primary">
																	{set.weight}
																</span>
															) : (
																<Input
																	type="number"
																	className="h-8 w-20"
																	value={set.weight || ""}
																	onChange={(e) =>
																		updateSetValue(
																			exerciseIdx,
																			setIdx,
																			"weight",
																			Number.parseFloat(e.target.value) || 0,
																		)
																	}
																	placeholder="0"
																/>
															)}
														</td>
														<td className="p-2">
															{set.completed ? (
																<span className="terminal-text text-primary">
																	{set.reps}
																</span>
															) : (
																<Input
																	type="number"
																	className="h-8 w-16"
																	value={set.reps || ""}
																	onChange={(e) =>
																		updateSetValue(
																			exerciseIdx,
																			setIdx,
																			"reps",
																			Number.parseInt(e.target.value, 10) || 0,
																		)
																	}
																	placeholder="0"
																/>
															)}
														</td>
														<td className="p-2">
															{set.completed ? (
																<Badge variant="secondary" className="text-xs">
																	{set.rpe || "-"}
																</Badge>
															) : (
																<Input
																	type="number"
																	className="h-8 w-16"
																	value={set.rpe || ""}
																	onChange={(e) =>
																		updateSetValue(
																			exerciseIdx,
																			setIdx,
																			"rpe",
																			Number.parseInt(e.target.value, 10) || 0,
																		)
																	}
																	placeholder="1-10"
																	max={10}
																	min={1}
																/>
															)}
														</td>
														<td className="p-2">
															{set.completed ? (
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8"
																>
																	<Edit className="h-3 w-3" />
																</Button>
															) : (
																<Button
																	size="sm"
																	className="h-8"
																	onClick={() =>
																		handleCompleteSet(exerciseIdx, setIdx)
																	}
																>
																	<CheckCircle className="h-3 w-3" />
																</Button>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									{/* Quick Actions */}
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												startRest(exercise.restSeconds || defaultRestTime)
											}
										>
											<Clock className="h-3 w-3 mr-1" />
											Rest {formatTime(exercise.restSeconds || defaultRestTime)}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Finish Workout */}
			{totalSets > 0 && (
				<Card className="mt-8 border-primary/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-semibold">Ready to finish?</h3>
								<p className="text-sm text-muted-foreground">
									Save your workout and view summary
								</p>
							</div>
							<Button size="lg" onClick={handleFinishWorkout}>
								Finish Workout
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
