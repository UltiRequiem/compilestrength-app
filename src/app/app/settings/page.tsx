"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import DataPrivacySection from "./components/DataPrivacySection";
import { SettingsHeader } from "./components/Hader";
import ProfileSection from "./components/ProfileSection";
import SubscriptionSection from "./components/SubscriptionSection";
import TrainingPreferences from "./components/TrainingPreferences";

export default function SettingsPage() {
	const { session, isPending } = useRequireAuth();
	const [saving, setSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState("");

	const units = useUnits();
	const restTimerDefault = useRestTimerDefault();
	const trainingGoal = useTrainingGoal();
	const experienceLevel = useExperienceLevel();

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
			<SettingsHeader />
			<div className="space-y-6">
				<ProfileSection userName={session.user.name} userEmail={session.user.email} />

				<TrainingPreferences
					units={units}
					restTimerDefault={restTimerDefault}
					trainingGoal={trainingGoal}
					experienceLevel={experienceLevel}
					onUnitsChange={setUnits}
					onRestTimerChange={setRestTimerDefault}
					onTrainingGoalChange={setTrainingGoal}
					onExperienceLevelChange={setExperienceLevel}
					onSave={handleSavePreferences}
					saving={saving}
					saveMessage={saveMessage}
				/>

				<SubscriptionSection />

				<DataPrivacySection />
			</div>
		</div>
	);
}
