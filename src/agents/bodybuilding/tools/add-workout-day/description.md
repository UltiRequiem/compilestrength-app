# Add Workout Day Tool

## Purpose

Adds a new workout day to an existing routine. Used for expanding or modifying
routines after initial creation.

## When to Use

- When user wants to add an extra training day to their routine
- When expanding a routine (e.g., from 3 days to 4 days)
- When creating specialized training days (e.g., adding an arm day)

## Input

- **name**: Name of the workout day (e.g., "Push Day", "Pull Day", "Arms & Abs")
- **exercises**: Array of exercises for this day, each containing:
  - name, muscleGroups, equipment, sets, reps, restPeriod
  - Optional: weight, notes

## Output

Returns a WorkoutDay object with generated ID and properly ordered exercises.
