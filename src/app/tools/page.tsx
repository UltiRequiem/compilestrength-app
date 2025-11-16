import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { LandingNavbar } from "@/components/landing-navbar";

const itemListSchema = {
	"@context": "https://schema.org",
	"@type": "ItemList",
	name: "Free Fitness Calculators",
	description:
		"Free evidence-based fitness calculators and tools for serious lifters",
	itemListElement: [
		{
			"@type": "ListItem",
			position: 1,
			item: {
				"@type": "SoftwareApplication",
				name: "FFMI Calculator",
				url: "https://compilestrength.com/tools/ffmi-calculator",
				description:
					"Calculate your Fat-Free Mass Index to assess muscle development and natural genetic potential",
			},
		},
		{
			"@type": "ListItem",
			position: 2,
			item: {
				"@type": "SoftwareApplication",
				name: "One Rep Max Calculator",
				url: "https://compilestrength.com/tools/one-rep-max-calculator",
				description:
					"Calculate your 1RM using multiple proven formulas for strength assessment",
			},
		},
		{
			"@type": "ListItem",
			position: 3,
			item: {
				"@type": "SoftwareApplication",
				name: "TDEE Calculator",
				url: "https://compilestrength.com/tools/tdee-calculator",
				description:
					"Calculate your Total Daily Energy Expenditure for accurate calorie planning",
			},
		},
		{
			"@type": "ListItem",
			position: 4,
			item: {
				"@type": "SoftwareApplication",
				name: "Body Fat Calculator",
				url: "https://compilestrength.com/tools/body-fat-calculator",
				description:
					"Calculate body fat percentage using US Navy and Army methods",
			},
		},
		{
			"@type": "ListItem",
			position: 5,
			item: {
				"@type": "SoftwareApplication",
				name: "Plate Calculator",
				url: "https://compilestrength.com/tools/plate-calculator",
				description:
					"Calculate which plates to load on your barbell for any target weight",
			},
		},
	],
};

export const metadata: Metadata = {
	title: "Free Fitness Calculators & Tools | Evidence-Based Training",
	description:
		"Free FFMI, 1RM, TDEE, and body fat calculators. Science-based fitness tools for serious lifters. No signup required.",
	keywords: [
		"fitness calculators",
		"FFMI calculator",
		"1RM calculator",
		"TDEE calculator",
		"body fat calculator",
		"plate calculator",
		"evidence based fitness tools",
	],
	openGraph: {
		title: "Free Fitness Calculators & Tools | Evidence-Based Training",
		description:
			"Free FFMI, 1RM, TDEE, and body fat calculators. Science-based fitness tools for serious lifters. No signup required.",
		url: "https://compilestrength.com/tools",
		images: ["/logo.png"],
	},
	twitter: {
		title: "Free Fitness Calculators & Tools | Evidence-Based Training",
		description:
			"Free FFMI, 1RM, TDEE, and body fat calculators. Science-based fitness tools for serious lifters.",
		images: ["/logo.png"],
	},
};

export default async function ToolsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
			/>

			{/* Navbar */}
			<LandingNavbar isLoggedIn={!!session} />

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="mb-12">
					<h1 className="text-4xl font-bold mb-4">Free Training Tools</h1>
					<p className="text-zinc-400 text-lg">
						Evidence-based calculators and utilities for optimal training
					</p>
				</div>

				{/* Calculators Section */}
				<div className="space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-4 text-blue-500">
							Calculators
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Link href="/tools/ffmi-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer h-full flex flex-col">
									<h3 className="text-xl font-bold mb-2">FFMI Calculator</h3>
									<p className="text-zinc-400 text-sm flex-1">
										Calculate your Fat-Free Mass Index to assess muscle
										development and natural genetic potential
									</p>
								</div>
							</Link>

							<Link href="/tools/one-rep-max-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer h-full flex flex-col">
									<h3 className="text-xl font-bold mb-2">
										One Rep Max Calculator
									</h3>
									<p className="text-zinc-400 text-sm flex-1">
										Calculate your 1RM using multiple proven formulas for
										strength assessment
									</p>
								</div>
							</Link>

							<Link href="/tools/tdee-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer h-full flex flex-col">
									<h3 className="text-xl font-bold mb-2">TDEE Calculator</h3>
									<p className="text-zinc-400 text-sm flex-1">
										Calculate your Total Daily Energy Expenditure for accurate
										calorie planning
									</p>
								</div>
							</Link>

							<Link href="/tools/body-fat-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer h-full flex flex-col">
									<h3 className="text-xl font-bold mb-2">
										Body Fat Calculator
									</h3>
									<p className="text-zinc-400 text-sm flex-1">
										Calculate body fat percentage using US Navy and Army methods
									</p>
								</div>
							</Link>

							<Link href="/tools/plate-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer h-full flex flex-col">
									<h3 className="text-xl font-bold mb-2">Plate Calculator</h3>
									<p className="text-zinc-400 text-sm flex-1">
										Calculate which plates to load on your barbell for any
										target weight
									</p>
								</div>
							</Link>

							<div className="border border-zinc-800 p-6 rounded-xl opacity-50 h-full flex flex-col">
								<h3 className="text-xl font-bold mb-2">Macro Calculator</h3>
								<p className="text-zinc-400 text-sm flex-1">Coming soon...</p>
							</div>
						</div>
					</div>
				</div>

				{/* CTA - Only show if not logged in */}
				{!session && (
					<div className="mt-16 border border-zinc-800 p-12 rounded-xl bg-zinc-900/50 text-center">
						<h2 className="text-3xl font-bold mb-3">
							Want More Advanced Features?
						</h2>
						<p className="text-zinc-400 mb-6 text-lg">
							Get AI-powered program generation, progress tracking, and
							performance analytics
						</p>
						<Link href="/signup">
							<Button size="lg" className="h-12 px-8 text-lg">
								Start Free Trial
							</Button>
						</Link>
					</div>
				)}
			</main>
		</div>
	);
}
