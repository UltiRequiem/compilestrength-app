"use client";

import {
	CheckCircle,
	CreditCard,
	Download,
	Link as LinkIcon,
	Loader2,
	Palette,
	Shield,
	Trash2,
	User,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequireAuth } from "@/lib/auth-client";
import {
	useExperienceLevel,
	useRestTimerDefault,
	useSetExperienceLevel,
	useSetPreferences,
	useSetRestTimerDefault,
	useSetTrainingGoal,
	useSetUnits,
	useTrainingGoal,
	useUnits,
} from "@/providers/user-preferences-store-provider";
import { updateUserPreferences } from "./actions";

export default function SettingsPage() {
	const { session, isPending } = useRequireAuth();
	const [saving, setSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState("");

	// Use global state from Zustand
	const units = useUnits();
	const restTimerDefault = useRestTimerDefault();
	const trainingGoal = useTrainingGoal();
	const experienceLevel = useExperienceLevel();

	// Use individual action hooks to avoid infinite loop
	const setUnits = useSetUnits();
	const setRestTimerDefault = useSetRestTimerDefault();
	const setTrainingGoal = useSetTrainingGoal();
	const setExperienceLevel = useSetExperienceLevel();
	const setPreferences = useSetPreferences();

	const handleSavePreferences = async () => {
		setSaving(true);
		setSaveMessage("");
		try {
			const result = await updateUserPreferences({
				units,
				restTimerDefault,
				trainingGoal,
				experienceLevel,
			});

			// Update global state with saved preferences
			setPreferences({
				units: result.preferences.units as "lbs" | "kg",
				restTimerDefault: result.preferences.restTimerDefault,
				trainingGoal: result.preferences.trainingGoal,
				experienceLevel: result.preferences.experienceLevel,
				availableDays: result.preferences.availableDays,
			});

			setSaveMessage("Preferences saved successfully!");
			setTimeout(() => setSaveMessage(""), 3000);
		} catch {
			setSaveMessage("Failed to save preferences");
		} finally {
			setSaving(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

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

	return (
		<div className="mx-auto max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and preferences
				</p>
			</div>

			<div className="space-y-6">
				{/* Profile Section */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Profile
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
								{getInitials(session.user.name)}
							</div>
							<Button variant="outline" size="sm">
								Change Avatar
							</Button>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label>Full Name</Label>
								<Input defaultValue={session.user.name} />
							</div>
							<div className="space-y-2">
								<Label>Username</Label>
								<Input
									defaultValue={session.user.email.split("@")[0]}
									placeholder="username"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Email</Label>
							<div className="flex gap-2">
								<Input value={session.user.email} readOnly />
								<Badge variant="secondary" className="flex items-center gap-1">
									<CheckCircle className="h-3 w-3" />
									Verified
								</Badge>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Bio</Label>
							<textarea
								className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								placeholder="Tell us about yourself..."
								defaultValue=""
							/>
						</div>

						<Button>Save Changes</Button>
					</CardContent>
				</Card>

				{/* Training Preferences */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							Training Preferences
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label>Preferred Units</Label>
								<div className="flex gap-2">
									<Button
										variant={units === "lbs" ? "default" : "outline"}
										size="sm"
										className="flex-1"
										onClick={() => setUnits("lbs")}
									>
										lbs
									</Button>
									<Button
										variant={units === "kg" ? "default" : "outline"}
										size="sm"
										className="flex-1"
										onClick={() => setUnits("kg")}
									>
										kg
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Rest Timer Default (seconds)</Label>
								<Input
									type="number"
									value={restTimerDefault}
									onChange={(e) => setRestTimerDefault(Number(e.target.value))}
									placeholder="90"
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label>Training Goal</Label>
								<Input
									value={trainingGoal || ""}
									onChange={(e) => setTrainingGoal(e.target.value || null)}
									placeholder="strength, hypertrophy, endurance"
								/>
							</div>

							<div className="space-y-2">
								<Label>Experience Level</Label>
								<Input
									value={experienceLevel || ""}
									onChange={(e) => setExperienceLevel(e.target.value || null)}
									placeholder="beginner, intermediate, advanced"
								/>
							</div>
						</div>

						{saveMessage && (
							<div
								className={`rounded-lg border p-3 text-sm ${
									saveMessage.includes("success")
										? "border-primary/50 bg-primary/10 text-primary"
										: "border-destructive/50 bg-destructive/10 text-destructive"
								}`}
							>
								{saveMessage}
							</div>
						)}

						<Button onClick={handleSavePreferences} disabled={saving}>
							{saving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Preferences"
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Subscription - Link to Billing Page */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CreditCard className="h-5 w-5" />
							Subscription & Billing
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Manage your subscription, view billing history, and update payment
							methods.
						</p>
						<Button asChild>
							<a href="/app/billing">Go to Billing</a>
						</Button>
					</CardContent>
				</Card>

				{/* Data & Privacy */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Data & Privacy
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between rounded-lg border border-border p-4">
							<div>
								<p className="font-semibold">Download Your Data</p>
								<p className="text-sm text-muted-foreground">
									Export all your workout data
								</p>
							</div>
							<Button variant="outline" size="sm">
								<Download className="h-4 w-4" />
								Download
							</Button>
						</div>

						<div className="flex items-center justify-between rounded-lg border border-border p-4">
							<div>
								<p className="font-semibold">Privacy Settings</p>
								<p className="text-sm text-muted-foreground">
									Control who can see your profile
								</p>
							</div>
							<Button variant="outline" size="sm">
								Manage
							</Button>
						</div>

						<div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
							<div className="mb-3 flex items-start gap-3">
								<Trash2 className="h-5 w-5 text-destructive" />
								<div>
									<p className="font-semibold text-destructive">
										Delete Account
									</p>
									<p className="text-sm text-muted-foreground">
										Permanently delete your account and all data. This action
										cannot be undone.
									</p>
								</div>
							</div>
							<Button variant="destructive" size="sm">
								Delete Account
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Appearance */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							Appearance
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Theme</Label>
							<div className="grid grid-cols-3 gap-3">
								<Button variant="default" size="sm">
									Dark
								</Button>
								<Button variant="outline" size="sm">
									Darker
								</Button>
								<Button variant="outline" size="sm">
									Terminal
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Accent Color</Label>
							<div className="flex gap-2">
								<div className="h-10 w-10 rounded-full bg-primary border-2 border-primary cursor-pointer" />
								<div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-transparent hover:border-border cursor-pointer" />
								<div className="h-10 w-10 rounded-full bg-purple-500 border-2 border-transparent hover:border-border cursor-pointer" />
								<div className="h-10 w-10 rounded-full bg-orange-500 border-2 border-transparent hover:border-border cursor-pointer" />
							</div>
						</div>

						<div className="space-y-2">
							<Label>Font Size</Label>
							<div className="flex items-center gap-4">
								<input
									type="range"
									min="12"
									max="18"
									defaultValue="14"
									className="flex-1"
								/>
								<span className="text-sm text-muted-foreground w-12">14px</span>
							</div>
						</div>

						<Button>Apply Changes</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
