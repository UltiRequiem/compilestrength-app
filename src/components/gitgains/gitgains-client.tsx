"use client";

import {
	Activity,
	Award,
	Calendar,
	Download,
	Star,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnits } from "@/providers/user-preferences-store-provider";
import { convertWeight, formatWeight } from "@/stores/user-preferences-store";

interface WorkoutCommit {
	id: string;
	date: string;
	time: string;
	type: string;
	message: string;
	prs: string[];
}

interface PersonalRecord {
	id: string;
	exercise: string;
	record: string;
	date: string;
	hasVideo: boolean;
}

interface Insight {
	id: string;
	title: string;
	value: string | number;
	period: string;
	icon: string;
	color: string;
}

interface GitGainsClientProps {
	commits: WorkoutCommit[];
	prs: PersonalRecord[];
	insights: Insight[];
}

export function GitGainsClient({ commits, prs, insights }: GitGainsClientProps) {
	const units = useUnits();

	// Map icon names to components
	const iconMap = {
		Activity,
		Award,
		TrendingUp,
	};

	return (
		<div className="mx-auto max-w-7xl">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Progress Tracker</h1>
					<p className="text-muted-foreground">
						Your Training History & Performance Metrics
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<Calendar className="h-4 w-4" />
						Date Range
					</Button>
					<Button variant="outline">
						<Download className="h-4 w-4" />
						Export Data
					</Button>
				</div>
			</div>

			{/* Insights Cards */}
			<div className="mb-8 grid gap-4 md:grid-cols-3">
				{insights.map((insight) => {
					const IconComponent = iconMap[insight.icon as keyof typeof iconMap];
					return (
						<Card key={insight.id} className="card-hover border-primary/20">
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
										<IconComponent className={`h-6 w-6 ${insight.color}`} />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">
											{insight.title}
										</p>
										<p className="text-2xl font-bold text-primary">
											{typeof insight.value === "number"
												? formatWeight(convertWeight(insight.value, "lbs", units), units)
												: insight.value}
										</p>
										<p className="text-xs text-muted-foreground">
											{insight.period}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Commits Timeline */}
				<div className="lg:col-span-2">
					<Card className="border-primary/20">
						<CardHeader>
							<CardTitle>Training History</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{commits.length > 0 ? (
									commits.map((commit, idx) => (
										<div key={commit.id} className="flex gap-4">
											{/* Git-style line and dot */}
											<div className="flex flex-col items-center">
												<div
													className={`h-3 w-3 rounded-full border-2 ${
														commit.prs.length > 0
															? "border-primary bg-primary"
															: "border-muted bg-background"
													}`}
												/>
												{idx < commits.length - 1 && (
													<div className="w-0.5 flex-1 bg-border mt-2" />
												)}
											</div>

											{/* Commit content */}
											<Card className="flex-1 card-hover">
												<CardContent className="p-4">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<div className="mb-2 flex items-center gap-2">
																<Badge variant="secondary" className="text-xs">
																	{commit.type}
																</Badge>
																<span className="text-xs text-muted-foreground">
																	{commit.date} at {commit.time}
																</span>
															</div>
															<p className="font-semibold">{commit.message}</p>
															{commit.prs.length > 0 && (
																<div className="mt-2 flex items-center gap-2">
																	<Star className="h-4 w-4 text-primary" />
																	<span className="text-sm text-primary">
																		PR: {commit.prs[0]}
																	</span>
																</div>
															)}
														</div>
													</div>
												</CardContent>
											</Card>
										</div>
									))
								) : (
									<div className="text-center py-8 text-muted-foreground">
										No workout history yet. Start logging workouts to see your
										progress here.
									</div>
								)}
							</div>

							{commits.length > 0 && (
								<Button variant="outline" className="mt-4 w-full">
									Load More
								</Button>
							)}
						</CardContent>
					</Card>

					{/* Main Chart Section */}
					<Card className="mt-8 border-primary/20">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Progress Chart</CardTitle>
								<div className="flex gap-2">
									<Button variant="outline" size="sm">
										Weight
									</Button>
									<Button variant="ghost" size="sm">
										Volume
									</Button>
									<Button variant="ghost" size="sm">
										1RM
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-lg">
								<p className="text-muted-foreground">
									Chart visualization coming soon
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Exercise Details & PRs */}
				<div className="space-y-8">
					{/* Exercise Selector */}
					<Card className="border-primary/20">
						<CardHeader>
							<CardTitle>Exercise Analysis</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
								<option>Select an exercise...</option>
								{prs.map((pr) => (
									<option key={pr.exercise} value={pr.exercise}>
										{pr.exercise}
									</option>
								))}
							</select>

							{prs.length > 0 && (
								<div className="space-y-3">
									<div>
										<p className="text-sm text-muted-foreground">All-time PR</p>
										<p className="text-lg font-bold">
											{prs[0].record}
										</p>
										<p className="text-xs text-muted-foreground">
											{prs[0].date}
										</p>
									</div>
								</div>
							)}

							<Button variant="outline" className="w-full">
								See Full History
							</Button>
						</CardContent>
					</Card>

					{/* Personal Records */}
					<Card className="border-primary/20">
						<CardHeader>
							<CardTitle>Personal Records</CardTitle>
						</CardHeader>
						<CardContent>
							{prs.length > 0 ? (
								<div className="space-y-3">
									{prs.map((pr) => (
										<div
											key={pr.id}
											className="flex items-start justify-between rounded-lg border border-border p-3 card-hover"
										>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 text-primary" />
													<p className="font-semibold">{pr.exercise}</p>
												</div>
												<p className="mt-1 text-sm text-primary">{pr.record}</p>
												<p className="text-xs text-muted-foreground">{pr.date}</p>
											</div>
											{pr.hasVideo && (
												<Button variant="ghost" size="sm">
													<Activity className="h-4 w-4" />
												</Button>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-6 text-muted-foreground text-sm">
									No personal records yet. Keep training to set your first PR!
								</div>
							)}

							{prs.length > 0 && (
								<div className="mt-4 flex gap-2">
									<Button variant="outline" size="sm" className="flex-1">
										All Time
									</Button>
									<Button variant="ghost" size="sm" className="flex-1">
										This Year
									</Button>
									<Button variant="ghost" size="sm" className="flex-1">
										This Month
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
