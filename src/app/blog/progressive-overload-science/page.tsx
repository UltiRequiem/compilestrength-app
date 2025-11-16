import { headers } from "next/headers";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function ProgressiveOverloadBlogPost() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<Navbar />

			{/* Article Content */}
			<article className="max-w-3xl mx-auto px-6 py-12">
				{/* Back Link */}
				<Link
					href="/blog"
					className="text-sm text-zinc-400 hover:text-blue-500 mb-6 inline-block"
				>
					← Back to Blog
				</Link>

				{/* Article Header */}
				<header className="mb-12">
					<div className="mb-4">
						<div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
							<span>November 14, 2024</span>
							<span>•</span>
							<span>8 min read</span>
						</div>
						<h1 className="text-4xl font-bold mb-4 leading-tight">
							Understanding Progressive Overload: The Science Behind Muscle
							Growth
						</h1>
						<p className="text-xl text-zinc-400 leading-relaxed">
							Progressive overload is the fundamental principle of strength
							training. Learn the science behind why gradually increasing
							training demands is essential for continued muscle growth and
							strength gains.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{["Progressive Overload", "Muscle Growth", "Training Science"].map(
							(tag) => (
								<span
									key={tag}
									className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20"
								>
									{tag}
								</span>
							),
						)}
					</div>
				</header>

				{/* Article Content */}
				<div className="prose prose-invert prose-zinc max-w-none">
					<div className="space-y-6 text-zinc-300 leading-relaxed">
						<p className="text-lg">
							If you've been lifting for more than a few weeks, you've probably
							heard the term "progressive overload" thrown around in gym
							conversations and fitness forums. But what exactly is progressive
							overload, and why is it considered the most important principle in
							resistance training?
						</p>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							What is Progressive Overload?
						</h2>

						<p>
							Progressive overload is the gradual increase of stress placed on
							the body during exercise training. Simply put, to continue making
							gains in muscle size, strength, and endurance, you must
							continually challenge your muscles by incrementally increasing the
							demands placed on them.
						</p>

						<p>
							This concept isn't new – it was first documented by Milo of
							Croton, an ancient Greek wrestler who allegedly carried a calf on
							his shoulders every day. As the calf grew heavier, Milo's strength
							increased proportionally. While this story may be legend, the
							principle it illustrates is scientifically sound.
						</p>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							The Science Behind Progressive Overload
						</h2>

						<p>
							When you exercise, you create microscopic tears in your muscle
							fibers. Your body responds by repairing these tears and adding
							additional protein to make the muscle stronger and more capable of
							handling the same stress in the future. This process is called
							muscle protein synthesis (MPS).
						</p>

						<p>
							However, your muscles are incredibly efficient at adapting. Once
							they've adapted to a particular stimulus, they won't continue to
							grow or get stronger unless you provide a new, greater challenge.
							This is where progressive overload comes in.
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							The Adaptation Response
						</h3>

						<p>
							Research shows that muscle adaptations follow a predictable
							pattern:
						</p>

						<ol className="list-decimal list-inside space-y-2 ml-4">
							<li>
								<strong>Initial Response</strong>: Your body experiences acute
								stress from training
							</li>
							<li>
								<strong>Recovery</strong>: Muscle protein synthesis increases to
								repair damage
							</li>
							<li>
								<strong>Supercompensation</strong>: Muscles adapt by becoming
								stronger/larger
							</li>
							<li>
								<strong>New Baseline</strong>: The adapted muscle becomes the
								new normal
							</li>
						</ol>

						<p>
							Without progressive overload, you'll plateau at step 4,
							maintaining your current fitness level but not improving further.
						</p>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							Methods of Progressive Overload
						</h2>

						<p>
							Progressive overload doesn't just mean adding more weight to the
							bar. There are several variables you can manipulate:
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							1. Load (Weight)
						</h3>
						<p>
							The most obvious form of progression. Gradually increasing the
							weight lifted forces your muscles to work harder and adapt by
							getting stronger.
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							2. Volume (Sets × Reps)
						</h3>
						<p>
							Increasing the total amount of work performed. This could mean
							adding sets, increasing reps, or both. Volume is particularly
							important for muscle growth (hypertrophy).
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							3. Frequency
						</h3>
						<p>
							Training a muscle group more often throughout the week can provide
							additional stimulus for growth and strength gains.
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							4. Density
						</h3>
						<p>
							Performing the same amount of work in less time by reducing rest
							periods between sets increases training density and metabolic
							stress.
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							5. Range of Motion
						</h3>
						<p>
							Increasing the range of motion of exercises can provide additional
							stimulus and improve muscle development.
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							6. Time Under Tension
						</h3>
						<p>
							Controlling the tempo of lifts (especially the eccentric/lowering
							phase) increases the time muscles are under tension.
						</p>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							Research on Progressive Overload
						</h2>

						<p>
							A landmark study by Kraemer et al. (2002) compared different
							progression models and found that programs incorporating
							systematic progression produced significantly greater strength and
							muscle gains compared to non-progressive programs.
						</p>

						<p>
							More recent research by Schoenfeld et al. (2017) demonstrated that
							progressive overload in volume (gradually increasing sets per
							week) led to superior muscle growth compared to maintaining
							constant volume over time.
						</p>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							Practical Application
						</h2>

						<p>
							Understanding progressive overload is one thing; applying it
							effectively is another. Here are evidence-based guidelines:
						</p>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							For Strength
						</h3>
						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>Focus primarily on load progression</li>
							<li>
								Increase weight by 2.5-5% when you can complete all sets with
								good form
							</li>
							<li>Work in the 1-6 rep range most often</li>
						</ul>

						<h3 className="text-xl font-semibold text-white mt-6 mb-3">
							For Muscle Growth
						</h3>
						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>Volume progression is key</li>
							<li>Work in the 6-20 rep range</li>
							<li>Add sets or reps before adding weight</li>
							<li>Aim for 2-3 challenging sets per muscle group per session</li>
						</ul>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							Common Mistakes
						</h2>

						<p>Many trainees make these progression errors:</p>

						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>
								<strong>Too much, too fast</strong>: Jumping weight too
								aggressively leads to form breakdown and potential injury
							</li>
							<li>
								<strong>Ignoring other variables</strong>: Only focusing on load
								while ignoring volume, frequency, etc.
							</li>
							<li>
								<strong>No systematic approach</strong>: Random progression
								without a plan
							</li>
							<li>
								<strong>Perfectionism</strong>: Waiting for "perfect" sessions
								instead of making consistent small improvements
							</li>
						</ul>

						<h2 className="text-2xl font-bold text-white mt-8 mb-4">
							Conclusion
						</h2>

						<p>
							Progressive overload is not just a training principle – it's the
							foundation of all effective resistance training programs. Without
							it, you're essentially spinning your wheels, maintaining your
							current fitness level but not improving.
						</p>

						<p>
							The key is consistency and patience. Small, incremental increases
							compound over time to produce significant results. Whether your
							goal is getting stronger, building muscle, or improving athletic
							performance, progressive overload must be at the center of your
							training approach.
						</p>

						<p>
							Remember: progress doesn't have to be linear, and it doesn't have
							to be fast. It just has to be consistent. Track your workouts,
							plan your progressions, and trust the process. Your future self
							will thank you.
						</p>
					</div>
				</div>

				{/* CTA Section */}
				{!session && (
					<div className="mt-16 border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 text-center">
						<h3 className="text-2xl font-bold mb-3">
							Want to Apply Progressive Overload Systematically?
						</h3>
						<p className="text-zinc-400 mb-6">
							Our AI-powered program generator creates training plans with
							built-in progressive overload
						</p>
						<Link href="/signup">
							<Button size="lg" className="h-12 px-8">
								Try CompileStrength Free
							</Button>
						</Link>
					</div>
				)}
			</article>
		</div>
	);
}
