"use client";

import { AgentSelector } from "./AgentSelector";
import { ChatPanel } from "./ChatPanel";
import { RoutinePreview } from "./RoutinePreview";

export function CompilerLayout() {
	return (
		<div className="h-screen flex flex-col bg-black text-green-400">
			{/* Agent Selector at the top */}
			<div className="border-b border-green-800/30 p-4">
				<AgentSelector />
			</div>

			{/* Split screen layout */}
			<div className="flex-1 flex overflow-hidden">
				{/* Chat Panel - Left Side */}
				<div className="w-1/2 border-r border-green-800/30 flex flex-col">
					<ChatPanel />
				</div>

				{/* Routine Preview - Right Side */}
				<div className="w-1/2 flex flex-col">
					<RoutinePreview />
				</div>
			</div>
		</div>
	);
}
