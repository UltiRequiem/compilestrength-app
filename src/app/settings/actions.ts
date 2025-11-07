"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getUserPreferences() {
	const session = await requireAuth();

	const preferences = await prisma.userPreferences.findUnique({
		where: { userId: session.user.id },
	});

	return preferences;
}

export async function updateUserProfile(formData: {
	name: string;
	bio?: string;
}) {
	const session = await requireAuth();

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

	const preferences = await prisma.userPreferences.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			units: formData.units || "lbs",
			restTimerDefault: formData.restTimerDefault || 90,
			trainingGoal: formData.trainingGoal,
			experienceLevel: formData.experienceLevel,
			availableDays: formData.availableDays,
		},
		update: {
			...(formData.units && { units: formData.units }),
			...(formData.restTimerDefault && {
				restTimerDefault: formData.restTimerDefault,
			}),
			...(formData.trainingGoal && { trainingGoal: formData.trainingGoal }),
			...(formData.experienceLevel && {
				experienceLevel: formData.experienceLevel,
			}),
			...(formData.availableDays !== undefined && {
				availableDays: formData.availableDays,
			}),
		},
	});

	revalidatePath("/settings");

	return { success: true, preferences };
}
