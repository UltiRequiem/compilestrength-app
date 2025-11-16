import { useEffect, useState } from "react";

export function useWorkoutTimer() {
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isRunning, setIsRunning] = useState(true);
	const [restTimer, setRestTimer] = useState<number | null>(null);
	const [isResting, setIsResting] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isRunning) {
			interval = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning]);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isResting && restTimer !== null && restTimer > 0) {
			interval = setInterval(() => {
				setRestTimer((prev) => (prev ? prev - 1 : 0));
			}, 1000);
		} else if (restTimer === 0) {
			setIsResting(false);
			setRestTimer(null);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isResting, restTimer]);

	const startTimer = () => setIsRunning(true);
	const pauseTimer = () => setIsRunning(false);
	const toggleTimer = () => setIsRunning(!isRunning);

	const startRest = (seconds: number) => {
		setRestTimer(seconds);
		setIsResting(true);
	};

	const stopRest = () => {
		setIsResting(false);
		setRestTimer(null);
	};

	const setInitialElapsedTime = (seconds: number) => {
		setElapsedTime(seconds);
	};

	return {
		elapsedTime,
		isRunning,
		restTimer,
		isResting,
		startTimer,
		pauseTimer,
		toggleTimer,
		startRest,
		stopRest,
		setInitialElapsedTime,
	};
}
