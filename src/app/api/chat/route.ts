import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

		const result = streamText({
			model: openai("gpt-4o"),
			system: "You are a helpful assistant.",
			messages: convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
