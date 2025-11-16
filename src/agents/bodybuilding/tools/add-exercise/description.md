# Add Exercise Tool

## Purpose

Adds a new exercise to a specific workout day within an existing routine.

## When to Use

- When user wants to add a single exercise to a specific day
- When customizing or expanding existing workout days
- When user requests specific exercise additions after routine creation

## Input

- **dayName**: Name of the workout day to add the exercise to
- **exercise**: Exercise object containing:
  - name, muscleGroups, equipment, sets, reps, restPeriod
  - Optional: weight, notes

## Output

Returns success confirmation with the exercise added to the specified day.
