"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  RefreshCw,
  Download,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ProgramsPage() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const program = {
    name: "Powerlifting Coach's 4-Day Upper/Lower Split",
    generated: "Nov 7, 2024",
    goal: "Hypertrophy",
    weeks: 4,
  };

  const days = [
    {
      id: 1,
      name: "Day 1: Upper Power",
      exercises: [
        { name: "Bench Press", sets: "4 x 6-8", rpe: "RPE 8", rest: "3min" },
        { name: "Barbell Row", sets: "4 x 8-10", rpe: "RPE 8", rest: "2.5min" },
        {
          name: "Overhead Press",
          sets: "3 x 8-10",
          rpe: "RPE 8",
          rest: "2min",
        },
        { name: "Pull-ups", sets: "3 x 8-12", rpe: "RPE 7", rest: "2min" },
        { name: "Dumbbell Curl", sets: "3 x 10-12", rpe: "RPE 7", rest: "90s" },
      ],
    },
    {
      id: 2,
      name: "Day 2: Lower Power",
      exercises: [
        { name: "Squat", sets: "4 x 5-6", rpe: "RPE 8", rest: "4min" },
        { name: "Romanian Deadlift", sets: "4 x 8-10", rpe: "RPE 8", rest: "3min" },
        { name: "Leg Press", sets: "3 x 10-12", rpe: "RPE 8", rest: "2min" },
        { name: "Leg Curl", sets: "3 x 10-12", rpe: "RPE 7", rest: "90s" },
        { name: "Calf Raise", sets: "4 x 12-15", rpe: "RPE 7", rest: "60s" },
      ],
    },
    {
      id: 3,
      name: "Day 3: Upper Hypertrophy",
      exercises: [
        { name: "Incline Bench", sets: "4 x 10-12", rpe: "RPE 7", rest: "2min" },
        {
          name: "Cable Row",
          sets: "4 x 12-15",
          rpe: "RPE 7",
          rest: "90s",
        },
        { name: "Dumbbell Press", sets: "3 x 10-12", rpe: "RPE 7", rest: "90s" },
        { name: "Lat Pulldown", sets: "3 x 12-15", rpe: "RPE 7", rest: "90s" },
        { name: "Face Pull", sets: "3 x 15-20", rpe: "RPE 6", rest: "60s" },
      ],
    },
    {
      id: 4,
      name: "Day 4: Lower Hypertrophy",
      exercises: [
        { name: "Front Squat", sets: "4 x 8-10", rpe: "RPE 7", rest: "2.5min" },
        { name: "Deadlift", sets: "3 x 6-8", rpe: "RPE 8", rest: "3min" },
        { name: "Walking Lunge", sets: "3 x 12/leg", rpe: "RPE 7", rest: "2min" },
        { name: "Leg Extension", sets: "3 x 12-15", rpe: "RPE 7", rest: "90s" },
        { name: "Seated Calf Raise", sets: "4 x 15-20", rpe: "RPE 7", rest: "60s" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{program.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    Generated on {program.generated} | For: {program.goal} Goal
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4" />
                    Start Program
                  </Button>
                </div>
              </div>

              {/* Week Tabs */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((week) => (
                  <Button
                    key={week}
                    variant={activeWeek === week ? "default" : "outline"}
                    onClick={() => setActiveWeek(week)}
                    size="sm"
                  >
                    Week {week}
                  </Button>
                ))}
              </div>
            </div>

            {/* Day Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {days.map((day) => (
                <Card
                  key={day.id}
                  className="card-hover border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{day.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedDay(expandedDay === day.id ? null : day.id)
                        }
                      >
                        {expandedDay === day.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expandedDay === day.id ? (
                      <div className="space-y-4">
                        {/* Full Exercise Details */}
                        <div className="rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="p-2 text-left font-semibold">
                                  Exercise
                                </th>
                                <th className="p-2 text-left font-semibold">
                                  Sets × Reps
                                </th>
                                <th className="p-2 text-left font-semibold">
                                  Intensity
                                </th>
                                <th className="p-2 text-left font-semibold">
                                  Rest
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {day.exercises.map((exercise, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-accent/50 transition-colors"
                                >
                                  <td className="p-2 font-medium">
                                    {exercise.name}
                                  </td>
                                  <td className="p-2 terminal-text text-primary">
                                    {exercise.sets}
                                  </td>
                                  <td className="p-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {exercise.rpe}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-muted-foreground">
                                    {exercise.rest}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button className="w-full">
                          <Play className="h-4 w-4" />
                          Start Workout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Collapsed View */}
                        {day.exercises.slice(0, 3).map((exercise, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {exercise.name}
                            </span>
                            <span className="terminal-text text-primary">
                              {exercise.sets}
                            </span>
                          </div>
                        ))}
                        {day.exercises.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{day.exercises.length - 3} more exercises
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                        >
                          Log This Workout
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Program Notes */}
            <Card className="mt-8 border-primary/50">
              <CardHeader>
                <CardTitle>Program Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 terminal-text text-sm text-primary">
                  <p>
                    <span className="text-muted-foreground">{">"}</span> This is a
                    4-day upper/lower split focused on building muscle mass
                    through progressive overload.
                  </p>
                  <p>
                    <span className="text-muted-foreground">{">"}</span> Progression
                    Scheme: Increase weight when you can hit the top of the rep
                    range for all sets.
                  </p>
                  <p>
                    <span className="text-muted-foreground">{">"}</span> Deload Week:
                    Week 4 - reduce weight by 20% and focus on technique.
                  </p>
                  <p>
                    <span className="text-muted-foreground">{">"}</span> Rest
                    between sessions: Ensure at least 1 day between upper/lower
                    workouts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
