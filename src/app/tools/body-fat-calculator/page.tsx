"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

export default function BodyFatCalculator() {
	const { data: session } = useSession();
	const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
	const [gender, setGender] = useState<"male" | "female">("male");
	const [height, setHeight] = useState("");
	const [waist, setWaist] = useState("");
	const [neck, setNeck] = useState("");
	const [hip, setHip] = useState(""); // Only for females
	const [results, setResults] = useState<{
		bodyFat: number;
		category: string;
		method: string;
	} | null>(null);

	const calculate = () => {
		if (!height.trim() || !waist.trim() || !neck.trim()) {
			alert("Please enter height, waist, and neck measurements");
			return;
		}

		if (gender === "female" && !hip.trim()) {
			alert("Please enter hip measurement for females");
			return;
		}

		const h = Number.parseFloat(height);
		const w = Number.parseFloat(waist);
		const n = Number.parseFloat(neck);
		const hipMeasure = gender === "female" ? Number.parseFloat(hip) : 0;

		if (
			Number.isNaN(h) ||
			Number.isNaN(w) ||
			Number.isNaN(n) ||
			h <= 0 ||
			w <= 0 ||
			n <= 0
		) {
			alert("Please enter valid measurements for height, waist, and neck");
			return;
		}

		if (gender === "female" && (Number.isNaN(hipMeasure) || hipMeasure <= 0)) {
			alert("Please enter a valid hip measurement");
			return;
		}

		// Convert to cm if imperial
		const heightCm = unit === "imperial" ? h * 2.54 : h;
		const waistCm = unit === "imperial" ? w * 2.54 : w;
		const neckCm = unit === "imperial" ? n * 2.54 : n;
		const hipCm =
			gender === "female" && unit === "imperial"
				? hipMeasure * 2.54
				: hipMeasure;

		let bodyFatPercentage: number;

		if (gender === "male") {
			// US Navy formula for males
			bodyFatPercentage =
				495 /
					(1.0324 -
						0.19077 * Math.log10(waistCm - neckCm) +
						0.15456 * Math.log10(heightCm)) -
				450;
		} else {
			// US Navy formula for females
			bodyFatPercentage =
				495 /
					(1.29579 -
						0.35004 * Math.log10(waistCm + hipCm - neckCm) +
						0.221 * Math.log10(heightCm)) -
				450;
		}

		// Determine category
		let category = "";
		if (gender === "male") {
			if (bodyFatPercentage < 6) category = "Essential fat (too low)";
			else if (bodyFatPercentage < 14) category = "Athletic";
			else if (bodyFatPercentage < 18) category = "Fitness";
			else if (bodyFatPercentage < 25) category = "Average";
			else category = "Above average";
		} else {
			if (bodyFatPercentage < 14) category = "Essential fat (too low)";
			else if (bodyFatPercentage < 21) category = "Athletic";
			else if (bodyFatPercentage < 25) category = "Fitness";
			else if (bodyFatPercentage < 32) category = "Average";
			else category = "Above average";
		}

		setResults({
			bodyFat: Number(bodyFatPercentage.toFixed(1)),
			category,
			method: "US Navy",
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
					<h1 className="text-4xl font-bold mb-4">Body Fat Calculator</h1>
					<p className="text-zinc-400">
						Calculate your body fat percentage using circumference measurements
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "imperial" ? "default" : "outline"}
							onClick={() => setUnit("imperial")}
						>
							Imperial (inches)
						</Button>
						<Button
							variant={unit === "metric" ? "default" : "outline"}
							onClick={() => setUnit("metric")}
						>
							Metric (cm)
						</Button>
					</div>

					{/* Gender Selection */}
					<div className="flex gap-4">
						<Button
							variant={gender === "male" ? "default" : "outline"}
							onClick={() => setGender("male")}
						>
							Male
						</Button>
						<Button
							variant={gender === "female" ? "default" : "outline"}
							onClick={() => setGender("female")}
						>
							Female
						</Button>
					</div>

					{/* Inputs */}
					<div className="space-y-4">
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
							<Label htmlFor="waist">
								Waist Circumference ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="waist"
								type="number"
								value={waist}
								onChange={(e) => setWaist(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 32" : "e.g., 81"}
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Measure at the navel (belly button) level
							</p>
						</div>

						<div>
							<Label htmlFor="neck">
								Neck Circumference ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="neck"
								type="number"
								value={neck}
								onChange={(e) => setNeck(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 15" : "e.g., 38"}
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Measure just below the Adam's apple
							</p>
						</div>

						{gender === "female" && (
							<div>
								<Label htmlFor="hip">
									Hip Circumference ({unit === "imperial" ? "inches" : "cm"})
								</Label>
								<Input
									id="hip"
									type="number"
									value={hip}
									onChange={(e) => setHip(e.target.value)}
									placeholder={unit === "imperial" ? "e.g., 38" : "e.g., 97"}
									className="mt-1"
								/>
								<p className="text-xs text-zinc-400 mt-1">
									Measure at the widest point around the hips
								</p>
							</div>
						)}
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
						Calculate Body Fat
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="space-y-4">
								<div className="p-6 bg-blue-900/20 border border-blue-800/50 rounded-lg text-center">
									<div className="text-sm text-blue-400 mb-2">
										Body Fat Percentage
									</div>
									<div className="text-4xl font-bold text-blue-500 mb-2">
										{results.bodyFat}%
									</div>
									<div className="text-lg text-zinc-300">
										{results.category}
									</div>
								</div>

								<div className="p-4 bg-zinc-800/50 rounded-lg">
									<div className="text-sm text-zinc-400 mb-2">
										Method: {results.method} Formula
									</div>
									<div className="text-xs text-zinc-500">
										Based on circumference measurements using validated military
										formulas
									</div>
								</div>
							</div>

							{/* Body Fat Categories */}
							<div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
								<h3 className="font-bold mb-3 text-blue-500">
									Body Fat Categories
								</h3>
								<div className="grid md:grid-cols-2 gap-4 text-sm">
									<div>
										<h4 className="font-semibold text-zinc-300 mb-2">Men:</h4>
										<ul className="space-y-1 text-zinc-400">
											<li>Essential: 2-5%</li>
											<li>Athletic: 6-13%</li>
											<li>Fitness: 14-17%</li>
											<li>Average: 18-24%</li>
											<li>Above Average: 25%+</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-zinc-300 mb-2">Women:</h4>
										<ul className="space-y-1 text-zinc-400">
											<li>Essential: 10-13%</li>
											<li>Athletic: 14-20%</li>
											<li>Fitness: 21-24%</li>
											<li>Average: 25-31%</li>
											<li>Above Average: 32%+</li>
										</ul>
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
							About This Calculator
						</h3>
						<p>
							This calculator uses the US Navy method, which estimates body fat
							percentage using circumference measurements. It's more accessible
							than DEXA scans but less accurate than professional methods.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Measurement Tips
						</h3>
						<p>
							Take measurements at the same time of day, preferably in the
							morning. Ensure the tape measure is snug but not tight. Take
							measurements three times and use the average for best accuracy.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Limitations
						</h3>
						<p>
							This method may be less accurate for very muscular or very lean
							individuals. It's best used for tracking changes over time rather
							than absolute accuracy.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
