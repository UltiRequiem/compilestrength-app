"use client";

import { BarChart3, Calendar, Clock, Dumbbell } from "lucide-react";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";

interface RoutineStatsProps {
	routine: WorkoutRoutine;
}

export function RoutineStats({ routine }: RoutineStatsProps) {
	const totalExercises = routine.days.reduce(
		(total, day) => total + day.exercises.length,
		0,
	);
	const totalSets = routine.days.reduce(
		(total, day) =>
			total +
			day.exercises.reduce((dayTotal, exercise) => dayTotal + exercise.sets, 0),
		0,
	);

	// Estimate workout duration (rough calculation)
	const estimatedDuration =
		routine.days.length > 0
			? Math.round(
					routine.days.reduce((total, day) => {
						const dayDuration = day.exercises.reduce((dayTime, exercise) => {
							// Rough estimation: 2 minutes per set + rest periods
							const setTime = 2 * exercise.sets; // 2 minutes per set
							const restTime = (exercise.sets - 1) * (exercise.restPeriod / 60); // rest between sets
							return dayTime + setTime + restTime;
						}, 0);
						return Math.max(total, dayDuration);
					}, 0) / routine.days.length,
				)
			: 0;

	// Get unique muscle groups and calculate volume per muscle group
	const muscleGroupVolume = routine.days.reduce(
		(acc, day) => {
			day.exercises.forEach((exercise) => {
				exercise.muscleGroups.forEach((muscle) => {
					const volume = exercise.sets;
					acc[muscle] = (acc[muscle] || 0) + volume;
				});
			});
			return acc;
		},
		{} as Record<string, number>,
	);

	const uniqueMuscleGroups = Object.keys(muscleGroupVolume);

	// Get top muscle groups by volume
	const topMuscleGroups = Object.entries(muscleGroupVolume)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 6); // Show top 6 muscle groups

	const stats = [
		{
			icon: Calendar,
			label: "Days",
			value: routine.days.length.toString(),
			color: "text-green-400",
		},
		{
			icon: Dumbbell,
			label: "Exercises",
			value: totalExercises.toString(),
			color: "text-blue-400",
		},
		{
			icon: BarChart3,
			label: "Total Sets",
			value: totalSets.toString(),
			color: "text-yellow-400",
		},
		{
			icon: Clock,
			label: "Est. Time",
			value: `${estimatedDuration}m`,
			color: "text-purple-400",
		},
	];

	return (
		<div className="space-y-3">
			{/* Quick Stats Grid */}
			<div className="grid grid-cols-4 gap-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div key={stat.label} className="text-center space-y-1">
							<div className={`${stat.color} flex justify-center`}>
								<Icon className="w-4 h-4" />
							</div>
							<div className={`font-mono text-sm ${stat.color}`}>
								{stat.value}
							</div>
							<div className="text-xs text-green-600">{stat.label}</div>
						</div>
					);
				})}
			</div>

			{/* Training Volume Analysis */}
			{topMuscleGroups.length > 0 && (
				<div className="space-y-3">
					<div className="text-xs text-green-600 font-mono">
						Training Volume Analysis:
					</div>

					{/* Volume bars */}
					<div className="space-y-2">
						{topMuscleGroups.map(([muscle, volume]) => {
							const percentage = (volume / topMuscleGroups[0][1]) * 100;
							return (
								<div key={muscle} className="space-y-1">
									<div className="flex justify-between items-center">
										<span className="text-xs text-green-400 font-mono capitalize">
											{muscle}
										</span>
										<span className="text-xs text-green-600 font-mono">
											{volume} sets
										</span>
									</div>
									<div className="w-full bg-green-900/20 rounded-full h-1">
										<div
											className="bg-green-500 h-1 rounded-full transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>

					{/* All muscle groups */}
					<div className="space-y-1">
						<div className="text-xs text-green-600 font-mono">
							All Muscle Groups:
						</div>
						<div className="flex flex-wrap gap-1">
							{uniqueMuscleGroups.map((muscle) => (
								<span
									key={muscle}
									className="px-2 py-1 bg-green-900/20 border border-green-800 text-green-400 text-xs font-mono rounded capitalize"
								>
									{muscle}
								</span>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
