import { Dumbbell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrainingPreferencesProps {
	units: "lbs" | "kg";
	restTimerDefault: number;
	trainingGoal: string | null;
	experienceLevel: string | null;
	onUnitsChange: (units: "lbs" | "kg") => void;
	onRestTimerChange: (seconds: number) => void;
	onTrainingGoalChange: (goal: string | null) => void;
	onExperienceLevelChange: (level: string | null) => void;
	onSave: () => void;
	saving: boolean;
	saveMessage: string;
}

export default function TrainingPreferences({
	units,
	restTimerDefault,
	trainingGoal,
	experienceLevel,
	onUnitsChange,
	onRestTimerChange,
	onTrainingGoalChange,
	onExperienceLevelChange,
	onSave,
	saving,
	saveMessage,
}: TrainingPreferencesProps) {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Dumbbell className="h-5 w-5" />
					Training Preferences
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Weight Units</Label>
						<div className="flex gap-2">
							<Button
								type="button"
								variant={units === "lbs" ? "default" : "outline"}
								size="sm"
								onClick={() => onUnitsChange("lbs")}
							>
								lbs
							</Button>
							<Button
								type="button"
								variant={units === "kg" ? "default" : "outline"}
								size="sm"
								onClick={() => onUnitsChange("kg")}
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
							onChange={(e) => onRestTimerChange(Number(e.target.value))}
							placeholder="90"
						/>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Training Goal</Label>
						<Input
							value={trainingGoal || ""}
							onChange={(e) => onTrainingGoalChange(e.target.value || null)}
							placeholder="strength, hypertrophy, endurance"
						/>
					</div>

					<div className="space-y-2">
						<Label>Experience Level</Label>
						<Input
							value={experienceLevel || ""}
							onChange={(e) => onExperienceLevelChange(e.target.value || null)}
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

				<Button onClick={onSave} disabled={saving}>
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
	);
}