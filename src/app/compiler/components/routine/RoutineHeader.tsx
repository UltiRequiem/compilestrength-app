"use client";

import { Calendar, Clock, Dumbbell, Target } from "lucide-react";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";

interface RoutineHeaderProps {
	routine: WorkoutRoutine;
}

export function RoutineHeader({ routine }: RoutineHeaderProps) {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "text-green-400 border-green-600";
			case "intermediate":
				return "text-yellow-400 border-yellow-600";
			case "advanced":
				return "text-red-400 border-red-600";
			default:
				return "text-green-400 border-green-600";
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h2 className="text-lg font-mono text-green-400 flex items-center gap-2">
						<Dumbbell className="w-5 h-5" />
						{routine.name}
					</h2>
					{routine.description && (
						<p className="text-sm text-green-600 mt-1 leading-relaxed">
							{routine.description}
						</p>
					)}
				</div>

				<div
					className={`px-2 py-1 border rounded text-xs font-mono ${getDifficultyColor(routine.difficulty)}`}
				>
					{routine.difficulty.toUpperCase()}
				</div>
			</div>

			{/* Quick Stats */}
			<div className="flex items-center gap-6 text-xs">
				<div className="flex items-center gap-2 text-green-600">
					<Calendar className="w-4 h-4" />
					<span>{routine.frequency}x/week</span>
				</div>
				<div className="flex items-center gap-2 text-green-600">
					<Clock className="w-4 h-4" />
					<span>{routine.duration} weeks</span>
				</div>
				<div className="flex items-center gap-2 text-green-600">
					<Target className="w-4 h-4" />
					<span>{routine.goals.join(", ")}</span>
				</div>
			</div>
		</div>
	);
}
