"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FFMICalculator() {
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
		<div className="min-h-screen bg-black text-green-400 font-mono">
			{/* Navbar */}
			<nav className="border-b border-green-400/20 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						<span className="text-green-400">compile</span>
						<span className="text-white">strength</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/tools"
							className="text-green-400 hover:text-green-300 transition-colors"
						>
							Tools
						</Link>
						<Link href="/login">
							<Button variant="outline" size="sm">
								Login
							</Button>
						</Link>
						<Link href="/signup">
							<Button size="sm">Sign Up</Button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-3xl mx-auto px-6 py-12">
				<div className="mb-8">
					<Link
						href="/tools"
						className="text-sm text-gray-400 hover:text-green-400 mb-4 inline-block"
					>
						← Back to Tools
					</Link>
					<h1 className="text-4xl font-bold mb-4">
						<span className="text-green-400">// </span>FFMI Calculator
					</h1>
					<p className="text-gray-400">
						Calculate your Fat-Free Mass Index to assess muscle development and
						potential
					</p>
				</div>

				<div className="border border-green-400/20 p-8 rounded-lg space-y-6">
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
						<div className="mt-8 pt-8 border-t border-green-400/20">
							<h2 className="text-2xl font-bold mb-4">
								<span className="text-green-400">{">"} </span>Results
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-400">FFMI:</span>
									<span className="font-bold">{result.ffmi}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-400">Adjusted FFMI:</span>
									<span className="font-bold">{result.adjustedFFMI}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-400">Fat-Free Mass:</span>
									<span className="font-bold">
										{result.fatFreeMass} {unit === "imperial" ? "lbs" : "kg"}
									</span>
								</div>
								<div className="flex justify-between pt-3 border-t border-green-400/10">
									<span className="text-gray-400">Category:</span>
									<span className="font-bold text-green-400">
										{result.category}
									</span>
								</div>
							</div>

							{/* Info Box */}
							<div className="mt-6 p-4 bg-green-400/5 border border-green-400/20 rounded text-sm text-gray-400">
								<p className="font-bold mb-2 text-green-400">
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
				<div className="mt-8 space-y-4 text-sm text-gray-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-green-400">
							What is FFMI?
						</h3>
						<p>
							Fat-Free Mass Index (FFMI) is a measure used to estimate muscle
							mass relative to height. It's more accurate than BMI for assessing
							body composition in athletes and bodybuilders.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-green-400">
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
