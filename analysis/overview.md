# Project Analysis: General System Overview

## 1. Introduction
The **Ceramic Showroom Platform (معرض السيراميك والبورسلين الفاخر)** is an enterprise-grade catalog and management system designed for physical ceramic and porcelain retailers. It enables showroom owners to catalog products, calculate carton box requirements with wastage factors, receive direct customer inquiries on WhatsApp, and manage categories and system configurations dynamically via a secure Admin Dashboard.

---

## 2. AI Knowledge Base & Guidelines
If you are an AI Agent assigned to this project, you **MUST** read the following files before editing any code:
- 🤖 **[AI_HANDBOOK.md](file:///c:/Users/smart/Downloads/سراميك/analysis/AI_HANDBOOK.md)**: The mandatory AI system prompt, critical rules, and local dev workflow.
- 🚧 **[roadmap_and_state.md](file:///c:/Users/smart/Downloads/سراميك/analysis/roadmap_and_state.md)**: What is currently done, known issues, and pending features.
- 📐 **[development_guidelines.md](file:///c:/Users/smart/Downloads/سراميك/analysis/development_guidelines.md)**: Code standards, UI conventions (Cashmere/Gold colors), and backend fallback rules.

---

## 3. Directory Structure Walkthrough
Below is the directory tree of the workspace, detailing the responsibility of each folder:

```
ceramic-showroom/
├── api/                   # Vercel serverless function entrypoint
│   └── index.js           # Serverless wrapper for the Express application
├── client/                # React single-page application (SPA)
│   ├── public/            # Static assets (logo, icons, fallbacks)
│   └── src/               # React source files
│       ├── components/    # Reusable UI components (Modals, Cards, Footer, Navbar)
│       ├── pages/         # Page containers (Home Catalog, Admin Login, Admin Dashboard)
│       ├── services/      # API communication handlers (Axios service calls)
│       ├── styles/        # Global stylesheet and custom themes (App.css)
│       ├── utils/         # Math utilities (calculator operations, formulas)
│       ├── App.jsx        # Main application router and context wrapper
│       ├── main.jsx       # Client bootstrapping entrypoint
│       └── index.html     # SPA HTML template
├── server/                # Node.js backend server (Express)
│   ├── uploads/           # Local folder for image fallback storage
│   ├── server.js          # Express app configurations, routes, and middleware
│   ├── db.js              # Database connection and CRUD fallback layer
│   ├── data.json          # Local database storage fallback file
│   └── hash-password.js   # Seed utility to hash the admin password
├── package.json           # Root package defining project workspaces and meta
├── vercel.json            # Vercel deployment and routing definitions
└── docker-compose.yml     # Docker local container management
```

---

## 3. Technology Stack Breakdown

| Technology | Layer | Purpose |
| :--- | :--- | :--- |
| **Node.js & Express** | Backend | RESTful API server, authenticated endpoints, image upload processing |
| **React (Vite)** | Frontend | Single Page Application (SPA), state management, fast builds |
| **MongoDB Atlas** | Database | Main database storage (cloud), storing products, categories, settings |
| **JSON Fallback File** | Database | Local mock DB storing tables to ensure server works when MongoDB is disconnected |
| **Cloudinary** | Media Storage | CDN hosting for high-resolution ceramic and tile images |
| **Vercel** | Hosting & Scaling | Hosting both React frontend and Express backend on globally scaled edge functions |
| **BcryptJS** | Security | Cryptographic one-way hashing for secure database admin credentials |
| **JWT (JsonWebToken)** | Security | Access tokens issued to authorize admin actions (create, edit, delete) |
| **Bootstrap & React-Bootstrap** | Styling | Grid system, modals, forms, and responsive components |
