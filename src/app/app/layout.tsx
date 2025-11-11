import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	void (await requireAuth());

	return <>{children}</>;
}
