"use client";

import {
	Activity,
	AlertTriangle,
	Calendar,
	CheckCircle,
	Loader2,
	PlayCircle,
	TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/lib/auth-client";

export default function DebuggerPage() {
	const { session, isPending } = useRequireAuth();
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysisComplete, setAnalysisComplete] = useState(true);

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

	const handleAnalysis = () => {
		setIsAnalyzing(true);
		setTimeout(() => {
			setIsAnalyzing(false);
			setAnalysisComplete(true);
		}, 3000);
	};

	const issues = [
		{
			id: "issue-progressive-overload",
			severity: "critical",
			title: "No Progressive Overload Detected",
			description: "Your bench press weight hasn't increased in 6 weeks",
			details: [
				"at Bench Press (chest.ts:45)",
				"Last 4 sessions: 185 lbs × 8, 8, 7, 7 (no change)",
				"Recommended: Increase weight by 5 lbs or add 1-2 reps",
			],
			trend: "flat",
		},
		{
			id: "issue-training-frequency",
			severity: "warning",
			title: "Low Training Frequency",
			description: "You're hitting chest 1x per week but goal is hypertrophy",
			details: [
				"Current: 1 session/week, 12 sets",
				"Recommended: 2 sessions/week, 8-10 sets each",
				"Research suggests: 2-3x frequency for hypertrophy",
			],
			trend: "down",
		},
		{
			id: "issue-fatigue-accumulation",
			severity: "info",
			title: "High Fatigue Accumulation",
			description: "Your RPE has been 9-10 for 3 weeks straight",
			details: [
				"Average RPE: 9.2 (last 2 weeks)",
				"Recommended: Deload week or reduce intensity",
				"Signs: Decreasing reps despite same weight",
			],
			trend: "down",
		},
	];

	const workingWell = [
		{
			id: "working-squat-frequency",
			text: "Great frequency on squats (3x/week)",
		},
		{
			id: "working-deadlift-overload",
			text: "Consistent progressive overload on deadlift",
		},
		{ id: "working-back-variety", text: "Good exercise variety for back" },
		{ id: "working-rest-sessions", text: "Adequate rest between sessions" },
	];

	const previousAnalyses = [
		{
			id: "analysis-oct-28",
			date: "Oct 28, 2024",
			issuesFound: 2,
			issuesResolved: 1,
		},
		{
			id: "analysis-oct-15",
			date: "Oct 15, 2024",
			issuesFound: 3,
			issuesResolved: 2,
		},
	];

	return (
		<AppLayout>
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Gains Debugger</h1>
					<p className="text-muted-foreground">
						Stack Trace for Your Progress
					</p>
					<p className="text-sm text-muted-foreground">
						Last analyzed: 2 hours ago
					</p>
				</div>

						{/* Run Analysis Button */}
						<Card className="mb-8 border-primary/50 glow-green-hover">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-semibold text-lg">
											Run Comprehensive Analysis
										</h3>
										<p className="text-sm text-muted-foreground">
											Analyze your training history to identify bottlenecks and
											plateaus
										</p>
									</div>
									<Button size="lg" onClick={handleAnalysis}>
										<PlayCircle className="h-5 w-5" />
										Run Analysis
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Analysis Status */}
						{isAnalyzing && (
							<Card className="mb-8 border-primary/50 glow-green">
								<CardContent className="p-8">
									<div className="space-y-4">
										<div className="flex items-center gap-3 text-primary">
											<Loader2 className="h-5 w-5 animate-spin" />
											<p className="terminal-text font-semibold">
												{">"} Analyzing workout history...
											</p>
										</div>
										<div className="flex items-center gap-3 text-primary">
											<Loader2 className="h-5 w-5 animate-spin" />
											<p className="terminal-text font-semibold">
												{">"} Checking progressive overload...
											</p>
										</div>
										<div className="flex items-center gap-3 text-primary">
											<Loader2 className="h-5 w-5 animate-spin" />
											<p className="terminal-text font-semibold">
												{">"} Evaluating volume and frequency...
											</p>
										</div>
										<div className="flex items-center gap-3 text-primary">
											<Loader2 className="h-5 w-5 animate-spin" />
											<p className="terminal-text font-semibold">
												{">"} Identifying potential issues...
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Issues Found */}
						{analysisComplete && !isAnalyzing && (
							<>
								<div className="mb-8 space-y-6">
									<h2 className="text-2xl font-bold">Issues Found</h2>

									{issues.map((issue) => (
										<Card
											key={issue.id}
											className={`${
												issue.severity === "critical"
													? "border-destructive/50"
													: issue.severity === "warning"
														? "border-yellow-500/50"
														: "border-blue-500/50"
											}`}
										>
											<CardHeader>
												<div className="flex items-start gap-4">
													<div
														className={`flex h-10 w-10 items-center justify-center rounded-lg ${
															issue.severity === "critical"
																? "bg-destructive/10"
																: issue.severity === "warning"
																	? "bg-yellow-500/10"
																	: "bg-blue-500/10"
														}`}
													>
														<AlertTriangle
															className={`h-5 w-5 ${
																issue.severity === "critical"
																	? "text-destructive"
																	: issue.severity === "warning"
																		? "text-yellow-500"
																		: "text-blue-500"
															}`}
														/>
													</div>
													<div className="flex-1">
														<div className="mb-2 flex items-center gap-2">
															<Badge
																variant={
																	issue.severity === "critical"
																		? "destructive"
																		: "secondary"
																}
																className="text-xs"
															>
																{issue.severity.toUpperCase()}
															</Badge>
															<CardTitle className="text-lg">
																{issue.title}
															</CardTitle>
														</div>
														<p className="text-muted-foreground">
															{issue.description}
														</p>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="space-y-4">
													{/* Stack Trace */}
													<div className="rounded-lg bg-secondary p-4 terminal-text text-sm">
														<p className="mb-2 font-semibold text-primary">
															Stack Trace:
														</p>
														{issue.details.map((detail) => (
															<p key={detail} className="text-muted-foreground">
																<span className="text-primary">{">"}</span>{" "}
																{detail}
															</p>
														))}
													</div>

													{/* Graph placeholder */}
													<div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
														<p className="text-sm text-muted-foreground">
															Trend visualization: {issue.trend}
														</p>
													</div>

													{/* Action Button */}
													<Button className="w-full">
														{issue.severity === "critical"
															? "Apply Fix"
															: issue.severity === "warning"
																? "Generate New Program"
																: "Schedule Deload"}
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>

								{/* What's Working Well */}
								<Card className="mb-8 border-primary/50">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary" />
											What&apos;s Working Well
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-3 md:grid-cols-2">
											{workingWell.map((item) => (
												<div
													key={item.id}
													className="flex items-start gap-3 rounded-lg border border-primary/20 p-3"
												>
													<CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
													<p className="text-sm">{item.text}</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Debugging Tools */}
								<Card className="mb-8 border-primary/20">
									<CardHeader>
										<CardTitle>Debugging Tools</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-3 md:grid-cols-2">
											<Button variant="outline" className="h-auto py-4">
												<div className="flex flex-col items-start text-left">
													<div className="flex items-center gap-2 font-semibold">
														<Activity className="h-4 w-4" />
														Exercise-Specific Analysis
													</div>
													<span className="text-xs text-muted-foreground">
														Deep dive into individual exercises
													</span>
												</div>
											</Button>

											<Button variant="outline" className="h-auto py-4">
												<div className="flex flex-col items-start text-left">
													<div className="flex items-center gap-2 font-semibold">
														<TrendingDown className="h-4 w-4" />
														Compare to Similar Athletes
													</div>
													<span className="text-xs text-muted-foreground">
														Benchmark against peer data
													</span>
												</div>
											</Button>

											<Button variant="outline" className="h-auto py-4">
												<div className="flex flex-col items-start text-left">
													<div className="flex items-center gap-2 font-semibold">
														<PlayCircle className="h-4 w-4" />
														Simulate Program Changes
													</div>
													<span className="text-xs text-muted-foreground">
														What-if analysis tool
													</span>
												</div>
											</Button>

											<Button variant="outline" className="h-auto py-4">
												<div className="flex flex-col items-start text-left">
													<div className="flex items-center gap-2 font-semibold">
														<Calendar className="h-4 w-4" />
														Export Report as PDF
													</div>
													<span className="text-xs text-muted-foreground">
														Save full analysis report
													</span>
												</div>
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Historical Debug Logs */}
								<Card className="border-primary/20">
									<CardHeader>
										<CardTitle>Previous Analyses</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{previousAnalyses.map((analysis) => (
												<div
													key={analysis.id}
													className="flex items-center justify-between rounded-lg border border-border p-4 card-hover"
												>
													<div>
														<p className="font-semibold">{analysis.date}</p>
														<p className="text-sm text-muted-foreground">
															{analysis.issuesFound} issues found,{" "}
															{analysis.issuesResolved} resolved
														</p>
													</div>
													<Button variant="ghost" size="sm">
														View
													</Button>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</>
						)}
			</div>
		</AppLayout>
	);
}
