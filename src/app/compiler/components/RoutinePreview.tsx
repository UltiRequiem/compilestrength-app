"use client";

import { Calendar, Dumbbell, Loader2 } from "lucide-react";
import {
	useGenerationProgress,
	useIsGenerating,
	useRoutine,
} from "@/stores/workout-routine-store";
import { ExerciseCard } from "./routine/ExerciseCard";
import { RoutineHeader } from "./routine/RoutineHeader";
import { RoutineStats } from "./routine/RoutineStats";

export function RoutinePreview() {
	const routine = useRoutine();
	const isGenerating = useIsGenerating();
	const generationProgress = useGenerationProgress();

	if (isGenerating && !routine) {
		return (
			<div className="flex flex-col h-full">
				<div className="border-b border-green-800/30 p-4">
					<h2 className="text-lg font-mono text-green-400 flex items-center gap-2">
						<Loader2 className="w-5 h-5 animate-spin" />
						Generating Your Routine
					</h2>
				</div>

				<div className="flex-1 flex items-center justify-center p-8">
					<div className="space-y-4 w-full max-w-md">
						{generationProgress.map((step, index) => (
							<div key={step.step} className="flex items-center gap-3">
								<div
									className={`w-2 h-2 rounded-full ${
										step.completed ? "bg-green-400" : "bg-green-800"
									}`}
								/>
								<div
									className={`font-mono text-sm ${
										step.completed ? "text-green-400" : "text-green-600"
									}`}
								>
									{step.description}
								</div>
								{!step.completed &&
									index ===
										generationProgress.findIndex((s) => !s.completed) && (
										<Loader2 className="w-4 h-4 animate-spin text-green-400 ml-auto" />
									)}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!routine) {
		return (
			<div className="flex flex-col h-full">
				<div className="border-b border-green-800/30 p-4">
					<h2 className="text-lg font-mono text-green-400 flex items-center gap-2">
						<Dumbbell className="w-5 h-5" />
						Workout Routine
					</h2>
					<p className="text-sm text-green-600 mt-1">
						Your custom routine will appear here
					</p>
				</div>

				<div className="flex-1 flex items-center justify-center p-8">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 border-2 border-green-800/30 rounded-lg flex items-center justify-center mx-auto">
							<Dumbbell className="w-8 h-8 text-green-800" />
						</div>
						<div className="space-y-2">
							<h3 className="text-green-400 font-mono">No Routine Yet</h3>
							<p className="text-green-600 text-sm">
								Start chatting with the AI to generate your personalized workout
								routine
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="border-b border-green-800/30 p-4">
				<RoutineHeader routine={routine} />
			</div>

			{/* Routine Content */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="space-y-6">
					{routine.days.map((day, dayIndex) => (
						<div key={day.id} className="space-y-3">
							{/* Day Header */}
							<div className="flex items-center gap-3 pb-2 border-b border-green-800/20">
								<div className="w-8 h-8 bg-green-900/30 border border-green-600 rounded flex items-center justify-center font-mono text-sm text-green-400">
									{dayIndex + 1}
								</div>
								<div>
									<h3 className="font-mono text-green-400 font-medium">
										{day.name}
									</h3>
									<p className="text-xs text-green-600">
										{day.exercises.length} exercise
										{day.exercises.length !== 1 ? "s" : ""}
									</p>
								</div>
							</div>

							{/* Exercises */}
							<div className="space-y-2 ml-11">
								{day.exercises.map((exercise) => (
									<ExerciseCard key={exercise.id} exercise={exercise} />
								))}
							</div>
						</div>
					))}
				</div>

				{routine.days.length === 0 && (
					<div className="text-center py-8">
						<Calendar className="w-12 h-12 text-green-800 mx-auto mb-4" />
						<p className="text-green-600 font-mono text-sm">
							No workout days added yet
						</p>
					</div>
				)}

				{/* Stats Overview - Moved to bottom */}
				<div className="border-t border-green-800/30 p-4 mt-6">
					<RoutineStats routine={routine} />
				</div>
			</div>

			{/* Generation Indicator */}
			{isGenerating && (
				<div className="border-t border-green-800/30 p-3">
					<div className="flex items-center gap-2 text-green-600 font-mono text-xs">
						<Loader2 className="w-4 h-4 animate-spin" />
						<span>Updating routine...</span>
					</div>
				</div>
			)}
		</div>
	);
}
