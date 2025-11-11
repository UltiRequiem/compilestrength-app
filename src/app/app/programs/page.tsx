"use client";

import {
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	Download,
	Loader2,
	Play,
	RefreshCw,
	Save,
	Search,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/lib/auth-client";
import {
	useIsLoadingPrograms,
	useProgramsActions,
	useRoutines,
	useSelectedRoutine,
	useSelectedRoutineId,
} from "@/stores/programs-store";

export default function ProgramsPage() {
	const { session, isPending } = useRequireAuth();

	// Zustand store state
	const routines = useRoutines();
	const selectedRoutineId = useSelectedRoutineId();
	const selectedRoutine = useSelectedRoutine();
	const loadingRoutines = useIsLoadingPrograms();
	const { setSelectedRoutineId, fetchRoutines } = useProgramsActions();

	// Local UI state
	const [expandedDay, setExpandedDay] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Fetch routines on mount and when session changes
	useEffect(() => {
		if (session?.user?.id) {
			fetchRoutines();
		}
	}, [session?.user?.id, fetchRoutines]);

	// Filter routines based on search query
	const filteredRoutines = useMemo(() => {
		if (!searchQuery.trim()) return routines;

		const query = searchQuery.toLowerCase();
		return routines.filter(
			(routine) =>
				routine.name.toLowerCase().includes(query) ||
				routine.description.toLowerCase().includes(query) ||
				routine.difficulty.toLowerCase().includes(query) ||
				routine.goals.some((goal) => goal.toLowerCase().includes(query)),
		);
	}, [routines, searchQuery]);

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!session) {
		return null;
	}

	// Show loading state while fetching routines
	if (loadingRoutines) {
		return (
			<AppLayout>
				<div className="flex items-center justify-center h-64">
					<div className="text-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
						<p className="text-muted-foreground">
							Loading your workout programs...
						</p>
					</div>
				</div>
			</AppLayout>
		);
	}

	// Show empty state if no routines
	if (routines.length === 0) {
		return (
			<AppLayout>
				<div className="flex items-center justify-center h-64">
					<div className="text-center space-y-6 max-w-md">
						<div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
							<Calendar className="w-8 h-8 text-muted-foreground" />
						</div>
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">No Programs Yet</h2>
							<p className="text-muted-foreground text-sm">
								You haven't created any workout programs yet. Use the AI
								Compiler to generate your first program.
							</p>
						</div>
						<Button
							onClick={() => {
								window.location.href = "/app/compiler";
							}}
							className="gap-2"
						>
							<Zap className="w-4 h-4" />
							Create Your First Program
						</Button>
					</div>
				</div>
			</AppLayout>
		);
	}

	// Format rest period for display
	const formatRestPeriod = (seconds: number): string => {
		if (seconds >= 60) {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			return remainingSeconds > 0
				? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}min`
				: `${minutes}min`;
		}
		return `${seconds}s`;
	};

	return (
		<AppLayout>
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-6 flex items-start justify-between">
						<div className="flex-1 max-w-2xl">
							{routines.length > 1 && (
								<div className="mb-4 space-y-3">
									<label className="text-sm font-medium text-muted-foreground block">
										Select Program ({routines.length} available)
									</label>

									{/* Search input */}
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											placeholder="Search your programs..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="pl-10"
										/>
									</div>

									{/* Program selector dropdown */}
									<div className="relative">
										<Button
											variant="outline"
											onClick={() => setDropdownOpen(!dropdownOpen)}
											className="w-full justify-between h-auto py-3 px-4"
										>
											{selectedRoutine ? (
												<div className="flex items-center gap-3 flex-1">
													<div className="flex-1 text-left">
														<div className="font-medium">
															{selectedRoutine.name}
														</div>
														<div className="text-xs text-muted-foreground">
															{selectedRoutine.goals.join(", ")} •{" "}
															{selectedRoutine.frequency}x/week •{" "}
															{selectedRoutine.days.length} days
														</div>
													</div>
													<Badge variant="secondary" className="text-[10px]">
														{selectedRoutine.difficulty}
													</Badge>
												</div>
											) : (
												"Select a program..."
											)}
											<ChevronDown
												className={`ml-2 h-4 w-4 transition-transform ${
													dropdownOpen ? "rotate-180" : ""
												}`}
											/>
										</Button>

										{/* Dropdown menu */}
										{dropdownOpen && (
											<div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
												{filteredRoutines.length === 0 ? (
													<div className="p-4 text-center text-sm text-muted-foreground">
														{searchQuery
															? "No programs match your search."
															: "No programs available."}
													</div>
												) : (
													<div className="p-1">
														{filteredRoutines.map((routine) => (
															<button
																key={routine.id}
																onClick={() => {
																	setSelectedRoutineId(routine.id);
																	setDropdownOpen(false);
																}}
																className="w-full flex items-center justify-between p-3 rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left transition-colors"
															>
																<div className="flex-1">
																	<div className="font-medium">
																		{routine.name}
																	</div>
																	<div className="text-xs text-muted-foreground mt-1">
																		{routine.goals.join(", ")} •{" "}
																		{routine.frequency}x/week •{" "}
																		{routine.duration} weeks •{" "}
																		{routine.days.length} days
																	</div>
																</div>
																<div className="flex items-center gap-2 ml-3">
																	<Badge
																		variant="secondary"
																		className="text-[10px]"
																	>
																		{routine.difficulty}
																	</Badge>
																	{selectedRoutineId === routine.id && (
																		<Check className="h-4 w-4 text-primary" />
																	)}
																</div>
															</button>
														))}
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							)}

							{selectedRoutine && (
								<div>
									<h1 className="text-3xl font-bold mb-2">
										{selectedRoutine.name}
									</h1>
									<div className="flex items-center gap-4 text-sm text-muted-foreground">
										<span>
											Generated{" "}
											{new Date(selectedRoutine.createdAt).toLocaleDateString()}
										</span>
										<span>•</span>
										<span>Goals: {selectedRoutine.goals.join(", ")}</span>
										<span>•</span>
										<span>{selectedRoutine.frequency}x per week</span>
										<span>•</span>
										<span>{selectedRoutine.duration} weeks</span>
									</div>
								</div>
							)}
						</div>

						<div className="flex gap-2">
							<Button size="sm" variant="outline">
								<Save className="h-4 w-4" />
							</Button>
							<Button size="sm" variant="outline">
								<Download className="h-4 w-4" />
								Export
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => (window.location.href = "/app/compiler")}
							>
								<RefreshCw className="h-4 w-4" />
								Generate New
							</Button>
							<Button size="sm">
								<Play className="h-4 w-4" />
								Start Program
							</Button>
						</div>
					</div>
				</div>

				{/* Day Cards */}
				{selectedRoutine && (
					<div className="grid gap-4 md:grid-cols-2">
						{selectedRoutine.days.map((day, dayIndex) => (
							<Card key={day.id} className="card-hover border-primary/20">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">{day.name}</CardTitle>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												setExpandedDay(
													expandedDay === dayIndex ? null : dayIndex,
												)
											}
										>
											{expandedDay === dayIndex ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{expandedDay === dayIndex ? (
										<div className="space-y-4">
											{/* Full Exercise Details */}
											<div className="rounded-lg border border-border overflow-hidden">
												<table className="w-full text-sm">
													<thead className="bg-muted">
														<tr>
															<th className="p-2 text-left font-semibold">
																Exercise
															</th>
															<th className="p-2 text-left font-semibold">
																Sets × Reps
															</th>
															<th className="p-2 text-left font-semibold">
																Equipment
															</th>
															<th className="p-2 text-left font-semibold">
																Rest
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-border">
														{day.exercises.map((exercise) => (
															<tr
																key={exercise.id}
																className="hover:bg-accent/50 transition-colors"
															>
																<td className="p-2 font-medium">
																	{exercise.name}
																	{exercise.notes && (
																		<p className="text-xs text-muted-foreground mt-1">
																			{exercise.notes}
																		</p>
																	)}
																</td>
																<td className="p-2 terminal-text text-primary">
																	{exercise.sets} × {exercise.reps}
																</td>
																<td className="p-2">
																	<Badge
																		variant="secondary"
																		className="text-xs capitalize"
																	>
																		{exercise.equipment}
																	</Badge>
																</td>
																<td className="p-2 text-muted-foreground">
																	{formatRestPeriod(exercise.restPeriod)}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
											<Button className="w-full">
												<Play className="h-4 w-4" />
												Start Workout
											</Button>
										</div>
									) : (
										<div className="space-y-2">
											{/* Collapsed View */}
											{day.exercises.slice(0, 3).map((exercise) => (
												<div
													key={exercise.id}
													className="flex justify-between text-sm"
												>
													<span className="text-muted-foreground">
														{exercise.name}
													</span>
													<span className="terminal-text text-primary">
														{exercise.sets} × {exercise.reps}
													</span>
												</div>
											))}
											{day.exercises.length > 3 && (
												<p className="text-xs text-muted-foreground">
													+{day.exercises.length - 3} more exercises
												</p>
											)}
											<Button
												variant="outline"
												size="sm"
												className="mt-3 w-full"
											>
												Log This Workout
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Program Notes */}
				{selectedRoutine && (
					<Card className="mt-8 border-primary/50">
						<CardHeader>
							<CardTitle>Program Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 terminal-text text-sm text-primary">
								<p>
									<span className="text-muted-foreground">{">"}</span>{" "}
									{selectedRoutine.description ||
										`This is a ${selectedRoutine.difficulty}-level ${selectedRoutine.frequency}x/week program focused on ${selectedRoutine.goals.join(
											" and ",
										)}.`}
								</p>
								<p>
									<span className="text-muted-foreground">{">"}</span> Program
									Duration: {selectedRoutine.duration} weeks with{" "}
									{selectedRoutine.frequency} sessions per week
								</p>
								<p>
									<span className="text-muted-foreground">{">"}</span> Training
									Goals:{" "}
									{selectedRoutine.goals
										.map((goal) => goal.replace("_", " "))
										.join(", ")}
								</p>
								<p>
									<span className="text-muted-foreground">{">"}</span>{" "}
									Difficulty Level: {selectedRoutine.difficulty} - suitable for
									lifters with appropriate experience
								</p>
								<p>
									<span className="text-muted-foreground">{">"}</span> Total
									Workout Days: {selectedRoutine.days.length} unique training
									sessions
								</p>
								{selectedRoutine.days.length > 0 && (
									<p>
										<span className="text-muted-foreground">{">"}</span>{" "}
										Training Split:{" "}
										{selectedRoutine.days.map((day) => day.name).join(" → ")}
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</AppLayout>
	);
}
