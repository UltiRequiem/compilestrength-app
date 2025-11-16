# Set Generation Progress Tool

## Purpose

Updates the progress of routine generation to provide real-time feedback to
users during routine creation.

## When to Use

- During long routine generation processes
- To show users the steps being taken to create their routine
- To provide transparency in the AI's decision-making process
- When creating complex routines that require multiple steps

## Input

- **steps**: Array of step objects, each containing:
  - **step**: Name of the step
  - **description**: Description of what's being done
  - **completed**: Whether this step is completed

## Output

Returns confirmation that progress has been updated. The progress is typically
displayed in the UI to keep users engaged during routine generation.
