import { requireAuth } from "@/lib/auth-utils";
import { CompilerLayout } from "./components/CompilerLayout";

export default async function CompilerPage() {
	await requireAuth();

	return <CompilerLayout />;
}
