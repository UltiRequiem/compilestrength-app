import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "CompileStrength",
	url: "https://compilestrength.com",
	logo: "https://compilestrength.com/logo.png",
	description:
		"AI-powered workout programming for evidence-based lifters. Train smarter with personalized programs built on exercise science.",
	sameAs: ["https://twitter.com/compilestrength"],
};

const softwareApplicationSchema = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "CompileStrength",
	applicationCategory: "HealthApplication",
	operatingSystem: "Web",
	description:
		"AI-powered workout program generator for evidence-based lifters. Generate personalized training programs with progressive overload and periodization.",
	url: "https://compilestrength.com",
	author: {
		"@type": "Organization",
		name: "CompileStrength",
	},
	offers: [
		{
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			description: "7-day free trial",
			eligibleDuration: {
				"@type": "Duration",
				// ISO 8601 duration for 7 days
				duration: "P7D",
			},
			isAccessibleForFree: true,
		},
		{
			"@type": "Offer",
			price: "19.99",
			priceCurrency: "USD",
			description: "Monthly subscription after free trial",
			isAccessibleForFree: false,
		},
	],
};

export default async function LandingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(softwareApplicationSchema),
				}}
			/>

			{/* Navbar */}
			<nav className="border-b border-zinc-800 px-4 sm:px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 shrink-0">
						<Image
							src="/logo.png"
							alt="CompileStrength Logo"
							width={32}
							height={32}
							className="object-contain"
						/>
						<span className="text-lg sm:text-xl font-bold">
							<span className="text-blue-500">Compile</span>
							<span className="text-white">Strength</span>
						</span>
					</Link>
					<div className="flex items-center gap-2 sm:gap-4">
						{/* Only show on larger screens */}
						<div className="hidden lg:flex items-center gap-4">
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
						</div>
						{session ? (
							<Link href="/app/dashboard">
								<Button size="sm" className="shrink-0">
									Dashboard
								</Button>
							</Link>
						) : (
							<div className="flex items-center gap-2">
								{/* Hide Login button on very small screens */}
								<Link href="/login" className="hidden xs:block">
									<Button
										variant="outline"
										size="sm"
										className="shrink-0 text-xs sm:text-sm px-2 sm:px-4"
									>
										Login
									</Button>
								</Link>
								<Link href="/signup">
									<Button
										size="sm"
										className="shrink-0 text-xs sm:text-sm px-2 sm:px-4"
									>
										Sign Up
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
				<div className="text-center space-y-6">
					<h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">
						Training Programs Built on
						<span className="text-blue-500 block mt-2">Exercise Science</span>
					</h1>
					<p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
						AI-powered programming designed for lifters who understand
						progressive overload, periodization, and evidence-based training
						principles.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-8 max-w-md sm:max-w-none mx-auto">
						<Link href="/signup" className="w-full sm:w-auto">
							<Button
								size="lg"
								className="w-full sm:w-auto text-base sm:text-lg h-12 px-6 sm:px-8"
							>
								Start Free Trial
							</Button>
						</Link>
						<Link href="/tools" className="w-full sm:w-auto">
							<Button
								size="lg"
								variant="outline"
								className="w-full sm:w-auto text-base sm:text-lg h-12 px-6 sm:px-8"
							>
								Free Training Tools
							</Button>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className="grid md:grid-cols-3 gap-8 mt-24">
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							AI Program Generator
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Create personalized training programs based on your experience
							level, training frequency, and goals. Built with periodization
							principles.
						</p>
					</div>
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							Progress Analytics
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Track your lifts, monitor progressive overload, and analyze
							performance trends with detailed metrics that matter.
						</p>
					</div>
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							Evidence-Based Tools
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Access calculators for FFMI, estimated 1RMs, and other metrics to
							make informed training decisions.
						</p>
					</div>
				</div>

				<div className="mt-24 border border-zinc-800 p-12 rounded-xl bg-zinc-900/50 text-center">
					<h2 className="text-4xl font-bold mb-4">Ready to Train Smarter?</h2>
					<p className="text-zinc-400 mb-8 text-lg">
						Join lifters who prioritize science-based programming. Start your
						7-day free trial.
					</p>
					<Link href="/signup">
						<Button size="lg" className="h-12 px-8 text-lg">
							Get Started
						</Button>
					</Link>
				</div>
			</main>
		</div>
	);
}
