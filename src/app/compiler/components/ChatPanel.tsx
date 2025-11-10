"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type UserProfile,
	useWorkoutRoutineActions,
	type WorkoutRoutine,
} from "@/stores/workout-routine-store";

export function ChatPanel() {
	const { messages, sendMessage, status, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/compiler/chat",
		}),
		onFinish: (result) => {
			// Handle any post-message processing
			console.log("Message finished:", result);
		},
		onError: (error) => {
			console.error("Chat error:", error);
		},
	});

	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const processedRoutinesRef = useRef<Set<string>>(new Set());
	const prevMessagesLengthRef = useRef(0);
	const { setIsGenerating, setRoutine, setUserProfile, setGenerationProgress } =
		useWorkoutRoutineActions();

	// Function to save routine to database - wrapped in useCallback to prevent recreating on every render
	const saveRoutineToDatabase = useCallback(async (routine: WorkoutRoutine) => {
		try {
			console.log("💾 Saving routine to database:", routine.name);

			const response = await fetch("/api/compiler/save-routine", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ routine }),
			});

			if (response.ok) {
				const result = (await response.json()) as {
					success: boolean;
					programId: string;
					message: string;
				};
				console.log(
					"✅ Routine saved to database successfully:",
					result.programId,
				);
			} else {
				console.error(
					"❌ Failed to save routine to database:",
					response.statusText,
				);
			}
		} catch (error) {
			console.error("❌ Error saving routine to database:", error);
		}
	}, []);

	// Handle tool result data from API - wrapped in useCallback to prevent infinite loops
	const handleToolResult = useCallback(
		(data: { toolName: string; result: unknown }) => {
			console.log("=== HANDLING TOOL RESULT ===");
			console.log("Tool name:", data.toolName);
			console.log("Tool result:", data.result);
			console.log("Full data object:", JSON.stringify(data, null, 2));

			switch (data.toolName) {
				case "updateUserProfile":
					if (
						data.result &&
						typeof data.result === "object" &&
						"profile" in data.result
					) {
						console.log(
							"📝 Updating user profile in store:",
							data.result.profile,
						);
						setUserProfile(data.result.profile as UserProfile);
						console.log("✅ User profile updated in store");
					} else {
						console.log("❌ No profile data found in result");
					}
					break;

				case "createWorkoutRoutine":
					if (
						data.result &&
						typeof data.result === "object" &&
						"routine" in data.result
					) {
						const routine = data.result.routine as WorkoutRoutine;
						console.log("🏋️ Creating workout routine in store:", routine);
						console.log("🏋️ Routine has", routine.days?.length || 0, "days");
						setRoutine(routine);
						console.log("✅ Workout routine updated in store");

						// Only save to database if we haven't already saved this routine
						// Use both ID and name for more robust duplicate detection
						const routineKey = `${routine.id}-${routine.name}`;
						if (!processedRoutinesRef.current.has(routineKey)) {
							console.log("💾 New routine detected, saving to database");
							processedRoutinesRef.current.add(routineKey);
							void saveRoutineToDatabase(routine);
						} else {
							console.log(
								"🔄 Routine already processed, skipping database save",
							);
						}
					} else {
						console.log("❌ No routine data found in result");
						console.log(
							"Available keys in result:",
							Object.keys((data.result as object) || {}),
						);
					}
					break;

				case "setGenerationProgress":
					if (
						data.result &&
						typeof data.result === "object" &&
						"steps" in data.result
					) {
						console.log(
							"📊 Updating generation progress in store:",
							data.result.steps,
						);
						setGenerationProgress(
							data.result.steps as Array<{
								step: string;
								description: string;
								completed: boolean;
							}>,
						);
						console.log("✅ Generation progress updated in store");
					} else {
						console.log("❌ No steps data found in result");
					}
					break;

				default:
					console.log("❓ Unknown tool result:", data.toolName, data.result);
					console.log(
						"Available keys in result:",
						Object.keys((data.result as object) || {}),
					);
			}
		},
		[setUserProfile, setRoutine, setGenerationProgress, saveRoutineToDatabase],
	);

	// Update generating state based on chat status
	useEffect(() => {
		setIsGenerating(status === "streaming" || status === "submitted");
	}, [status, setIsGenerating]);

	// Process tool results from messages when they update
	useEffect(() => {
		console.log("💭 Messages changed, checking for tool results");

		// Only auto-scroll when a new message is added (not during streaming updates)
		// This prevents uncomfortable scrolling while the user is reading
		if (messages.length > prevMessagesLengthRef.current) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			prevMessagesLengthRef.current = messages.length;
		}

		// Get the latest message
		const latestMessage = messages[messages.length - 1];
		if (latestMessage && latestMessage.role === "assistant") {
			console.log("🔍 Processing latest assistant message:", latestMessage);

			// Check each part of the message for tool results
			latestMessage.parts.forEach((part) => {
				if (
					part.type?.startsWith("tool-") &&
					(part as unknown as { output?: unknown }).output
				) {
					const toolName = part.type.replace("tool-", "");
					const output = (part as unknown as { output: unknown }).output;

					console.log("🛠️ Found tool result in message:", toolName, output);

					handleToolResult({
						toolName,
						result: output,
					});
				}
			});
		}
	}, [messages, handleToolResult]);

	// Auto-resize textarea
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
		}
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || status !== "ready") return;

		sendMessage({ text: input.trim() });
		setInput("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleStop = () => {
		stop();
		setIsGenerating(false);
	};

	return (
		<div className="flex flex-col h-full min-h-0">
			{/* Header */}
			<div className="border-b border-green-800/30 p-4 shrink-0">
				<h2 className="text-lg font-mono text-green-400">
					&gt; CompileStrength AI Assistant
				</h2>
				<p className="text-sm text-green-600 mt-1">
					Your bodybuilding workout programming expert
				</p>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-terminal">
				{messages.length === 0 && (
					<div className="text-green-600 font-mono text-sm space-y-2">
						<p>&gt; Hello! I&apos;m your bodybuilding programming assistant.</p>
						<p>&gt; Let&apos;s create your perfect workout routine together.</p>
						<p>
							&gt; Tell me about your experience, goals, and available equipment
							to get started.
						</p>
					</div>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`font-mono text-sm ${
							message.role === "user" ? "text-cyan-400" : "text-green-400"
						}`}
					>
						<div className="mb-1">
							{message.role === "user" ? "&gt; USER:" : "&gt; ASSISTANT:"}
						</div>
						<div className="ml-4 whitespace-pre-wrap">
							{message.parts.map((part, index) => {
								if (part.type === "text") {
									return <span key={index}>{part.text}</span>;
								}
								if (part.type === "tool-call") {
									return (
										<div key={index} className="text-yellow-500 text-xs mt-2">
											&gt; Calling tool:{" "}
											{(part as { toolName?: string }).toolName || "unknown"}
										</div>
									);
								}
								if (part.type === "tool-result") {
									return (
										<div key={index} className="text-green-600 text-xs">
											&gt; ✓ Tool executed
										</div>
									);
								}
								return null;
							})}
						</div>
					</div>
				))}

				{/* Loading indicator */}
				{(status === "submitted" || status === "streaming") && (
					<div className="text-green-600 font-mono text-sm flex items-center gap-2">
						<Loader2 className="w-4 h-4 animate-spin" />
						<span>
							&gt; {status === "submitted" ? "Thinking..." : "Generating..."}
						</span>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="border-t border-green-800/30 p-4 shrink-0">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<div className="flex-1 relative">
						<textarea
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Describe your fitness goals, experience level, or ask questions..."
							className="w-full bg-black border border-green-800/30 text-green-400 placeholder-green-700 px-3 py-2 resize-none font-mono text-sm focus:outline-none focus:border-green-600 min-h-[44px] max-h-32"
							disabled={status !== "ready"}
							rows={1}
						/>
					</div>

					{status === "streaming" || status === "submitted" ? (
						<button
							type="button"
							onClick={handleStop}
							className="px-4 py-2 bg-red-900/20 border border-red-600 text-red-400 hover:bg-red-900/30 transition-colors flex items-center gap-2"
						>
							<Square className="w-4 h-4" />
							Stop
						</button>
					) : (
						<button
							type="submit"
							disabled={!input.trim() || status !== "ready"}
							className="px-4 py-2 bg-green-900/20 border border-green-600 text-green-400 hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
						>
							<Send className="w-4 h-4" />
							Send
						</button>
					)}
				</form>

				<div className="text-xs text-green-700 mt-2 font-mono">
					Press Enter to send • Shift+Enter for new line
				</div>
			</div>
		</div>
	);
}
