export default function HomePage() {
	return (
		<div className="container">
			<h1 className="text-4xl font-bold mb-4">Welcome to Compile Strength</h1>
			<p className="text-muted-foreground mb-8">
				Your developer fitness toolkit - build strength through code
			</p>

			<div className="grid gap-6 md:grid-cols-3">
				<div className="border rounded-lg p-6">
					<h2 className="text-2xl font-semibold mb-2">Compile Strength</h2>
					<p className="text-muted-foreground">Build your codebase muscles</p>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-2xl font-semibold mb-2">Debug Gains</h2>
					<p className="text-muted-foreground">
						Level up your debugging skills
					</p>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-2xl font-semibold mb-2">Commit Training</h2>
					<p className="text-muted-foreground">
						Master your version control workflow
					</p>
				</div>
			</div>
		</div>
	);
}
