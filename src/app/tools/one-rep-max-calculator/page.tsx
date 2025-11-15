"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

export default function OneRepMaxCalculator() {
	const { data: session } = useSession();
	const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [results, setResults] = useState<{
		brzycki: number;
		epley: number;
		lander: number;
		lombardi: number;
		mayhew: number;
		oConner: number;
		wathen: number;
		average: number;
	} | null>(null);

	const calculate = () => {
		if (!weight.trim() || !reps.trim()) {
			alert("Please enter both weight and reps");
			return;
		}

		const w = Number.parseFloat(weight);
		const r = Number.parseInt(reps, 10);

		if (Number.isNaN(w) || Number.isNaN(r) || w <= 0 || r <= 0 || r > 20) {
			alert("Please enter valid weight and reps (1-20 reps)");
			return;
		}

		// Different 1RM formulas
		const brzycki = w * (36 / (37 - r));
		const epley = w * (1 + r / 30);
		const lander = (100 * w) / (101.3 - 2.67123 * r);
		const lombardi = w * r ** 0.1;
		const mayhew = (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
		const oConner = w * (1 + 0.025 * r);
		const wathen = (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r));

		const average =
			(brzycki + epley + lander + lombardi + mayhew + oConner + wathen) / 7;

		setResults({
			brzycki: Number(brzycki.toFixed(1)),
			epley: Number(epley.toFixed(1)),
			lander: Number(lander.toFixed(1)),
			lombardi: Number(lombardi.toFixed(1)),
			mayhew: Number(mayhew.toFixed(1)),
			oConner: Number(oConner.toFixed(1)),
			wathen: Number(wathen.toFixed(1)),
			average: Number(average.toFixed(1)),
		});
	};

	// Handle unit conversion for existing results
	const handleUnitChange = (newUnit: "lbs" | "kg") => {
		const oldUnit = unit;
		setUnit(newUnit);

		// Convert existing results if they exist
		if (results && oldUnit !== newUnit) {
			const conversionFactor = newUnit === "kg" ? 0.453592 : 2.20462;

			setResults({
				brzycki: Number((results.brzycki * conversionFactor).toFixed(1)),
				epley: Number((results.epley * conversionFactor).toFixed(1)),
				lander: Number((results.lander * conversionFactor).toFixed(1)),
				lombardi: Number((results.lombardi * conversionFactor).toFixed(1)),
				mayhew: Number((results.mayhew * conversionFactor).toFixed(1)),
				oConner: Number((results.oConner * conversionFactor).toFixed(1)),
				wathen: Number((results.wathen * conversionFactor).toFixed(1)),
				average: Number((results.average * conversionFactor).toFixed(1)),
			});
		}
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
					<h1 className="text-4xl font-bold mb-4">One Rep Max Calculator</h1>
					<p className="text-zinc-400">
						Calculate your one rep max (1RM) using multiple proven formulas
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
					<div className="space-y-4">
						<div>
							<Label htmlFor="weight">Weight ({unit})</Label>
							<Input
								id="weight"
								type="number"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder={unit === "lbs" ? "e.g., 225" : "e.g., 102"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="reps">Reps Performed</Label>
							<Input
								id="reps"
								type="number"
								value={reps}
								onChange={(e) => setReps(e.target.value)}
								placeholder="e.g., 5"
								min="1"
								max="20"
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Enter reps between 1-20 for best accuracy
							</p>
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
						Calculate 1RM
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-zinc-400">Brzycki Formula:</span>
										<span className="font-bold">
											{results.brzycki} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Epley Formula:</span>
										<span className="font-bold">
											{results.epley} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Lander Formula:</span>
										<span className="font-bold">
											{results.lander} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Lombardi Formula:</span>
										<span className="font-bold">
											{results.lombardi} {unit}
										</span>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-zinc-400">Mayhew Formula:</span>
										<span className="font-bold">
											{results.mayhew} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">O'Connor Formula:</span>
										<span className="font-bold">
											{results.oConner} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Wathen Formula:</span>
										<span className="font-bold">
											{results.wathen} {unit}
										</span>
									</div>
									<div className="flex justify-between pt-3 border-t border-zinc-800">
										<span className="text-zinc-400 font-semibold">
											Average:
										</span>
										<span className="font-bold text-blue-500 text-lg">
											{results.average} {unit}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							About 1RM Calculations
						</h3>
						<p>
							One Rep Max (1RM) is the maximum weight you can lift for one
							repetition of a given exercise. These formulas estimate your 1RM
							based on submaximal lifts.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Formula Accuracy
						</h3>
						<p>
							Most formulas are most accurate in the 2-10 rep range. The Brzycki
							and Epley formulas are most commonly used and generally reliable
							for compound movements like squat, bench press, and deadlift.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Safety Note
						</h3>
						<p>
							Always warm up properly before attempting heavy lifts. Consider
							having a spotter when testing true 1RM attempts. These
							calculations are estimates and individual results may vary.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
