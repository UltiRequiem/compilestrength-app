"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  Calendar,
  Activity,
  Award,
} from "lucide-react";

export default function GitGainsPage() {
  const commits = [
    {
      id: 1,
      date: "Nov 7, 2024",
      time: "6:30 PM",
      type: "Upper Power",
      message: "Upper Power - 12 sets, 8,450 lbs volume",
      prs: ["Bench Press 225 lbs × 8"],
    },
    {
      id: 2,
      date: "Nov 6, 2024",
      time: "5:45 PM",
      type: "Lower Power",
      message: "Lower Power - 16 sets, 12,300 lbs volume",
      prs: [],
    },
    {
      id: 3,
      date: "Nov 5, 2024",
      time: "7:00 PM",
      type: "Push Day",
      message: "Push Day A - 10 sets, 6,800 lbs volume",
      prs: [],
    },
    {
      id: 4,
      date: "Nov 4, 2024",
      time: "6:15 PM",
      type: "Pull Day",
      message: "Pull Day A - 11 sets, 7,200 lbs volume",
      prs: ["Barbell Row 185 lbs × 10"],
    },
  ];

  const prs = [
    {
      exercise: "Squat",
      record: "315 lbs × 5",
      date: "Nov 4, 2024",
      hasVideo: true,
    },
    {
      exercise: "Bench Press",
      record: "225 lbs × 8",
      date: "Nov 7, 2024",
      hasVideo: false,
    },
    {
      exercise: "Deadlift",
      record: "405 lbs × 3",
      date: "Nov 1, 2024",
      hasVideo: true,
    },
    {
      exercise: "Overhead Press",
      record: "155 lbs × 6",
      date: "Oct 28, 2024",
      hasVideo: false,
    },
    {
      exercise: "Barbell Row",
      record: "185 lbs × 10",
      date: "Nov 4, 2024",
      hasVideo: false,
    },
    {
      exercise: "Pull-ups",
      record: "BW+45 lbs × 8",
      date: "Oct 30, 2024",
      hasVideo: false,
    },
  ];

  const insights = [
    {
      title: "Most Improved Exercise",
      value: "Deadlift +15%",
      period: "in 3 months",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Longest Streak",
      value: "21 days",
      period: "consecutive training",
      icon: Award,
      color: "text-primary",
    },
    {
      title: "Total Volume This Month",
      value: "485,000 lbs",
      period: "+12% from last month",
      icon: Activity,
      color: "text-primary",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">GitGains</h1>
                <p className="text-muted-foreground">
                  Your Training History & Progress
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {insights.map((insight, idx) => (
                <Card key={idx} className="card-hover border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <insight.icon className={`h-6 w-6 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {insight.title}
                        </p>
                        <p className="text-2xl font-bold terminal-text text-primary">
                          {insight.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {insight.period}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Commits Timeline */}
              <div className="lg:col-span-2">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Commit History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {commits.map((commit, idx) => (
                        <div key={commit.id} className="flex gap-4">
                          {/* Git-style line and dot */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-3 w-3 rounded-full border-2 ${
                                commit.prs.length > 0
                                  ? "border-primary bg-primary"
                                  : "border-muted bg-background"
                              }`}
                            />
                            {idx < commits.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border mt-2" />
                            )}
                          </div>

                          {/* Commit content */}
                          <Card className="flex-1 card-hover">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="mb-2 flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {commit.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {commit.date} at {commit.time}
                                    </span>
                                  </div>
                                  <p className="font-semibold terminal-text">
                                    {commit.message}
                                  </p>
                                  {commit.prs.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <Star className="h-4 w-4 text-primary" />
                                      <span className="text-sm text-primary">
                                        PR: {commit.prs[0]}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="mt-4 w-full">
                      Load More
                    </Button>
                  </CardContent>
                </Card>

                {/* Main Chart Section */}
                <Card className="mt-8 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Progress Chart</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Weight
                        </Button>
                        <Button variant="ghost" size="sm">
                          Volume
                        </Button>
                        <Button variant="ghost" size="sm">
                          1RM
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground">
                        Chart visualization would go here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Exercise Details & PRs */}
              <div className="space-y-8">
                {/* Exercise Selector */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Exercise Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Bench Press</option>
                      <option>Squat</option>
                      <option>Deadlift</option>
                      <option>Overhead Press</option>
                    </select>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current 1RM Estimate
                        </p>
                        <p className="text-2xl font-bold terminal-text text-primary">
                          275 lbs
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          All-time PR
                        </p>
                        <p className="text-lg font-bold terminal-text">
                          225 lbs × 8
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Nov 7, 2024
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last 30 Days
                        </p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <p className="text-lg font-bold text-primary">+8.5%</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      See Full History
                    </Button>
                  </CardContent>
                </Card>

                {/* Personal Records */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Personal Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prs.map((pr, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between rounded-lg border border-border p-3 card-hover"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-primary" />
                              <p className="font-semibold">{pr.exercise}</p>
                            </div>
                            <p className="mt-1 text-sm terminal-text text-primary">
                              {pr.record}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {pr.date}
                            </p>
                          </div>
                          {pr.hasVideo && (
                            <Button variant="ghost" size="sm">
                              <Activity className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        All Time
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        This Year
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        This Month
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
