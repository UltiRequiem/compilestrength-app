import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-middleware";
import { getActiveWorkoutProgramsByUserId } from "@/lib/queries";

export async function GET() {
	try {
		const userId = await getAuthenticatedUserId();
		const programsWithDetails = await getActiveWorkoutProgramsByUserId(userId);

		return NextResponse.json(programsWithDetails);
	} catch (error) {
		console.error("Error fetching workout programs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch workout programs" },
			{ status: 500 },
		);
	}
}
