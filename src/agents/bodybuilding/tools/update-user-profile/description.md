# Update User Profile Tool

## Purpose

Updates or sets the user's profile information including training experience,
goals, available equipment, time constraints, physical limitations, and exercise
preferences.

## When to Use

- At the beginning of a conversation to gather user information
- When user mentions changes to their goals, experience level, or constraints
- When collecting missing information needed for routine creation

## Input

- **experience**: Training experience level (beginner/intermediate/advanced)
- **goals**: Array of training goals (muscle_gain, strength, fat_loss, etc.)
- **availableEquipment**: Array of available equipment
- **timeConstraints**: Object with daysPerWeek and minutesPerSession
- **physicalLimitations**: Optional array of injuries or limitations
- **preferences**: Optional object with favorite exercises and exercises to
  avoid

## Output

Returns success confirmation with updated profile information and a summary
message.
