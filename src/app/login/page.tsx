"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Lock, Mail } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn.email(
				{
					email,
					password,
				},
				{
					onSuccess: () => {
						router.push("/");
					},
					onError: (ctx) => {
						setError(ctx.error.message || "Failed to sign in");
					},
				},
			);
		} catch (err) {
			console.error("Sign in error:", err);
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
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
					<p className="text-muted-foreground">Sign in to your account</p>
				</div>

				{/* Login Form */}
				<div className="bg-background-secondary border border-border rounded-lg p-6 shadow-lg">
					<form onSubmit={handleSubmit} className="space-y-4">
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
							<label htmlFor="password" className="block text-sm font-medium mb-2">
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
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background-secondary px-2 text-muted-foreground">
								New here?
							</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<Link
						href="/signup"
						className="block text-center text-terminal-green hover:text-terminal-green-bright transition-colors"
					>
						Create an account
					</Link>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted-foreground mt-8">
					By signing in, you agree to our Terms of Service and Privacy Policy
				</p>
			</div>
		</div>
	);
}
