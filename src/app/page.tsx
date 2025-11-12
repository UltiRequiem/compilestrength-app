import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
							className="hover:text-green-300 transition-colors"
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

			{/* Hero Section */}
			<main className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center space-y-6">
					<h1 className="text-5xl md:text-6xl font-bold">
						<span className="text-green-400">// </span>Compile Your Strength
					</h1>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Build smarter, train harder, track progress like a scientist.
					</p>
					<div className="flex gap-4 justify-center pt-8">
						<Link href="/signup">
							<Button size="lg" className="text-lg">
								Start Free Trial
							</Button>
						</Link>
						<Link href="/tools">
							<Button size="lg" variant="outline" className="text-lg">
								Explore Tools
							</Button>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className="grid md:grid-cols-3 gap-8 mt-20">
					<div className="border border-green-400/20 p-6 rounded-lg">
						<h3 className="text-xl font-bold mb-3 text-green-400">
							{">"} AI Compiler
						</h3>
						<p className="text-gray-400">
							Generate personalized workout programs using advanced AI. Just
							describe your goals.
						</p>
					</div>
					<div className="border border-green-400/20 p-6 rounded-lg">
						<h3 className="text-xl font-bold mb-3 text-green-400">
							{">"} Progress Tracking
						</h3>
						<p className="text-gray-400">
							Log workouts, track PRs, and visualize your gains with detailed
							analytics.
						</p>
					</div>
					<div className="border border-green-400/20 p-6 rounded-lg">
						<h3 className="text-xl font-bold mb-3 text-green-400">
							{">"} Smart Tools
						</h3>
						<p className="text-gray-400">
							Access free calculators and tools to optimize your training
							approach.
						</p>
					</div>
				</div>

				<div className="mt-20 border border-green-400/20 p-8 rounded-lg text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to compile your gains?
					</h2>
					<p className="text-gray-400 mb-6">
						Start your 7-day free trial — Cancel anytime.
					</p>
					<Link href="/signup">
						<Button size="lg">Get Started</Button>
					</Link>
				</div>
			</main>
		</div>
	);
}
