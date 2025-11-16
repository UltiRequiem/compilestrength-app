# Create Workout Routine Tool

## Purpose

Creates a complete workout routine based on user profile and goals. This is the
main tool for generating comprehensive training programs.

## When to Use

- After gathering sufficient user information via updateUserProfile
- When creating a completely new routine from scratch
- When user requests a full program rather than individual modifications

## Input

- **name**: Name of the workout routine
- **description**: Optional brief description of the routine
- **days**: Array of workout days with exercises
- **frequency**: Training frequency per week (1-7)
- **duration**: Program duration in weeks (minimum 4)
- **difficulty**: Routine difficulty level (beginner/intermediate/advanced)
- **goals**: Array of primary goals for the routine

## Output

Returns a complete WorkoutRoutine object with generated IDs and metadata. The
routine automatically appears in the right panel for the user to view.

## Important Notes

- DO NOT write out the full routine details in chat after using this tool
- The routine is automatically displayed in the UI
- Focus on providing high-level summaries and explanations in the chat response
