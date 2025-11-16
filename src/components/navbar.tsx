"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/shared/mobile-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="border-b border-zinc-800 px-4 sm:px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link href="/" className="text-lg sm:text-xl font-bold shrink-0">
					<span className="text-blue-500">Compile</span>
					<span className="text-white">Strength</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-4">
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
							<Button size="sm" className="shrink-0">
								Dashboard
							</Button>
						</Link>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login">
								<Button variant="outline" size="sm" className="shrink-0">
									Sign In
								</Button>
							</Link>
							<Link href="/signup">
								<Button size="sm" className="shrink-0">
									Sign Up
								</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Menu */}
				<MobileMenu isLoggedIn={!!session} />
			</div>
		</nav>
	);
}
