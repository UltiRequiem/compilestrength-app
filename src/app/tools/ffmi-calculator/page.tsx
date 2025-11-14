"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

export default function FFMICalculator() {
	const { data: session } = useSession();
	const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [bodyFat, setBodyFat] = useState("");
	const [result, setResult] = useState<{
		ffmi: number;
		adjustedFFMI: number;
		fatFreeMass: number;
		category: string;
	} | null>(null);

	const calculate = () => {
		const w = Number.parseFloat(weight);
		const h = Number.parseFloat(height);
		const bf = Number.parseFloat(bodyFat);

		if (!w || !h || !bf || bf < 0 || bf > 100) {
			alert("Please enter valid numbers");
			return;
		}

		// Convert to metric if needed
		const weightKg = unit === "imperial" ? w * 0.453592 : w;
		const heightM = unit === "imperial" ? h * 0.0254 : h / 100;

		// Calculate fat-free mass in kg
		const fatFreeMassKg = weightKg * (1 - bf / 100);

		// Calculate FFMI
		const ffmi = fatFreeMassKg / (heightM * heightM);

		// Calculate adjusted FFMI (normalized to 1.8m height)
		const adjustedFFMI = ffmi + 6.1 * (1.8 - heightM);

		// Convert fat-free mass to display units
		const fatFreeMassDisplay =
			unit === "imperial"
				? fatFreeMassKg * 2.20462 // Convert kg to lbs
				: fatFreeMassKg;

		// Determine category (matching info box ranges)
		let category = "";
		if (adjustedFFMI < 18) {
			category = "Below average";
		} else if (adjustedFFMI >= 18 && adjustedFFMI < 20) {
			category = "Average";
		} else if (adjustedFFMI >= 20 && adjustedFFMI < 22) {
			category = "Above average";
		} else if (adjustedFFMI >= 22 && adjustedFFMI < 24) {
			category = "Excellent";
		} else if (adjustedFFMI >= 24 && adjustedFFMI < 26) {
			category = "Superior - Natural limit";
		} else {
			category = "Very likely enhanced (steroid use)";
		}

		setResult({
			ffmi: Number(ffmi.toFixed(1)),
			adjustedFFMI: Number(adjustedFFMI.toFixed(1)),
			fatFreeMass: Number(fatFreeMassDisplay.toFixed(1)),
			category,
		});
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
					<h1 className="text-4xl font-bold mb-4">FFMI Calculator</h1>
					<p className="text-zinc-400">
						Calculate your Fat-Free Mass Index to assess muscle development and
						potential
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "imperial" ? "default" : "outline"}
							onClick={() => setUnit("imperial")}
						>
							Imperial (lb/in)
						</Button>
						<Button
							variant={unit === "metric" ? "default" : "outline"}
							onClick={() => setUnit("metric")}
						>
							Metric (kg/cm)
						</Button>
					</div>

					{/* Inputs */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="weight">
								Weight ({unit === "imperial" ? "lbs" : "kg"})
							</Label>
							<Input
								id="weight"
								type="number"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 180" : "e.g., 82"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="height">
								Height ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="height"
								type="number"
								value={height}
								onChange={(e) => setHeight(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 70" : "e.g., 178"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="bodyfat">Body Fat Percentage (%)</Label>
							<Input
								id="bodyfat"
								type="number"
								value={bodyFat}
								onChange={(e) => setBodyFat(e.target.value)}
								placeholder="e.g., 15"
								className="mt-1"
							/>
						</div>
					</div>

					<Button onClick={calculate} className="w-full" size="lg">
						Calculate FFMI
					</Button>

					{/* Results */}
					{result && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-zinc-400">FFMI:</span>
									<span className="font-bold">{result.ffmi}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-zinc-400">Adjusted FFMI:</span>
									<span className="font-bold">{result.adjustedFFMI}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-zinc-400">Fat-Free Mass:</span>
									<span className="font-bold">
										{result.fatFreeMass} {unit === "imperial" ? "lbs" : "kg"}
									</span>
								</div>
								<div className="flex justify-between pt-3 border-t border-zinc-800">
									<span className="text-zinc-400">Category:</span>
									<span className="font-bold text-blue-500">
										{result.category}
									</span>
								</div>
							</div>

							{/* Info Box */}
							<div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-zinc-400">
								<p className="font-bold mb-2 text-blue-500">
									Understanding FFMI:
								</p>
								<ul className="space-y-1 list-disc list-inside">
									<li>16-17: Below average muscle mass</li>
									<li>18-19: Average for untrained individuals</li>
									<li>20-21: Above average, regular training</li>
									<li>22-23: Excellent, serious training</li>
									<li>24-25: Superior, near natural genetic limit</li>
									<li>26+: Likely enhanced (steroid use)</li>
								</ul>
							</div>
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							What is FFMI?
						</h3>
						<p>
							Fat-Free Mass Index (FFMI) is a measure used to estimate muscle
							mass relative to height. It's more accurate than BMI for assessing
							body composition in athletes and bodybuilders.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Why Adjusted FFMI?
						</h3>
						<p>
							Adjusted FFMI normalizes scores to a standard height of 1.8m
							(5'11"), allowing for fair comparison between individuals of
							different heights.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
