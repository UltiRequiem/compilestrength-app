import type { ZodError, ZodSchema } from "zod";

export class ValidationError extends Error {
	constructor(public errors: ZodError["issues"]) {
		super("Validation failed");
		this.name = "ValidationError";
	}
}

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data);

	if (!result.success) {
		throw new ValidationError(result.error.issues);
	}

	return result.data;
}

export function createValidationErrorResponse(error: ValidationError) {
	return new Response(
		JSON.stringify({
			success: false,
			error: "Validation failed",
			details: error.errors.map((err) => ({
				field: err.path.join("."),
				message: err.message,
				code: err.code,
			})),
		}),
		{
			status: 400,
			headers: { "Content-Type": "application/json" },
		},
	);
}

export function createErrorResponse(message: string, status = 500) {
	return new Response(
		JSON.stringify({
			success: false,
			error: message,
		}),
		{
			status,
			headers: { "Content-Type": "application/json" },
		},
	);
}

export function createSuccessResponse(data?: unknown, message?: string) {
	const response: Record<string, unknown> = {
		success: true,
	};

	if (message) {
		response.message = message;
	}

	if (data) {
		response.data = data;
	}

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
