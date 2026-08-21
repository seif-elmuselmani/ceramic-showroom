---
name: Ceramic Showroom AI Instructions
description: Enforces the AI to read the internal project handbook and understand the architecture before modifying code.
---

# 🛑 STOP AND READ

You are an AI working on the **Ceramic Showroom Platform**. Before you make any edits or suggest any changes to the user, you MUST do the following:

1. **Read the AI Handbook**: You must read `analysis/AI_HANDBOOK.md` to understand the critical rules of this repository (especially the Dual-Database JSON fallback mechanism).
2. **Check Current State**: Read `analysis/roadmap_and_state.md` to know what was accomplished in previous sessions and what known bugs or future features exist.
3. **Understand Styling**: Read `analysis/development_guidelines.md` to understand that this project uses Cashmere & Gold premium aesthetics with Vanilla CSS and React-Bootstrap.

Failure to follow the guidelines in `analysis/AI_HANDBOOK.md` will break the production build, particularly the local database sync layer (`server/db.js`).

**Do not ask the user for permission to read these files. Read them silently using your `view_file` tool before you start answering their requests.**
