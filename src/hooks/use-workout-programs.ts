import { useCallback, useState } from "react";
import type { WorkoutProgram } from "@/app/app/log-workout/types";

export function useWorkoutPrograms() {
	const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
	const [selectedDay, setSelectedDay] = useState<string | null>(null);

	const loadPrograms = useCallback(async () => {
		try {
			const response = await fetch("/api/workout-programs");
			if (response.ok) {
				const data = (await response.json()) as WorkoutProgram[];
				setPrograms(data);
				if (data.length > 0) {
					setSelectedProgram(data[0].id);
					if (data[0].days.length > 0) {
						setSelectedDay(data[0].days[0].id);
					}
				}
			}
		} catch (error) {
			console.error("Error loading programs:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const selectProgram = useCallback(
		(programId: string) => {
			setSelectedProgram(programId);
			const program = programs.find((p) => p.id === programId);
			if (program && program.days.length > 0) {
				setSelectedDay(program.days[0].id);
			}
		},
		[programs],
	);

	const selectDay = useCallback((dayId: string) => {
		setSelectedDay(dayId);
	}, []);

	const getCurrentProgram = useCallback(() => {
		return programs.find((p) => p.id === selectedProgram);
	}, [programs, selectedProgram]);

	const getCurrentDay = useCallback(() => {
		const currentProgram = getCurrentProgram();
		return currentProgram?.days.find((d) => d.id === selectedDay);
	}, [getCurrentProgram, selectedDay]);

	return {
		programs,
		loading,
		selectedProgram,
		selectedDay,
		loadPrograms,
		selectProgram,
		selectDay,
		getCurrentProgram,
		getCurrentDay,
	};
}
