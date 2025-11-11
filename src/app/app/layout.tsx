import { AppLayout } from "@/components/layout/app-layout";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	void (await requireAuth());

	return <AppLayout>{children}</AppLayout>;
}
