"use client";

import { Dumbbell, MessageSquare } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AgentSelector } from "./AgentSelector";
import { ChatPanel } from "./ChatPanel";
import { RoutinePreview } from "./RoutinePreview";

export function CompilerLayout() {
	const [activeTab, setActiveTab] = useState<"chat" | "routine">("chat");

	return (
		<AppLayout>
			<div className="flex flex-col text-green-400 h-[calc(100vh-7rem)] lg:h-[calc(100vh-10rem)]">
				{/* Agent Selector at the top */}
				<div className="border-b border-green-800/30 p-4 shrink-0">
					<AgentSelector />
				</div>

				{/* Mobile tabs - only visible on small screens */}
				<div className="lg:hidden flex border-b border-green-800/30 shrink-0">
					<button
						type="button"
						onClick={() => setActiveTab("chat")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm transition-colors ${
							activeTab === "chat"
								? "bg-green-900/20 text-green-400 border-b-2 border-green-400"
								: "text-green-600 hover:text-green-400"
						}`}
					>
						<MessageSquare className="w-4 h-4" />
						Chat
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("routine")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm transition-colors ${
							activeTab === "routine"
								? "bg-green-900/20 text-green-400 border-b-2 border-green-400"
								: "text-green-600 hover:text-green-400"
						}`}
					>
						<Dumbbell className="w-4 h-4" />
						Routine
					</button>
				</div>

				<div className="flex-1 lg:hidden overflow-hidden min-h-0">
					{activeTab === "chat" ? <ChatPanel /> : <RoutinePreview />}
				</div>

				<div className="hidden lg:flex flex-1 overflow-hidden min-h-0">
					<div className="w-1/2 border-r border-green-800/30 flex flex-col min-h-0">
						<ChatPanel />
					</div>

					<div className="w-1/2 flex flex-col min-h-0">
						<RoutinePreview />
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
