"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Heart,
  Target,
  Clock,
  CheckCircle,
  Circle,
  Loader2,
} from "lucide-react";

export default function WorkoutBuilderPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [trainingDays, setTrainingDays] = useState(4);

  const goals = [
    {
      id: "strength",
      name: "Strength",
      icon: Dumbbell,
      description: "Build maximum strength on big lifts",
    },
    {
      id: "hypertrophy",
      name: "Hypertrophy",
      icon: Target,
      description: "Gain muscle mass and size",
    },
    {
      id: "powerlifting",
      name: "Powerlifting",
      icon: Dumbbell,
      description: "Maximize squat, bench, deadlift",
    },
    {
      id: "fitness",
      name: "General Fitness",
      icon: Heart,
      description: "Balanced strength and conditioning",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const steps = [
    { number: 1, name: "Goals" },
    { number: 2, name: "Experience" },
    { number: 3, name: "Schedule" },
    { number: 4, name: "Preferences" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Workout Builder</h1>
              <p className="text-muted-foreground">
                Generate your custom AI-powered training program
              </p>
            </div>

            {/* Progress Indicator */}
            {!isGenerating && (
              <div className="mb-8 flex justify-between">
                {steps.map((s) => (
                  <div key={s.number} className="flex items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step > s.number
                            ? "border-primary bg-primary text-primary-foreground"
                            : step === s.number
                              ? "border-primary text-primary"
                              : "border-muted text-muted-foreground"
                        }`}
                      >
                        {step > s.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{s.number}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step >= s.number
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>
                    {s.number < 4 && (
                      <div
                        className={`mx-4 h-0.5 w-16 ${
                          step > s.number ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <Card className="border-primary/50 glow-green">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <p className="terminal-text font-semibold">
                        Analyzing your goals...
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <p className="terminal-text font-semibold">
                        Compiling exercise selection...
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <p className="terminal-text font-semibold">
                        Optimizing volume and frequency...
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-primary">
                      <CheckCircle className="h-5 w-5" />
                      <p className="terminal-text font-semibold">
                        Program generated successfully ✓
                      </p>
                    </div>
                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full w-3/4 bg-primary transition-all duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Goals */}
            {step === 1 && !isGenerating && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What are your training goals?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {goals.map((goal) => (
                        <Card
                          key={goal.id}
                          className={`cursor-pointer card-hover ${
                            selectedGoal === goal.id
                              ? "border-primary glow-green"
                              : "border-border"
                          }`}
                          onClick={() => setSelectedGoal(goal.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <goal.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{goal.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {goal.description}
                                </p>
                              </div>
                              {selectedGoal === goal.id && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedGoal}
                    size="lg"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && !isGenerating && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tell us about your lifting experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Years of training</Label>
                      <Input type="number" placeholder="e.g., 3" />
                    </div>

                    <div className="space-y-3">
                      <Label>Current PRs (optional)</Label>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Squat
                          </Label>
                          <Input placeholder="315 lbs" />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Bench
                          </Label>
                          <Input placeholder="225 lbs" />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Deadlift
                          </Label>
                          <Input placeholder="405 lbs" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} size="lg">
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && !isGenerating && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How many days can you train?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-4 gap-3">
                      {[3, 4, 5, 6].map((days) => (
                        <Card
                          key={days}
                          className={`cursor-pointer card-hover ${
                            trainingDays === days
                              ? "border-primary glow-green"
                              : ""
                          }`}
                          onClick={() => setTrainingDays(days)}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <span className="text-3xl font-bold terminal-text text-primary">
                              {days}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              days/week
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label>Session length</Label>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {["45min", "60min", "90min", "120min"].map((time) => (
                          <Button key={time} variant="outline">
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(2)} variant="outline">
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)} size="lg">
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && !isGenerating && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customize your program</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Equipment available</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Barbell",
                          "Dumbbells",
                          "Machines",
                          "Cables",
                          "Bands",
                        ].map((equipment) => (
                          <Badge
                            key={equipment}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          >
                            {equipment}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Select Coach Persona</Label>
                      <div className="space-y-2">
                        {[
                          {
                            name: "Powerlifting Coach",
                            desc: "Focus on the big 3",
                          },
                          {
                            name: "Bodybuilding Coach",
                            desc: "Hypertrophy emphasis",
                          },
                          {
                            name: "Strength Coach",
                            desc: "Balanced approach",
                          },
                        ].map((coach) => (
                          <Card
                            key={coach.name}
                            className="cursor-pointer card-hover"
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div>
                                <p className="font-semibold">{coach.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {coach.desc}
                                </p>
                              </div>
                              <Circle className="h-5 w-5" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(3)} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleGenerate} size="lg" className="px-8">
                    Generate Program
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
