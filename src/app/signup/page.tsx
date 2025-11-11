"use client";

import { Lock, Mail, Terminal, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signUp, useSession } from "@/lib/auth-client";

export default function SignUpPage() {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Redirect if already logged in
	useEffect(() => {
		if (!isPending && session) {
			router.push("/app");
		}
	}, [session, isPending, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		// Validate password length
		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			await signUp.email(
				{
					name,
					email,
					password,
				},
				{
					onSuccess: () => {
						router.push("/app");
					},
					onError: (ctx) => {
						setError(ctx.error.message || "Failed to create account");
					},
				},
			);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-2 mb-4">
						<Terminal className="h-8 w-8 text-terminal-green" />
						<h1 className="text-2xl font-bold">CompileStrength</h1>
					</div>
					<p className="text-muted-foreground">Create your account</p>
				</div>

				{/* Signup Form */}
				<div className="bg-background-secondary border border-border rounded-lg p-6 shadow-lg">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Name */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-2">
								Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-terminal-green"
									placeholder="John Doe"
								/>
							</div>
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-2">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-terminal-green"
									placeholder="developer@example.com"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={8}
									className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-terminal-green"
									placeholder="••••••••"
								/>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Must be at least 8 characters
							</p>
						</div>

						{/* Confirm Password */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium mb-2"
							>
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									minLength={8}
									className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-terminal-green"
									placeholder="••••••••"
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-950/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-md text-sm">
								{error}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-terminal-green hover:bg-terminal-green-bright text-black font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating account..." : "Create Account"}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background-secondary px-2 text-muted-foreground">
								Already have an account?
							</span>
						</div>
					</div>

					{/* Sign In Link */}
					<Link
						href="/login"
						className="block text-center text-terminal-green hover:text-terminal-green-bright transition-colors"
					>
						Sign in to your account
					</Link>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted-foreground mt-8">
					By creating an account, you agree to our Terms of Service and Privacy
					Policy
				</p>
			</div>
		</div>
	);
}
