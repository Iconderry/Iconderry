# Agent Guidelines & Workflow Rules for Iconderry

## Autonomous Execution & Direct Edits
- **Direct Edits & Updates**: The agent is authorized to proactively read, create, and edit code files, update styles, and build assets directly without requesting manual step-by-step confirmation.
- **Critical Action Confirmation**: Only pause to ask the user when performing destructive, irreversible actions (e.g. deleting important files, dropping databases, or killing critical production services).
- **Quality & Validation**: Always ensure changes compile cleanly (e.g. `npm run build`), maintain dark theme aesthetics, and follow high visual design standards.
