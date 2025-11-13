"use client";

import {
	BarChart3,
	CreditCard,
	Dumbbell,
	FolderOpen,
	Home,
	LineChart,
	LogOut,
	Settings,
	Sparkles,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { isValidSubscription } from "@/lib/subscription-utils";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Dashboard", href: "/app/dashboard", icon: Home },
	{
		name: "Program Generator",
		href: "/app/compiler",
		icon: Sparkles,
		badge: "AI",
	},
	{ name: "Workout Builder", href: "/app/workout-builder", icon: Wrench },
	{ name: "My Programs", href: "/app/programs", icon: FolderOpen },
	{ name: "Log Workout", href: "/app/log-workout", icon: Dumbbell },
	{ name: "Progress Tracker", href: "/app/gitgains", icon: LineChart },
	{ name: "Performance Analysis", href: "/app/debugger", icon: BarChart3 },
	{ name: "The Coach", href: "/app/coach", icon: User },
	{ name: "Settings", href: "/app/settings", icon: Settings },
];

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const [hasProSubscription, setHasProSubscription] = useState(false);

	// Check if user has an active subscription
	useEffect(() => {
		const checkSubscription = async () => {
			if (!session?.user) {
				setHasProSubscription(false);
				return;
			}

			try {
				const subscriptions = await getUserSubscriptions();
				const hasActive = subscriptions.some((sub) =>
					isValidSubscription(sub.status),
				);
				setHasProSubscription(hasActive);
			} catch (error) {
				console.error("Error checking subscription:", error);
				setHasProSubscription(false);
			}
		};

		checkSubscription();
	}, [session?.user]);

	const handleLogout = async () => {
		await signOut();
		router.push("/login");
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Sidebar collapsible="offcanvas">
			<SidebarHeader>
				<div className="flex h-16 items-center gap-2 px-4">
					<div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
						<span className="text-lg font-bold text-primary-foreground">
							CS
						</span>
					</div>
					<div className="flex flex-col group-data-[collapsible=icon]:hidden">
						<span className="text-sm font-semibold leading-none">
							CompileStrength
						</span>
						<span className="text-xs text-muted-foreground">v1.0.0</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map((item) => {
								const isActive = pathname === item.href;
								return (
									<SidebarMenuItem key={item.name}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											size="lg"
											className={cn(
												isActive && "border border-primary/50 glow-blue",
											)}
										>
											<Link href={item.href}>
												<item.icon className="h-6 w-6" />
												<span className="flex items-center gap-2">
													{item.name}
													{item.badge && (
														<Badge className="bg-primary text-[10px] px-1.5 py-0">
															{item.badge}
														</Badge>
													)}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="p-2">
					{isPending ? (
						<div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/50 text-primary-foreground animate-pulse">
								<span className="text-sm font-semibold">...</span>
							</div>
							<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
								<div className="h-4 bg-primary/20 rounded w-24 mb-2"></div>
								<div className="h-3 bg-primary/10 rounded w-32"></div>
							</div>
						</div>
					) : session?.user ? (
						<>
							<div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									<span className="text-sm font-semibold">
										{getInitials(session.user.name)}
									</span>
								</div>
								<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
									<div className="flex items-center gap-2">
										<p className="truncate text-sm font-medium">
											{session.user.name}
										</p>
										{hasProSubscription && (
											<Badge className="bg-primary text-[10px] px-1.5 py-0">
												Pro
											</Badge>
										)}
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								className="mt-2 w-full justify-start text-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10"
								size="sm"
								onClick={handleLogout}
							>
								<LogOut className="h-5 w-5" />
								<span className="group-data-[collapsible=icon]:sr-only">
									Logout
								</span>
							</Button>
						</>
					) : null}
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
