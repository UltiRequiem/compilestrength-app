import { headers } from "next/headers";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function BlogPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const blogPosts = [
		{
			id: "progressive-overload-science",
			title:
				"Understanding Progressive Overload: The Science Behind Muscle Growth",
			excerpt:
				"Progressive overload is the fundamental principle of strength training. Learn the science behind why gradually increasing training demands is essential for continued muscle growth and strength gains.",
			publishDate: "2024-11-14",
			readTime: "8 min read",
			tags: ["Progressive Overload", "Muscle Growth", "Training Science"],
		},
	];

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Navbar */}
			<LandingNavbar isLoggedIn={!!session} />

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-6 py-12">
				<div className="mb-12">
					<h1 className="text-4xl font-bold mb-4">
						Evidence-Based Training Blog
					</h1>
					<p className="text-zinc-400 text-lg">
						Science-backed insights on training, programming, and performance
						for serious lifters
					</p>
				</div>

				{/* Blog Posts */}
				<div className="space-y-8">
					{blogPosts.map((post) => (
						<article
							key={post.id}
							className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
						>
							<div className="mb-4">
								<div className="flex items-center gap-4 text-sm text-zinc-400 mb-2">
									<span>
										{new Date(post.publishDate).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
									<span>•</span>
									<span>{post.readTime}</span>
								</div>
								<h2 className="text-2xl font-bold mb-3 text-white hover:text-blue-500 transition-colors">
									<Link href={`/blog/${post.id}`}>{post.title}</Link>
								</h2>
								<p className="text-zinc-400 leading-relaxed mb-4">
									{post.excerpt}
								</p>
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<Link href={`/blog/${post.id}`}>
								<Button variant="outline" size="sm">
									Read Article →
								</Button>
							</Link>
						</article>
					))}
				</div>

				{/* CTA Section - Only show if not logged in */}
				{!session && (
					<div className="mt-16 border border-zinc-800 p-12 rounded-xl bg-zinc-900/50 text-center">
						<h2 className="text-3xl font-bold mb-3">
							Ready to Apply These Principles?
						</h2>
						<p className="text-zinc-400 mb-6 text-lg">
							Use our AI-powered program generator to create science-based
							training programs
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
