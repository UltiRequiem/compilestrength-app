"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

interface PlateConfig {
	weight: number;
	color: string;
	count: number;
}

export default function PlateCalculator() {
	const { data: session } = useSession();
	const [unit, setUnit] = useState<"kg" | "lbs">("lbs");
	const [targetWeight, setTargetWeight] = useState("");
	const [barWeight, setBarWeight] = useState("45");
	const [results, setResults] = useState<{
		plates: PlateConfig[];
		totalWeight: number;
		impossible: boolean;
	} | null>(null);

	// Standard plate sets
	const plateConfigs = {
		kg: [
			{ weight: 25, color: "bg-red-600", count: 0 },
			{ weight: 20, color: "bg-blue-600", count: 0 },
			{ weight: 15, color: "bg-yellow-600", count: 0 },
			{ weight: 10, color: "bg-green-600", count: 0 },
			{ weight: 5, color: "bg-white text-black", count: 0 },
			{ weight: 2.5, color: "bg-red-800", count: 0 },
			{ weight: 1.25, color: "bg-gray-600", count: 0 },
		],
		lbs: [
			{ weight: 45, color: "bg-red-600", count: 0 },
			{ weight: 35, color: "bg-blue-600", count: 0 },
			{ weight: 25, color: "bg-yellow-600", count: 0 },
			{ weight: 10, color: "bg-green-600", count: 0 },
			{ weight: 5, color: "bg-white text-black", count: 0 },
			{ weight: 2.5, color: "bg-red-800", count: 0 },
		],
	};

	const calculate = () => {
		if (!targetWeight.trim() || !barWeight.trim()) {
			alert("Please enter both target weight and bar weight");
			return;
		}

		const target = Number.parseFloat(targetWeight);
		const bar = Number.parseFloat(barWeight);

		if (Number.isNaN(target) || Number.isNaN(bar) || target <= 0 || bar <= 0) {
			alert("Please enter valid numbers for target weight and bar weight");
			return;
		}

		if (target <= bar) {
			alert("Target weight must be greater than bar weight");
			return;
		}

		const weightNeeded = target - bar;
		const weightPerSide = weightNeeded / 2;

		// Get available plates for the unit
		const availablePlates = [...plateConfigs[unit]].sort(
			(a, b) => b.weight - a.weight,
		);

		let remainingWeight = weightPerSide;
		const usedPlates: PlateConfig[] = [];

		// Greedy algorithm to find plate combination
		for (const plate of availablePlates) {
			const platesNeeded = Math.floor(remainingWeight / plate.weight);
			if (platesNeeded > 0) {
				usedPlates.push({
					...plate,
					count: platesNeeded,
				});
				remainingWeight -= platesNeeded * plate.weight;
			}
		}

		const actualWeight =
			bar +
			usedPlates.reduce((sum, plate) => sum + plate.weight * plate.count, 0) *
				2;
		const isImpossible = Math.abs(remainingWeight) > 0.01; // Small tolerance for floating point

		setResults({
			plates: usedPlates.filter((p) => p.count > 0),
			totalWeight: actualWeight,
			impossible: isImpossible,
		});
	};

	// Update bar weight when unit changes
	const handleUnitChange = (newUnit: "kg" | "lbs") => {
		setUnit(newUnit);
		setBarWeight(newUnit === "kg" ? "20" : "45");
		// Clear results since they're no longer valid for the new unit
		setResults(null);
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Navbar */}
			<nav className="border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						<span className="text-blue-500">Compile</span>
						<span className="text-white">Strength</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/tools"
							className="text-zinc-300 hover:text-white transition-colors"
						>
							Tools
						</Link>
						<Link
							href="/blog"
							className="text-zinc-300 hover:text-white transition-colors"
						>
							Blog
						</Link>
						{session ? (
							<Link href="/app/dashboard">
								<Button size="sm">Dashboard</Button>
							</Link>
						) : (
							<>
								<Link href="/login">
									<Button variant="outline" size="sm">
										Login
									</Button>
								</Link>
								<Link href="/signup">
									<Button size="sm">Sign Up</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-3xl mx-auto px-6 py-12">
				<div className="mb-8">
					<Link
						href="/tools"
						className="text-sm text-zinc-400 hover:text-blue-500 mb-4 inline-block"
					>
						← Back to Tools
					</Link>
					<h1 className="text-4xl font-bold mb-4">Plate Calculator</h1>
					<p className="text-zinc-400">
						Calculate which plates to load on your barbell for any target weight
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "lbs" ? "default" : "outline"}
							onClick={() => handleUnitChange("lbs")}
						>
							Pounds (lbs)
						</Button>
						<Button
							variant={unit === "kg" ? "default" : "outline"}
							onClick={() => handleUnitChange("kg")}
						>
							Kilograms (kg)
						</Button>
					</div>

					{/* Inputs */}
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="target">Target Weight ({unit})</Label>
							<Input
								id="target"
								type="number"
								value={targetWeight}
								onChange={(e) => setTargetWeight(e.target.value)}
								placeholder={unit === "kg" ? "e.g., 100" : "e.g., 225"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="bar">Bar Weight ({unit})</Label>
							<Input
								id="bar"
								type="number"
								value={barWeight}
								onChange={(e) => setBarWeight(e.target.value)}
								placeholder={unit === "kg" ? "20" : "45"}
								className="mt-1"
							/>
						</div>
					</div>

					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							calculate();
						}}
						className="w-full"
						size="lg"
					>
						Calculate Plates
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Plate Loading</h2>

							{results.impossible ? (
								<div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-center">
									<div className="text-red-400 font-semibold mb-2">
										Impossible to Load Exactly
									</div>
									<div className="text-sm text-red-300">
										Cannot achieve exact weight with standard plates. Closest
										achievable: {results.totalWeight} {unit}
									</div>
								</div>
							) : (
								<div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg text-center mb-6">
									<div className="text-green-400 font-semibold mb-1">
										Total Weight
									</div>
									<div className="text-3xl font-bold text-green-500">
										{results.totalWeight} {unit}
									</div>
								</div>
							)}

							{/* Plate Layout */}
							{results.plates.length > 0 && (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Plates Per Side:</h3>
									<div className="flex flex-wrap gap-2">
										{results.plates.map((plate, index) => (
											<div
												key={index}
												className={`px-4 py-2 rounded-lg ${plate.color} font-bold flex items-center gap-2`}
											>
												<span>
													{plate.weight}
													{unit === "kg" ? "kg" : "lb"}
												</span>
												<span className="bg-black/20 px-2 py-1 rounded text-sm">
													×{plate.count}
												</span>
											</div>
										))}
									</div>

									{/* Visual Bar Representation */}
									<div className="mt-6">
										<h4 className="text-sm font-semibold mb-2 text-zinc-400">
											Bar Layout:
										</h4>
										<div className="flex items-center justify-center gap-1 p-4 bg-zinc-800/30 rounded-lg">
											{/* Left plates */}
											<div className="flex">
												{results.plates.map((plate, plateIndex) =>
													Array.from({ length: plate.count }).map(
														(_, countIndex) => (
															<div
																key={`left-${plateIndex}-${countIndex}`}
																className={`w-3 h-12 ${plate.color} border border-zinc-600 -ml-1 first:ml-0`}
																title={`${plate.weight}${
																	unit === "kg" ? "kg" : "lb"
																}`}
															/>
														),
													),
												)}
											</div>

											{/* Bar */}
											<div className="bg-zinc-600 h-2 w-32 mx-2 rounded" />

											{/* Right plates (reversed order) */}
											<div className="flex">
												{[...results.plates]
													.reverse()
													.map((plate, plateIndex) =>
														Array.from({ length: plate.count }).map(
															(_, countIndex) => (
																<div
																	key={`right-${plateIndex}-${countIndex}`}
																	className={`w-3 h-12 ${plate.color} border border-zinc-600 -mr-1 last:mr-0`}
																	title={`${plate.weight}${
																		unit === "kg" ? "kg" : "lb"
																	}`}
																/>
															),
														),
													)}
											</div>
										</div>
									</div>

									{/* Summary */}
									<div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm">
										<div className="grid md:grid-cols-2 gap-4 text-zinc-400">
											<div>
												<span className="text-blue-500 font-semibold">
													Bar:
												</span>{" "}
												{barWeight} {unit}
											</div>
											<div>
												<span className="text-blue-500 font-semibold">
													Plates:
												</span>{" "}
												{results.totalWeight - Number.parseFloat(barWeight)}{" "}
												{unit} (
												{(results.totalWeight - Number.parseFloat(barWeight)) /
													2}{" "}
												{unit} per side)
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Standard Plate Colors
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h4 className="font-semibold text-zinc-300 mb-2">Kilograms:</h4>
								<ul className="space-y-1">
									<li>
										<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2"></span>
										25kg - Red
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2"></span>
										20kg - Blue
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2"></span>
										15kg - Yellow
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2"></span>
										10kg - Green
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-zinc-300 mb-2">Pounds:</h4>
								<ul className="space-y-1">
									<li>
										<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2"></span>
										45lb - Red
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2"></span>
										35lb - Blue
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2"></span>
										25lb - Yellow
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2"></span>
										10lb - Green
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Loading Tips
						</h3>
						<p>
							Always load plates symmetrically and use collars to secure them.
							Load heavier plates closer to the bar for better balance and
							safety. The calculator assumes standard gym plate availability.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
