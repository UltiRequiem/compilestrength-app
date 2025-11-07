"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home" },
		{ href: "/compile-strength", label: "Compile Strength" },
		{ href: "/debug-gains", label: "Debug Gains" },
		{ href: "/commit-training", label: "Commit Training" },
	];

	return (
		<header className="border-b">
			<div className="container mx-auto px-4 py-4">
				<NavigationMenu>
					<NavigationMenuList>
						{navItems.map((item) => (
							<NavigationMenuItem key={item.href}>
								<Link href={item.href} legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
										active={pathname === item.href}
									>
										{item.label}
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</header>
	);
}
