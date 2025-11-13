import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { saveWorkoutRoutineToDb } from "@/lib/workout-db";
import type { WorkoutRoutine } from "@/stores/workout-routine-store";

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { routine }: { routine: WorkoutRoutine } = await req.json();

		if (!routine) {
			return new Response("Workout routine is required", { status: 400 });
		}

		const savedProgram = await saveWorkoutRoutineToDb(routine, session.user.id);

		return Response.json({
			success: true,
			message: "Workout routine saved successfully",
			programId: savedProgram.id,
		});
	} catch (error) {
		console.error("Save routine API error:", error);
		return new Response("Failed to save workout routine", { status: 500 });
	}
}
