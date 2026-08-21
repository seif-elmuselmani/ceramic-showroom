# AI Agent Handbook & System Prompt

## 🤖 Welcome, Agent!
If you are reading this, you are an AI assistant assigned to the **Ceramic Showroom Platform** project. 
This project is an enterprise-level e-commerce catalog for a ceramic showroom. 

**MANDATORY FIRST STEP BEFORE EDITING CODE**: Read the files in this `analysis/` directory to understand the system.

## 🛑 CRITICAL INSTRUCTIONS
1. **The Dual-Database System**: This project uses a fallback database mechanism. Data is saved to **MongoDB Atlas** (via Mongoose), but simultaneously synced to a local `data.json` file. If MongoDB fails or internet drops, the server reads/writes from `data.json` seamlessly. 
   * **Rule**: Whenever you edit a Mongoose schema (`server/models/index.js`), you **MUST** ensure the local `db.js` file handles that new property correctly for local JSON queries.
2. **Git Workflow on Windows**: This system runs on Windows. Running `git push` directly via the terminal tool WILL FAIL because it triggers a Windows Credential Manager GUI prompt that you cannot see or interact with. 
   * **Rule**: You can stage and commit locally (`git add .`, `git commit -m "..."`), but you must ask the **USER** to manually run `git push origin main` in their own terminal.
3. **Vercel Serverless Architecture**: The backend Express server (`server.js`) is wrapped by Vercel serverless edge functions (`api/index.js`). 
   * **Rule**: Never run background daemons or long-running websockets because Vercel serverless functions time out after 10-15 seconds.

## 🧭 Navigation Guide
To get context quickly, read the following files:
- **`roadmap_and_state.md`**: What is currently done, what is pending, and known bugs. **(Read this immediately to know where you left off)**.
- **`development_guidelines.md`**: Code standards, UI conventions (Bootstrap + Vanilla CSS), and API rules.
- **`overview.md`**: Overall system architecture, tech stack, and directory structure.

## 🚀 How to Run the Project Locally
If you need to verify changes:
1. **Backend Server**: Open a terminal in `server/` and run `node server.js` (Runs on port 5000).
2. **Frontend App**: Open a terminal in `client/` and run `npm run dev` (Runs on port 3000).
*Note: Always keep the backend running when testing frontend features.*
