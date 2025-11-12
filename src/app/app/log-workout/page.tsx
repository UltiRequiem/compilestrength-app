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
import { useEffect, useState } from "react";
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
import { useRequireAuth } from "@/lib/auth-client";
import {
	useRestTimerDefault,
	useUnits,
} from "@/providers/user-preferences-store-provider";
import {
	Exercise,
	WorkoutDay,
	WorkoutProgram,
	Set,
	ExerciseWithSets,
} from "./types";
import { formatTime } from "./utils";


export default function LogWorkoutPage() {
	const { session, isPending } = useRequireAuth();
	const router = useRouter();
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isRunning, setIsRunning] = useState(true);
	const [restTimer, setRestTimer] = useState<number | null>(null);
	const [isResting, setIsResting] = useState(false);
	const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
	const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const [workoutSession, setWorkoutSession] = useState<any>(null);
	const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
	const [loading, setLoading] = useState(true);
	const [isStarting, setIsStarting] = useState(false);

	// Use global preferences
	const units = useUnits();
	const defaultRestTime = useRestTimerDefault();

	const loadPrograms = async () => {
		try {
			const response = await fetch("/api/workout-programs");
			if (response.ok) {
				const data = (await response.json()) as WorkoutProgram[];
				setPrograms(data);
				if (data.length > 0) {
					setSelectedProgram(data[0].id);
					if (data[0].days.length > 0) {
						setSelectedDay(data[0].days[0].id);
					}
				}
			}
		} catch (error) {
			console.error("Error loading programs:", error);
		} finally {
			setLoading(false);
		}
	};

	// Load workout programs
	useEffect(() => {
		if (session) {
			loadPrograms();
		}
	}, [session]);

	const startWorkout = async () => {
		if (!selectedDay) return;

		setIsStarting(true);
		try {
			const response = await fetch("/api/workout-sessions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ workoutDayId: selectedDay }),
			});

			if (response.ok) {
				const sessionData = await response.json();
				setWorkoutSession(sessionData);

				// Initialize exercises with empty sets
				const currentProgram = programs.find((p) => p.id === selectedProgram);
				const currentDay = currentProgram?.days.find(
					(d) => d.id === selectedDay,
				);

				if (currentDay) {
					const exercisesWithSets: ExerciseWithSets[] =
						currentDay.exercises.map((ex) => ({
							...ex,
							completedSets: Array.from({ length: ex.sets }, (_, i) => ({
								number: i + 1,
								weight: 0,
								reps: null,
								rpe: null,
								completed: false,
							})),
						}));
					setExercises(exercisesWithSets);
				}
			} else {
				const error = (await response.json()) as { error?: string };
				alert(error.error || "Failed to start workout");
			}
		} catch (error) {
			console.error("Error starting workout:", error);
			alert("Failed to start workout");
		} finally {
			setIsStarting(false);
		}
	};

	const completeSet = async (exerciseIdx: number, setIdx: number) => {
		const exercise = exercises[exerciseIdx];
		const set = exercise.completedSets[setIdx];

		if (!set.reps || !set.weight) {
			alert("Please enter weight and reps");
			return;
		}

		try {
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

				// Auto-start rest timer
				startRest(exercise.restSeconds || defaultRestTime);
			}
		} catch (error) {
			console.error("Error completing set:", error);
			alert("Failed to save set");
		}
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

		try {
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
				router.push("/app");
			}
		} catch (error) {
			console.error("Error finishing workout:", error);
			alert("Failed to finish workout");
		}
	};

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isRunning && workoutSession) {
			interval = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning, workoutSession]);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isResting && restTimer !== null && restTimer > 0) {
			interval = setInterval(() => {
				setRestTimer((prev) => (prev ? prev - 1 : 0));
			}, 1000);
		} else if (restTimer === 0) {
			setIsResting(false);
			setRestTimer(null);
		}
		return () => clearInterval(interval);
	}, [isResting, restTimer]);

	const completedSets = exercises.reduce(
		(acc, ex) => acc + ex.completedSets.filter((s) => s.completed).length,
		0,
	);
	const totalSets = exercises.reduce(
		(acc, ex) => acc + ex.completedSets.length,
		0,
	);

	const startRest = (seconds: number) => {
		setRestTimer(seconds);
		setIsResting(true);
	};

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
		const currentProgram = programs.find((p) => p.id === selectedProgram);
		const currentDay = currentProgram?.days.find((d) => d.id === selectedDay);

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
										onValueChange={(value) => {
											setSelectedProgram(value);
											const program = programs.find((p) => p.id === value);
											if (program && program.days.length > 0) {
												setSelectedDay(program.days[0].id);
											}
										}}
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
											onValueChange={setSelectedDay}
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
											onClick={startWorkout}
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
	const currentProgram = programs.find((p) => p.id === selectedProgram);
	const currentDay = currentProgram?.days.find((d) => d.id === selectedDay);

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
						<Button
							variant="outline"
							size="icon"
							onClick={() => setIsRunning(!isRunning)}
						>
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
																		completeSet(exerciseIdx, setIdx)
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
							<Button size="lg" onClick={finishWorkout}>
								Finish Workout
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
