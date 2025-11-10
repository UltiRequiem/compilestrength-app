import { openai } from "@ai-sdk/openai";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";
import {
	BODYBUILDING_SYSTEM_PROMPT,
	bodybuildingTools,
} from "@/agents/bodybuilding-agent";

export const maxDuration = 60; // 60 seconds for workout generation

export async function POST(req: Request) {
	try {
		const {
			messages,
			agentType = "bodybuilding",
		}: {
			messages: UIMessage[];
			agentType?: string;
		} = await req.json();

		// For now, only support bodybuilding agent
		if (agentType !== "bodybuilding") {
			return new Response("Agent not available yet", { status: 400 });
		}

		const result = streamText({
			model: openai("gpt-4o"),
			system: BODYBUILDING_SYSTEM_PROMPT,
			messages: convertToModelMessages(messages),
			tools: bodybuildingTools,
			stopWhen: stepCountIs(10), // Allow multiple tool calls
			onStepFinish: ({ text, toolCalls, toolResults }) => {
				console.log("Step finished:", {
					text: text ? `${text.substring(0, 100)}...` : "No text",
					toolCallsCount: toolCalls.length,
					toolResultsCount: toolResults.length,
				});

				// Log detailed tool result information
				toolResults.forEach((toolResult, index) => {
					console.log(`Tool result ${index}:`, {
						toolName: toolResult.toolName,
						output: toolResult.output,
						fullObject: toolResult,
					});
				});
			},
			temperature: 0.7,
		});

		return result.toUIMessageStreamResponse({
			onError: (error) => {
				console.error("Compiler chat error:", error);
				return "I encountered an issue while generating your workout. Please try again or provide more specific information about your goals.";
			},
		});
	} catch (error) {
		console.error("Compiler API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
