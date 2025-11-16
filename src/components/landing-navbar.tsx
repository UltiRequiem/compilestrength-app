"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface LandingNavbarProps {
	isLoggedIn: boolean;
}

export function LandingNavbar({ isLoggedIn }: LandingNavbarProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
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
					{isLoggedIn ? (
						<Link href="/app/dashboard">
							<Button size="sm" className="shrink-0">
								Dashboard
							</Button>
						</Link>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login">
								<Button
									variant="outline"
									size="sm"
									className="shrink-0"
								>
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

				{/* Mobile Menu Button */}
				<div className="md:hidden relative">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
						className="p-2"
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>

					{/* Mobile Dropdown Menu */}
					{mobileMenuOpen && (
						<div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-50">
							<div className="py-2">
								<Link
									href="/tools"
									className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									Tools
								</Link>
								<Link
									href="/blog"
									className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									Blog
								</Link>
								<div className="border-t border-zinc-800 my-2"></div>
								{isLoggedIn ? (
									<Link
										href="/app/dashboard"
										onClick={() => setMobileMenuOpen(false)}
									>
										<div className="px-4 py-2">
											<Button size="sm" className="w-full">
												Dashboard
											</Button>
										</div>
									</Link>
								) : (
									<div className="px-4 py-4">
										<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
											<Button variant="outline" size="sm" className="w-full mb-3">
												Sign In
											</Button>
										</Link>
										<Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
											<Button size="sm" className="w-full">
												Sign Up
											</Button>
										</Link>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}