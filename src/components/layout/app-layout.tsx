"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<main className="flex min-h-screen flex-1 flex-col md:peer-data-[state=collapsed]:ml-12 md:peer-data-[state=expanded]:ml-64 transition-[margin-left] ease-linear duration-200">
				<header className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6 border-b border-sidebar-border lg:hidden">
					<SidebarTrigger />
					<div className="h-4 w-px bg-sidebar-border" />
					<h1 className="font-semibold text-sm sm:text-base">
						CompileStrength
					</h1>
				</header>
				<div className="flex-1 grid-background p-4 sm:p-6 lg:p-8">
					<div className="hidden lg:block mb-4">
						<SidebarTrigger />
					</div>
					{children}
				</div>
			</main>
		</SidebarProvider>
	);
}
