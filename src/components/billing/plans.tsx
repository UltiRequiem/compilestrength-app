import { syncPlans } from "@/app/actions/lemonsqueezy";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { Plan } from "./plan";

type NewPlan = typeof plans.$inferSelect;

export async function Plans() {
	let allPlans: NewPlan[] = await db.select().from(plans);

	// If there are no plans in the database, sync them from Lemon Squeezy.
	if (!allPlans.length) {
		allPlans = await syncPlans();
	}

	if (!allPlans.length) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">No plans available.</p>
			</div>
		);
	}

	// Sort plans by sort field
	const sortedPlans = allPlans.sort((a, b) => {
		if (a.sort === null || b.sort === null) return 0;
		return (a.sort ?? 0) - (b.sort ?? 0);
	});

	return (
		<div>
			<h2 className="text-2xl font-bold mb-6">Available Plans</h2>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sortedPlans.map((plan) => (
					<Plan key={plan.id} plan={plan} />
				))}
			</div>
		</div>
	);
}
