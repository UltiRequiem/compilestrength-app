"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Clock,
  Play,
  Pause,
  Plus,
  Edit,
  X,
} from "lucide-react";

export default function LogWorkoutPage() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const exercises = [
    {
      id: 1,
      name: "Bench Press",
      target: "4 sets × 6-8 reps @ RPE 8",
      lastTime: "185 lbs × 8, 8, 7, 7",
      sets: [
        { number: 1, weight: 185, reps: 8, rpe: 8, completed: true },
        { number: 2, weight: 185, reps: 8, rpe: 8, completed: true },
        { number: 3, weight: 185, reps: null, rpe: null, completed: false },
        { number: 4, weight: 185, reps: null, rpe: null, completed: false },
      ],
    },
    {
      id: 2,
      name: "Barbell Row",
      target: "4 sets × 8-10 reps @ RPE 8",
      lastTime: "155 lbs × 10, 10, 9, 8",
      sets: [
        { number: 1, weight: 155, reps: null, rpe: null, completed: false },
        { number: 2, weight: 155, reps: null, rpe: null, completed: false },
        { number: 3, weight: 155, reps: null, rpe: null, completed: false },
        { number: 4, weight: 155, reps: null, rpe: null, completed: false },
      ],
    },
  ];

  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    Day 1: Upper Power - In Progress
                  </h1>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="terminal-text text-lg text-primary">
                        {formatTime(elapsedTime)}
                      </span>
                    </div>
                    {isResting && restTimer !== null && (
                      <Badge className="animate-pulse bg-primary text-lg px-3 py-1">
                        Rest: {formatTime(restTimer)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline">
                    <X className="h-4 w-4" />
                    Exit
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedSets}/{totalSets} sets complete
                  </span>
                  <span className="text-muted-foreground">
                    Est. {Math.ceil((totalSets - completedSets) * 3)} min remaining
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(completedSets / totalSets) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="space-y-6">
              {exercises.map((exercise, exerciseIdx) => (
                <Card
                  key={exercise.id}
                  className={`border-primary/20 ${
                    exerciseIdx === 0 ? "border-primary glow-green" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3">
                          {exercise.sets.every((s) => s.completed) ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                          {exercise.name}
                        </CardTitle>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Target: {exercise.target}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last time: {exercise.lastTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Sets Table */}
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-2 text-left font-semibold w-16">
                                Set
                              </th>
                              <th className="p-2 text-left font-semibold">
                                Weight (lbs)
                              </th>
                              <th className="p-2 text-left font-semibold">
                                Reps
                              </th>
                              <th className="p-2 text-left font-semibold">
                                RPE
                              </th>
                              <th className="p-2 text-left font-semibold w-24">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {exercise.sets.map((set) => (
                              <tr
                                key={set.number}
                                className={`${
                                  set.completed
                                    ? "bg-primary/5"
                                    : "hover:bg-accent/50"
                                } transition-colors`}
                              >
                                <td className="p-2 font-semibold">
                                  {set.number}
                                </td>
                                <td className="p-2">
                                  {set.completed ? (
                                    <span className="terminal-text text-primary">
                                      {set.weight}
                                    </span>
                                  ) : (
                                    <Input
                                      type="number"
                                      className="h-8 w-20"
                                      defaultValue={set.weight}
                                    />
                                  )}
                                </td>
                                <td className="p-2">
                                  {set.completed ? (
                                    <span className="terminal-text text-primary">
                                      {set.reps}
                                    </span>
                                  ) : (
                                    <Input
                                      type="number"
                                      className="h-8 w-16"
                                      placeholder="0"
                                    />
                                  )}
                                </td>
                                <td className="p-2">
                                  {set.completed ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {set.rpe}
                                    </Badge>
                                  ) : (
                                    <Input
                                      type="number"
                                      className="h-8 w-16"
                                      placeholder="1-10"
                                      max={10}
                                      min={1}
                                    />
                                  )}
                                </td>
                                <td className="p-2">
                                  {set.completed ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button size="sm" className="h-8">
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startRest(150)}
                        >
                          <Clock className="h-3 w-3" />
                          Rest 2:30
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3" />
                          Add Set
                        </Button>
                        <div className="flex-1" />
                        <Button variant="outline" size="sm">
                          -5 lbs
                        </Button>
                        <Button variant="outline" size="sm">
                          +5 lbs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Finish Workout */}
            <Card className="mt-8 border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Ready to finish?</h3>
                    <p className="text-sm text-muted-foreground">
                      Save your workout and view summary
                    </p>
                  </div>
                  <Button size="lg">Finish Workout</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
