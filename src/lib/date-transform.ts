/**
 * Type-safe date transformation utilities for schema validation
 */

/**
 * Object with createdAt and updatedAt that can be string or Date
 */
export interface WithTimestamps {
	createdAt: string | Date;
	updatedAt: string | Date;
}

/**
 * Object with createdAt and updatedAt as Date objects
 */
export interface WithDateTimestamps {
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Transforms createdAt and updatedAt from string to Date objects
 * @param obj - Object with createdAt and updatedAt fields
 * @returns Object with Date objects for timestamp fields
 */
export function transformTimestamps<T extends WithTimestamps>(
	obj: T,
): Omit<T, "createdAt" | "updatedAt"> & WithDateTimestamps {
	return {
		...obj,
		createdAt:
			typeof obj.createdAt === "string"
				? new Date(obj.createdAt)
				: obj.createdAt,
		updatedAt:
			typeof obj.updatedAt === "string"
				? new Date(obj.updatedAt)
				: obj.updatedAt,
	};
}

/**
 * Object with optional createdAt and updatedAt that can be string or Date
 */
export interface WithOptionalTimestamps {
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

/**
 * Object with optional createdAt and updatedAt as Date objects
 */
export interface WithOptionalDateTimestamps {
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Transforms optional createdAt and updatedAt from string to Date objects
 * @param obj - Object with optional createdAt and updatedAt fields
 * @returns Object with Date objects for timestamp fields
 */
export function transformOptionalTimestamps<T extends WithOptionalTimestamps>(
	obj: T,
): Omit<T, "createdAt" | "updatedAt"> & WithOptionalDateTimestamps {
	return {
		...obj,
		createdAt: obj.createdAt
			? typeof obj.createdAt === "string"
				? new Date(obj.createdAt)
				: obj.createdAt
			: undefined,
		updatedAt: obj.updatedAt
			? typeof obj.updatedAt === "string"
				? new Date(obj.updatedAt)
				: obj.updatedAt
			: undefined,
	};
}

/**
 * Single date field transformation
 * @param value - Date string or Date object
 * @returns Date object
 */
export function stringToDate(value: string | Date): Date {
	return typeof value === "string" ? new Date(value) : value;
}

/**
 * Optional single date field transformation
 * @param value - Optional date string or Date object
 * @returns Date object or undefined
 */
export function optionalStringToDate(value?: string | Date): Date | undefined {
	if (!value) return undefined;
	return typeof value === "string" ? new Date(value) : value;
}
