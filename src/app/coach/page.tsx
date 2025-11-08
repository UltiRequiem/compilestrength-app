"use client";

import {
	AlertCircle,
	Calendar,
	ChevronRight,
	Loader2,
	Paperclip,
	Send,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/lib/auth-client";

export default function CoachPage() {
	const { session, isPending } = useRequireAuth();
	const [selectedCoach, setSelectedCoach] = useState("powerlifting");
	const [message, setMessage] = useState("");

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

	const coaches = [
		{
			id: "powerlifting",
			name: "Powerlifting Coach",
			specialty: "Strength & Big 3",
			avatar: "💪",
		},
		{
			id: "bodybuilding",
			name: "Bodybuilding Coach",
			specialty: "Hypertrophy Focus",
			avatar: "🏋️",
		},
		{
			id: "strength",
			name: "Strength Coach",
			specialty: "Balanced Approach",
			avatar: "⚡",
		},
		{
			id: "olympic",
			name: "Olympic Coach",
			specialty: "Explosive Power",
			avatar: "🎯",
		},
	];

	const messages = [
		{
			role: "coach",
			content:
				"Hey! I'm your Powerlifting Coach. I see you've been training for 3 years and your current PRs are solid. Based on your goals, I'd recommend a 4-day upper/lower split focusing on strength progression.",
			timestamp: "2:30 PM",
		},
		{
			role: "user",
			content:
				"That sounds good. But I've been plateauing on bench press for the last 6 weeks. Any advice?",
			timestamp: "2:32 PM",
		},
		{
			role: "coach",
			content:
				"Great question! Let me analyze your recent training data... I see you've been stuck at 185 lbs for 4 sessions. Here are some strategies:",
			timestamp: "2:33 PM",
			hasCard: true,
		},
	];

	const quickPrompts = [
		"Modify my program",
		"Why am I plateauing?",
		"Exercise alternatives",
		"Deload advice",
	];

	const contextItems = [
		{ label: "Current Program", value: "4-Day Upper/Lower Split" },
		{ label: "Recent PR", value: "Squat 315 lbs" },
		{ label: "Last Workout", value: "Upper Power (2 hours ago)" },
		{ label: "Injuries", value: "None reported" },
	];

	return (
		<div className="flex min-h-screen">
			<Sidebar />

			<main className="ml-64 flex-1">
				<div className="flex h-screen">
					{/* Left Sidebar - Coach Selection */}
					<div className="w-80 border-r border-border bg-sidebar">
						<div className="flex h-full flex-col">
							{/* Coach Selector */}
							<div className="border-b border-sidebar-border p-4">
								<h2 className="mb-4 text-lg font-semibold">
									Select Your Coach
								</h2>
								<div className="space-y-2">
									{coaches.map((coach) => (
										<Card
											key={coach.id}
											className={`cursor-pointer card-hover ${
												selectedCoach === coach.id
													? "border-primary glow-green"
													: ""
											}`}
											onClick={() => setSelectedCoach(coach.id)}
										>
											<CardContent className="p-3">
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
														{coach.avatar}
													</div>
													<div className="flex-1">
														<p className="font-semibold text-sm">
															{coach.name}
														</p>
														<p className="text-xs text-muted-foreground">
															{coach.specialty}
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>

							{/* Current Program Summary */}
							<div className="border-b border-sidebar-border p-4">
								<h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
								<div className="space-y-2">
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
									>
										<TrendingUp className="h-4 w-4" />
										Generate Program
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
									>
										<Calendar className="h-4 w-4" />
										Analyze Progress
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
									>
										<AlertCircle className="h-4 w-4" />
										Report Issue
									</Button>
								</div>
							</div>

							{/* Context Panel */}
							<div className="flex-1 overflow-auto p-4">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="text-sm font-semibold">Context</h3>
									<Badge variant="secondary" className="text-xs">
										Visible to coach
									</Badge>
								</div>
								<div className="space-y-3">
									{contextItems.map((item) => (
										<div
											key={item.label}
											className="rounded-lg border border-border p-3"
										>
											<p className="text-xs text-muted-foreground">
												{item.label}
											</p>
											<p className="text-sm font-semibold">{item.value}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Main Chat Area */}
					<div className="flex flex-1 flex-col">
						{/* Chat Header */}
						<div className="flex items-center justify-between border-b border-border p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
									💪
								</div>
								<div>
									<h2 className="font-semibold">Powerlifting Coach</h2>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span className="text-xs text-muted-foreground">
											Online
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-auto p-6 space-y-6">
							{messages.map((msg, idx) => (
								<div
									key={idx}
									className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-2xl ${msg.role === "user" ? "order-2" : "order-1"}`}
									>
										<div
											className={`rounded-lg p-4 ${
												msg.role === "user"
													? "bg-primary/10 border border-primary/20"
													: "bg-card border border-primary/50"
											}`}
										>
											<p className="text-sm">{msg.content}</p>
											{msg.hasCard && (
												<Card className="mt-4 border-primary/30">
													<CardContent className="p-4">
														<h4 className="mb-2 font-semibold text-sm">
															Bench Press Plateau Solutions
														</h4>
														<ul className="space-y-2 text-sm text-muted-foreground">
															<li className="flex items-start gap-2">
																<ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
																<span>
																	Try paused reps to build strength at sticking
																	points
																</span>
															</li>
															<li className="flex items-start gap-2">
																<ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
																<span>
																	Increase training frequency to 2x per week
																</span>
															</li>
															<li className="flex items-start gap-2">
																<ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
																<span>
																	Add close-grip bench as an accessory
																</span>
															</li>
															<li className="flex items-start gap-2">
																<ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
																<span>
																	Consider a deload week before pushing harder
																</span>
															</li>
														</ul>
														<Button size="sm" className="mt-4 w-full">
															Apply to My Program
														</Button>
													</CardContent>
												</Card>
											)}
										</div>
										<p className="mt-1 text-xs text-muted-foreground text-right">
											{msg.timestamp}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Quick Prompts */}
						<div className="border-t border-border p-4">
							<div className="mb-3 flex gap-2 overflow-x-auto pb-2">
								{quickPrompts.map((prompt, idx) => (
									<Button
										key={idx}
										variant="outline"
										size="sm"
										className="whitespace-nowrap"
										onClick={() => setMessage(prompt)}
									>
										{prompt}
									</Button>
								))}
							</div>

							{/* Input Area */}
							<div className="flex gap-2">
								<Button variant="outline" size="icon">
									<Paperclip className="h-4 w-4" />
								</Button>
								<Input
									placeholder="Ask your coach anything..."
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											// Handle send
											setMessage("");
										}
									}}
									className="flex-1"
								/>
								<Button size="icon">
									<Send className="h-4 w-4" />
								</Button>
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								Coach has access to your training history and current program
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
