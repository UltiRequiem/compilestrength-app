"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { Home, Zap, Bug, GitCommit } from "lucide-react";

const navItems = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/compile-strength", label: "Compile Strength", icon: Zap },
	{ href: "/debug-gains", label: "Debug Gains", icon: Bug },
	{ href: "/commit-training", label: "Commit Training", icon: GitCommit },
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex items-center justify-between gap-2 px-2 py-1">
					<div className="flex items-center gap-2">
						<Zap className="h-6 w-6" />
						<span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
							Compile Strength
						</span>
					</div>
					<SidebarTrigger />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Utilities</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const Icon = item.icon;
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.href}
										>
											<Link href={item.href}>
												<Icon className="h-4 w-4" />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
