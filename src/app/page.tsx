import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Flame,
  TrendingUp,
  Calendar,
  Play,
  Sparkles,
  Bug,
} from "lucide-react";

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const weekDays = [
    { day: "Mon", workout: "Push Day A", status: "completed" },
    { day: "Tue", workout: "Pull Day A", status: "completed" },
    { day: "Wed", workout: "Rest", status: "completed" },
    { day: "Thu", workout: "Legs Day A", status: "today" },
    { day: "Fri", workout: "Upper Power", status: "upcoming" },
    { day: "Sat", workout: "Lower Power", status: "upcoming" },
    { day: "Sun", workout: "Rest", status: "upcoming" },
  ];

  const recentActivity = [
    {
      exercise: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 225,
      date: "2 hours ago",
    },
    {
      exercise: "Barbell Row",
      sets: 4,
      reps: 10,
      weight: 185,
      date: "2 hours ago",
    },
    {
      exercise: "Overhead Press",
      sets: 3,
      reps: 8,
      weight: 135,
      date: "2 hours ago",
    },
    { exercise: "Squat", sets: 5, reps: 5, weight: 315, date: "Yesterday" },
    {
      exercise: "Deadlift",
      sets: 3,
      reps: 5,
      weight: 405,
      date: "2 days ago",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, John</h1>
            <p className="text-muted-foreground">{today}</p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover glow-green-hover border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Workouts
                </CardTitle>
                <Dumbbell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold terminal-text text-primary">
                  47
                </div>
                <p className="text-xs text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover glow-green-hover border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Streak
                </CardTitle>
                <Flame className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold terminal-text text-primary">
                  12 days
                </div>
                <p className="text-xs text-muted-foreground">
                  Personal best: 21 days
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover glow-green-hover border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last PR</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold terminal-text text-primary">
                  Squat 315 lbs
                </div>
                <p className="text-xs text-muted-foreground">
                  +10 lbs from previous
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover glow-green-hover border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Workout
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold terminal-text text-primary">
                  Push Day A
                </div>
                <p className="text-xs text-muted-foreground">Today, 6:00 PM</p>
              </CardContent>
            </Card>
          </div>

          {/* This Week's Program */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">This Week&apos;s Program</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
              {weekDays.map((item) => (
                <Card
                  key={item.day}
                  className={`card-hover ${
                    item.status === "today"
                      ? "border-primary glow-green"
                      : item.status === "completed"
                        ? "border-muted opacity-60"
                        : ""
                  }`}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-semibold">
                      {item.day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {item.workout}
                    </p>
                    <div className="mt-2">
                      {item.status === "completed" && (
                        <Badge variant="secondary" className="text-[10px]">
                          ✓ Done
                        </Badge>
                      )}
                      {item.status === "today" && (
                        <Badge className="bg-primary text-[10px]">
                          Today
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
              <Card className="border-primary/20">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{activity.exercise}</p>
                          <p className="text-sm text-muted-foreground terminal-text">
                            {activity.sets} × {activity.reps} @ {activity.weight}{" "}
                            lbs
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start text-left h-auto py-4">
                  <Sparkles className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-semibold">Generate New Program</div>
                    <div className="text-xs opacity-80">
                      Let AI create a custom workout plan
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 border-primary/50 hover:bg-primary/10"
                >
                  <Play className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">Log Today&apos;s Workout</div>
                    <div className="text-xs opacity-80">
                      Start tracking your session
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 border-primary/50 hover:bg-primary/10"
                >
                  <Bug className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">Run Gains Debugger</div>
                    <div className="text-xs opacity-80">
                      Analyze your progress and find issues
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
