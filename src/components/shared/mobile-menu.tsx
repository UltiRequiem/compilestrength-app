"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
	isLoggedIn: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
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
	);
}
