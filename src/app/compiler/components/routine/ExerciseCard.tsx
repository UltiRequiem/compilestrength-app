"use client";

import { Clock, MoreHorizontal, Weight } from "lucide-react";
import type { Exercise } from "@/stores/workout-routine-store";

interface ExerciseCardProps {
	exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
	const formatRestTime = (seconds: number): string => {
		if (seconds >= 60) {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			return remainingSeconds > 0
				? `${minutes}m ${remainingSeconds}s`
				: `${minutes}m`;
		}
		return `${seconds}s`;
	};

	return (
		<div className="bg-green-950/10 border border-green-800/30 rounded-lg p-3 hover:border-green-700/50 transition-colors">
			{/* Exercise Header */}
			<div className="flex items-start justify-between mb-2">
				<div className="flex-1">
					<h4 className="font-mono text-green-400 text-sm font-medium">
						{exercise.name}
					</h4>
					<div className="flex items-center gap-2 mt-1">
						{/* Muscle Groups */}
						<div className="flex flex-wrap gap-1">
							{exercise.muscleGroups.map((muscle) => (
								<span
									key={muscle}
									className="px-1.5 py-0.5 bg-green-900/30 text-green-600 text-xs font-mono rounded"
								>
									{muscle}
								</span>
							))}
						</div>
					</div>
				</div>

				<button className="text-green-700 hover:text-green-500 p-1">
					<MoreHorizontal className="w-4 h-4" />
				</button>
			</div>

			{/* Volume Indicator */}
			<div className="text-xs text-green-600 mb-2">
				<span className="bg-green-900/30 px-2 py-1 rounded font-mono">
					Volume: {exercise.sets} sets
				</span>
			</div>

			{/* Exercise Details */}
			<div className="grid grid-cols-3 gap-4 text-xs">
				{/* Sets & Reps */}
				<div className="space-y-1">
					<div className="text-green-600 font-mono">Sets × Reps</div>
					<div className="text-green-400 font-mono font-medium">
						{exercise.sets} × {exercise.reps}
					</div>
				</div>

				{/* Rest Period */}
				<div className="space-y-1">
					<div className="text-green-600 font-mono flex items-center gap-1">
						<Clock className="w-3 h-3" />
						Rest
					</div>
					<div className="text-green-400 font-mono font-medium">
						{formatRestTime(exercise.restPeriod)}
					</div>
				</div>

				{/* Weight/Equipment */}
				<div className="space-y-1">
					<div className="text-green-600 font-mono flex items-center gap-1">
						<Weight className="w-3 h-3" />
						Equipment
					</div>
					<div className="text-green-400 font-mono font-medium text-xs">
						{exercise.equipment}
					</div>
					{exercise.weight && (
						<div className="text-green-500 font-mono text-xs">
							{exercise.weight}lbs
						</div>
					)}
				</div>
			</div>

			{/* Notes */}
			{exercise.notes && (
				<div className="mt-3 pt-2 border-t border-green-800/20">
					<div className="text-green-600 text-xs font-mono mb-1">Notes:</div>
					<div className="text-green-500 text-xs leading-relaxed">
						{exercise.notes}
					</div>
				</div>
			)}
		</div>
	);
}
