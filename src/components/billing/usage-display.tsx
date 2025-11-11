import { getCurrentUsage } from "@/app/actions/usage-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function UsageDisplay() {
	const usage = await getCurrentUsage();

	if (!usage) {
		return null;
	}

	const compilePercentage = (usage.compilesUsed / usage.compilesLimit) * 100;
	const editPercentage =
		(usage.routineEditsUsed / usage.routineEditsLimit) * 100;
	const messagePercentage =
		(usage.aiMessagesUsed / usage.aiMessagesLimit) * 100;

	const resetsAt = new Date(usage.periodEnd).toLocaleDateString();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Usage This Week</CardTitle>
				<p className="text-sm text-muted-foreground">Resets on {resetsAt}</p>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>Compiles</span>
						<span className="text-muted-foreground">
							{usage.compilesUsed} / {usage.compilesLimit}
						</span>
					</div>
					<Progress value={compilePercentage} />
				</div>

				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>Routine Edits</span>
						<span className="text-muted-foreground">
							{usage.routineEditsUsed} / {usage.routineEditsLimit}
						</span>
					</div>
					<Progress value={editPercentage} />
				</div>

				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>AI Messages</span>
						<span className="text-muted-foreground">
							{usage.aiMessagesUsed} / {usage.aiMessagesLimit}
						</span>
					</div>
					<Progress value={messagePercentage} />
				</div>
			</CardContent>
		</Card>
	);
}
