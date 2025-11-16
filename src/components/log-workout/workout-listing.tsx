"use client";

import { Dumbbell, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useActiveSession } from "@/hooks/use-active-session";
import { useWorkoutPrograms } from "@/hooks/use-workout-programs";

export function WorkoutListing() {
	const router = useRouter();

	const {
		programs,
		selectedProgram,
		selectedDay,
		selectProgram,
		selectDay,
		getCurrentProgram,
		getCurrentDay,
	} = useWorkoutPrograms();

	const { startWorkout, initializeExercises, isStarting } = useActiveSession();

	const handleStartWorkout = async () => {
		if (!selectedDay) return;

		try {
			const sessionData = await startWorkout(selectedDay);
			const currentDay = getCurrentDay();

			if (sessionData && currentDay) {
				initializeExercises(currentDay, sessionData.id);
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to start workout",
			);
		}
	};

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
						<h3 className="text-xl font-semibold mb-2">No Workout Programs</h3>
						<p className="text-muted-foreground mb-6">
							You don't have any workout programs yet. Create a program to start
							logging workouts.
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
										<h3 className="font-semibold text-lg">{currentDay.name}</h3>
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
