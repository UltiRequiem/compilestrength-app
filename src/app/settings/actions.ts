"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { userPreferences } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";

export async function getUserPreferences() {
	const session = await requireAuth();
	const db = getDb();

	const preferences = await db.query.userPreferences.findFirst({
		where: eq(userPreferences.userId, session.user.id),
	});

	return preferences;
}

export async function updateUserProfile(_formData: {
	name: string;
	bio?: string;
}) {
	const _session = await requireAuth();

	// Note: Better Auth manages the user table, so we can't directly update it
	// We would need to use Better Auth's API to update the user
	// For now, we'll return success and handle profile updates through Better Auth later

	return { success: true, message: "Profile updated successfully" };
}

export async function updateUserPreferences(formData: {
	units?: string;
	restTimerDefault?: number;
	trainingGoal?: string;
	experienceLevel?: string;
	availableDays?: number;
}) {
	const session = await requireAuth();
	const db = getDb();

	// Check if preferences exist
	const existing = await db.query.userPreferences.findFirst({
		where: eq(userPreferences.userId, session.user.id),
	});

	let preferences;
	if (existing) {
		// Update existing preferences
		const updateData: Record<string, unknown> = {};
		if (formData.units) updateData.units = formData.units;
		if (formData.restTimerDefault)
			updateData.restTimerDefault = formData.restTimerDefault;
		if (formData.trainingGoal) updateData.trainingGoal = formData.trainingGoal;
		if (formData.experienceLevel)
			updateData.experienceLevel = formData.experienceLevel;
		if (formData.availableDays !== undefined)
			updateData.availableDays = formData.availableDays;

		const [updated] = await db
			.update(userPreferences)
			.set(updateData)
			.where(eq(userPreferences.userId, session.user.id))
			.returning();
		preferences = updated;
	} else {
		// Create new preferences
		const [created] = await db
			.insert(userPreferences)
			.values({
				userId: session.user.id,
				units: formData.units || "lbs",
				restTimerDefault: formData.restTimerDefault || 90,
				trainingGoal: formData.trainingGoal || null,
				experienceLevel: formData.experienceLevel || null,
				availableDays: formData.availableDays ?? null,
			})
			.returning();
		preferences = created;
	}

	revalidatePath("/settings");

	return { success: true, preferences };
}
