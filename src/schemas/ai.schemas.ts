import { z } from "zod";

// Message part schemas - discriminated union for strongly typed parts
export const textPartSchema = z.object({
	type: z.literal("text"),
	text: z.string(),
});

export const reasoningPartSchema = z.object({
	type: z.literal("reasoning"),
	reasoning: z.string(),
});

export const filePartSchema = z.object({
	type: z.literal("file"),
	filename: z.string(),
	content: z.string(),
	mimeType: z.string().optional(),
});

export const toolInvocationPartSchema = z.object({
	type: z.literal("tool-invocation"),
	toolCallId: z.string(),
	state: z.enum(["input-streaming", "input-available", "output-available", "output-error"]),
	input: z.record(z.string(), z.unknown()),
	output: z.unknown().optional(),
});

export const customDataPartSchema = z.object({
	type: z.literal("custom-data"),
	data: z.record(z.string(), z.unknown()),
});

// Discriminated union of all part types
export const messagePartSchema = z.discriminatedUnion("type", [
	textPartSchema,
	reasoningPartSchema,
	filePartSchema,
	toolInvocationPartSchema,
	customDataPartSchema,
]);

// AI Chat schemas - matches AI SDK UIMessage structure
export const aiChatMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant", "system", "tool"]),
	content: z.string(),
	parts: z.array(messagePartSchema).optional(),
	createdAt: z.date().optional(),
});

export const aiChatRequestSchema = z.object({
	messages: z.array(aiChatMessageSchema),
	agentType: z.string().default("bodybuilding"),
});

// Compiler schemas
export const compilerChatRequestSchema = z.object({
	messages: z.array(aiChatMessageSchema),
	agentType: z.string().optional().default("bodybuilding"),
});

// Inferred types for message parts
export type TextPart = z.infer<typeof textPartSchema>;
export type ReasoningPart = z.infer<typeof reasoningPartSchema>;
export type FilePart = z.infer<typeof filePartSchema>;
export type ToolInvocationPart = z.infer<typeof toolInvocationPartSchema>;
export type CustomDataPart = z.infer<typeof customDataPartSchema>;
export type MessagePart = z.infer<typeof messagePartSchema>;

// Inferred types for messages and requests
export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type CompilerChatRequest = z.infer<typeof compilerChatRequestSchema>;
