"use client";

import { Brain, Dumbbell, Heart, Zap } from "lucide-react";
import { useState } from "react";

type AgentType = "bodybuilding" | "powerlifting" | "endurance" | "general";

interface Agent {
	id: AgentType;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	available: boolean;
}

const agents: Agent[] = [
	{
		id: "bodybuilding",
		name: "Bodybuilding",
		description:
			"Hypertrophy-focused training for muscle growth and aesthetics",
		icon: Dumbbell,
		available: true,
	},
	{
		id: "powerlifting",
		name: "Powerlifting",
		description: "Strength-focused training for maximum 1RM development",
		icon: Zap,
		available: false, // Coming soon
	},
	{
		id: "endurance",
		name: "Endurance",
		description: "Cardiovascular and muscular endurance training",
		icon: Heart,
		available: false, // Coming soon
	},
	{
		id: "general",
		name: "General Fitness",
		description: "Well-rounded fitness for overall health and wellness",
		icon: Brain,
		available: false, // Coming soon
	},
];

export function AgentSelector() {
	const [selectedAgent, setSelectedAgent] = useState<AgentType>("bodybuilding");

	const handleAgentSelect = (agentId: AgentType) => {
		if (agents.find((a) => a.id === agentId)?.available) {
			setSelectedAgent(agentId);
			// TODO: Reset chat when agent changes
			console.log("Switching to agent:", agentId);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<h1 className="text-xl font-mono text-green-400">CompileStrength</h1>
				<span className="text-green-600 text-sm font-mono">/compiler</span>
			</div>

			<div className="flex items-center gap-2 text-sm">
				<span className="text-green-600 font-mono">Agent:</span>
				<div className="flex gap-2">
					{agents.map((agent) => {
						const Icon = agent.icon;
						const isSelected = selectedAgent === agent.id;
						const isAvailable = agent.available;

						return (
							<button
								key={agent.id}
								onClick={() => handleAgentSelect(agent.id)}
								disabled={!isAvailable}
								className={`
                  px-3 py-1.5 border rounded font-mono text-xs flex items-center gap-2 transition-colors
                  ${
										isSelected && isAvailable
											? "bg-green-900/30 border-green-600 text-green-400"
											: isAvailable
												? "border-green-800/30 text-green-600 hover:border-green-700 hover:text-green-500"
												: "border-green-900/20 text-green-800 cursor-not-allowed"
									}
                `}
								title={isAvailable ? agent.description : "Coming soon"}
							>
								<Icon className="w-4 h-4" />
								{agent.name}
								{!isAvailable && (
									<span className="text-green-800 text-xs">(Soon)</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Selected Agent Info */}
			<div className="text-xs text-green-600 font-mono">
				&gt; {agents.find((a) => a.id === selectedAgent)?.description}
			</div>
		</div>
	);
}
