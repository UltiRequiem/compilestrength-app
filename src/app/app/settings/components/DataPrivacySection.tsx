import { Download, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataPrivacySection() {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Data & Privacy
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between rounded-lg border border-border p-4">
					<div>
						<p className="font-semibold">Download Your Data</p>
						<p className="text-sm text-muted-foreground">
							Export all your workout data
						</p>
					</div>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4" />
						Download
					</Button>
				</div>

				<div className="flex items-center justify-between rounded-lg border border-border p-4">
					<div>
						<p className="font-semibold">Privacy Settings</p>
						<p className="text-sm text-muted-foreground">
							Control who can see your profile
						</p>
					</div>
					<Button variant="outline" size="sm">
						Manage
					</Button>
				</div>

				<div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
					<div className="mb-3 flex items-start gap-3">
						<Trash2 className="h-5 w-5 text-destructive" />
						<div>
							<p className="font-semibold text-destructive">Delete Account</p>
							<p className="text-sm text-muted-foreground">
								Permanently delete your account and all data. This action cannot
								be undone.
							</p>
						</div>
					</div>
					<Button variant="destructive" size="sm">
						Delete Account
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
