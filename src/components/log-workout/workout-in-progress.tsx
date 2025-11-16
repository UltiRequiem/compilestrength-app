"use client";

import {
	CheckCircle,
	Circle,
	Clock,
	Edit,
	Pause,
	Play,
	X,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import type { useWorkoutTimer } from "@/hooks/use-workout-timer";
import {
	useRestTimerDefault,
	useUnits,
} from "@/providers/user-preferences-store-provider";
import type { ExerciseWithSets, WorkoutDay } from "@/types/workout.types";
import { formatTime } from "../../app/app/log-workout/utils";

interface WorkoutInProgressProps {
	exercises: ExerciseWithSets[];
	completeSet: (exerciseIdx: number, setIdx: number) => Promise<any>;
	updateSetValue: (
		exerciseIdx: number,
		setIdx: number,
		field: "weight" | "reps" | "rpe",
		value: number,
	) => void;
	finishWorkout: () => Promise<any>;
	abortWorkout: () => Promise<any>;
	getCompletedSetsCount: () => number;
	getTotalSetsCount: () => number;
	currentDay: WorkoutDay | undefined;
	workoutTimer: ReturnType<typeof useWorkoutTimer>;
}

export function WorkoutInProgress({
	exercises,
	completeSet,
	updateSetValue,
	finishWorkout,
	abortWorkout,
	getCompletedSetsCount,
	getTotalSetsCount,
	currentDay,
	workoutTimer,
}: WorkoutInProgressProps) {
	const router = useRouter();
	const [showAbortDialog, setShowAbortDialog] = useState(false);

	// Temporary debug to see what we have
	React.useEffect(() => {
		console.log(
			"WorkoutInProgress - exercises:",
			exercises.length,
			"currentDay:",
			currentDay?.name,
		);
	}, [exercises.length, currentDay?.name]);

	const {
		elapsedTime,
		isRunning,
		restTimer,
		isResting,
		toggleTimer,
		startRest,
	} = workoutTimer;

	const units = useUnits();
	const defaultRestTime = useRestTimerDefault();

	const handleCompleteSet = async (exerciseIdx: number, setIdx: number) => {
		try {
			await completeSet(exerciseIdx, setIdx);

			const exercise = exercises[exerciseIdx];
			startRest(exercise.restSeconds || defaultRestTime);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to save set",
			);
		}
	};

	const handleFinishWorkout = async () => {
		try {
			await finishWorkout();
			router.push("/app");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to finish workout",
			);
		}
	};

	const handleAbortWorkout = async () => {
		try {
			await abortWorkout();
			toast.success("Workout aborted");
			// Wait a bit more before redirecting to ensure state is cleared
			setTimeout(() => {
				router.push("/app");
			}, 200);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to abort workout",
			);
		} finally {
			setShowAbortDialog(false);
		}
	};

	const completedSets = getCompletedSetsCount();
	const totalSets = getTotalSetsCount();

	return (
		<div className="mx-auto max-w-4xl">
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
						<Button
							variant="outline"
							onClick={() => setShowAbortDialog(true)}
							className="text-destructive hover:text-destructive"
						>
							<XCircle className="h-4 w-4 mr-2" />
							Abort
						</Button>
						<Button variant="outline" onClick={() => router.push("/app")}>
							<X className="h-4 w-4 mr-2" />
							Exit
						</Button>
					</div>
				</div>

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
																	onChange={(e) => {
																		const value =
																			Number.parseFloat(e.target.value) || 0;
																		if (value >= 0) {
																			updateSetValue(
																				exerciseIdx,
																				setIdx,
																				"weight",
																				value,
																			);
																		}
																	}}
																	placeholder="0"
																	min="0"
																	step="0.5"
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
																	onChange={(e) => {
																		const value =
																			Number.parseInt(e.target.value, 10) || 0;
																		if (value >= 0) {
																			updateSetValue(
																				exerciseIdx,
																				setIdx,
																				"reps",
																				value,
																			);
																		}
																	}}
																	placeholder="0"
																	min="0"
																	step="1"
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

			<ConfirmDialog
				open={showAbortDialog}
				onOpenChange={setShowAbortDialog}
				title="Abort Workout"
				description="Are you sure you want to abort this workout? All progress will be lost and cannot be recovered."
				confirmText="Abort Workout"
				cancelText="Continue Workout"
				onConfirm={handleAbortWorkout}
				destructive={true}
			/>
		</div>
	);
}
