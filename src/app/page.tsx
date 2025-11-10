import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardPage() {
	const session = await requireAuth();
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const weekDays = [
		{ day: "Mon", workout: "Push Day A", status: "completed" },
		{ day: "Tue", workout: "Pull Day A", status: "completed" },
		{ day: "Wed", workout: "Rest", status: "completed" },
		{ day: "Thu", workout: "Legs Day A", status: "today" },
		{ day: "Fri", workout: "Upper Power", status: "upcoming" },
		{ day: "Sat", workout: "Lower Power", status: "upcoming" },
		{ day: "Sun", workout: "Rest", status: "upcoming" },
	];

	const recentActivity = [
		{
			exercise: "Bench Press",
			sets: 4,
			reps: 8,
			weight: 225,
			date: "2 hours ago",
		},
		{
			exercise: "Barbell Row",
			sets: 4,
			reps: 10,
			weight: 185,
			date: "2 hours ago",
		},
		{
			exercise: "Overhead Press",
			sets: 3,
			reps: 8,
			weight: 135,
			date: "2 hours ago",
		},
		{ exercise: "Squat", sets: 5, reps: 5, weight: 315, date: "Yesterday" },
		{
			exercise: "Deadlift",
			sets: 3,
			reps: 5,
			weight: 405,
			date: "2 days ago",
		},
	];

	return (
		<DashboardClient
			userName={session.user.name}
			today={today}
			weekDays={weekDays}
			recentActivity={recentActivity}
		/>
	);
}
