"use client";

import {
	BarChart3,
	Calendar,
	Dumbbell,
	Flame,
	Play,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnits } from "@/providers/user-preferences-store-provider";
import { convertWeight, formatWeight } from "@/stores/user-preferences-store";

interface DashboardClientProps {
	userName: string;
	today: string;
	weekDays: Array<{
		day: string;
		workout: string;
		status: string;
	}>;
	recentActivity: Array<{
		exercise: string;
		sets: number;
		reps: number;
		weight: number;
		date: string;
	}>;
	stats: {
		totalWorkouts: number;
		workoutsChange: number;
		currentStreak: number;
		lastPR: { exerciseName: string; weight: number } | null;
		nextWorkout: string | null;
	};
}

export function DashboardClient({
	userName,
	today,
	weekDays,
	recentActivity,
	stats,
}: DashboardClientProps) {
	// Use user preferences for weight units
	const units = useUnits();
	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold">
					Welcome back, {userName.split(" ")[0]}
				</h1>
				<p className="text-muted-foreground">{today}</p>
			</div>

			{/* Quick Stats */}
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="card-hover glow-blue-hover border-primary/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Workouts
						</CardTitle>
						<Dumbbell className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary">
							{stats.totalWorkouts}
						</div>
						<p className="text-xs text-muted-foreground">
							{stats.workoutsChange > 0
								? `+${stats.workoutsChange} this month`
								: stats.workoutsChange === 0
									? "No workouts this month"
									: "Start tracking workouts"}
						</p>
					</CardContent>
				</Card>

				<Card className="card-hover glow-blue-hover border-primary/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Current Streak
						</CardTitle>
						<Flame className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary">
							{stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}
						</div>
						<p className="text-xs text-muted-foreground">
							{stats.currentStreak > 0
								? "Keep it up!"
								: "Start your streak today"}
						</p>
					</CardContent>
				</Card>

				<Card className="card-hover glow-blue-hover border-primary/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Last PR</CardTitle>
						<TrendingUp className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						{stats.lastPR ? (
							<>
								<div className="text-lg font-bold text-primary">
									{stats.lastPR.exerciseName}{" "}
									{formatWeight(
										convertWeight(stats.lastPR.weight, "lbs", units),
										units,
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Personal record
								</p>
							</>
						) : (
							<>
								<div className="text-lg font-bold text-primary">No PRs yet</div>
								<p className="text-xs text-muted-foreground">
									Start logging workouts
								</p>
							</>
						)}
					</CardContent>
				</Card>

				<Card className="card-hover glow-blue-hover border-primary/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Next Workout</CardTitle>
						<Calendar className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						{stats.nextWorkout ? (
							<>
								<div className="text-lg font-bold text-primary">
									{stats.nextWorkout}
								</div>
								<p className="text-xs text-muted-foreground">
									From your program
								</p>
							</>
						) : (
							<>
								<div className="text-lg font-bold text-primary">
									No program set
								</div>
								<p className="text-xs text-muted-foreground">
									Generate a program
								</p>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* This Week's Program */}
			<div className="mb-8">
				<h2 className="mb-4 text-2xl font-bold">This Week&apos;s Program</h2>
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
					{weekDays.map((item) => (
						<Card
							key={item.day}
							className={`card-hover ${
								item.status === "today"
									? "border-primary glow-green"
									: item.status === "completed"
										? "border-muted opacity-60"
										: ""
							}`}
						>
							<CardHeader className="p-4 pb-2">
								<CardTitle className="text-sm font-semibold">
									{item.day}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<p className="text-xs text-muted-foreground">{item.workout}</p>
								<div className="mt-2">
									{item.status === "completed" && (
										<Badge variant="secondary" className="text-[10px]">
											✓ Done
										</Badge>
									)}
									{item.status === "today" && (
										<Badge className="bg-primary text-[10px]">Today</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Recent Activity */}
				<div>
					<h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
					<Card className="border-primary/20">
						<CardContent className="p-0">
							<div className="divide-y divide-border">
								{recentActivity.map((activity) => (
									<div
										key={`${activity.exercise}-${activity.date}-${activity.weight}`}
										className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
									>
										<div className="flex-1">
											<p className="font-semibold">{activity.exercise}</p>
											<p className="text-sm text-muted-foreground terminal-text">
												{activity.sets} × {activity.reps} @{" "}
												{formatWeight(
													convertWeight(activity.weight, "lbs", units),
													units,
												)}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-muted-foreground">
												{activity.date}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
					<div className="space-y-3">
						<Button
							className="w-full justify-start text-left h-auto py-4"
							onClick={() => {
								window.location.href = "/app/compiler";
							}}
						>
							<Sparkles className="h-5 w-5" />
							<div className="flex-1">
								<div className="font-semibold">Generate New Program</div>
								<div className="text-xs opacity-80">
									Let AI create a custom workout plan
								</div>
							</div>
						</Button>

						<Button
							variant="outline"
							className="w-full justify-start text-left h-auto py-4 border-primary/50 hover:bg-primary/10"
							onClick={() => {
								window.location.href = "/app/log-workout";
							}}
						>
							<Play className="h-5 w-5 text-primary" />
							<div className="flex-1">
								<div className="font-semibold">Log Today&apos;s Workout</div>
								<div className="text-xs opacity-80">
									Start tracking your session
								</div>
							</div>
						</Button>

						<Button
							variant="outline"
							className="w-full justify-start text-left h-auto py-4 border-primary/50 hover:bg-primary/10"
							onClick={() => {
								window.location.href = "/app/debugger";
							}}
						>
							<BarChart3 className="h-5 w-5 text-primary" />
							<div className="flex-1">
								<div className="font-semibold">Analyze Performance</div>
								<div className="text-xs opacity-80">
									Review training data and optimize your approach
								</div>
							</div>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
