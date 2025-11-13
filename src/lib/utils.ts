import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get initials from a name string
 * @param name - Full name string
 * @returns Uppercase initials (max 2 characters)
 * @example getInitials("John Doe") // "JD"
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export const DAY_TYPES = [
	"push",
	"pull",
	"legs",
	"upper",
	"lower",
	"full",
] as const;

export type DayType = (typeof DAY_TYPES)[number] | "other";

export function inferDayType(dayName: string): DayType {
	const name = dayName.toLowerCase();

	for (const type of DAY_TYPES) {
		if (name.includes(type)) {
			return type;
		}
	}

	return "other";
}
