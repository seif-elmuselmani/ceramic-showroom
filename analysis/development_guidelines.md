# Development Guidelines & Code Standards

## 1. UI & Styling Conventions
- **Framework**: We use **React-Bootstrap** for responsive grid layouts (`Container`, `Row`, `Col`) and built-in components (`Modal`, `Form`, `Button`).
- **Custom CSS**: Avoid Tailwind CSS or inline styles unless strictly necessary. Use **Vanilla CSS** in `client/src/styles/App.css`.
- **Aesthetics (CRITICAL)**: The user demands extremely premium, luxury aesthetics (Ceramic & Porcelain Showroom). 
  - **Colors**: Rely on CSS variables defined in `App.css`:
    - `--primary-color: #B89B72` (Gold)
    - `--secondary-color: #8C7355` (Dark Gold)
    - `--bg-light: #FDFBF7` (Cashmere/Cream)
    - `--text-dark: #2C2C2C` (Charcoal)
  - **Animations**: Use subtle micro-animations (e.g., hover scaling `transform: translateY(-5px)`, ease-in-out transitions).

## 2. Backend & Database Conventions
- **Express Routes**: All API routes live in `server/server.js` prefixed with `/api/`.
- **Mongoose Models**: Schemas are defined in `server/models/index.js` (Settings, Category, Product, Analytics). 
- **The JSON Fallback (CRITICAL)**:
  - Inside `server/db.js`, there is logic that attempts to query MongoDB first. If it fails, it queries the local `server/data.json` file.
  - **Rule**: If you add a feature that requires filtering, sorting, or adding new fields to a Model, you MUST implement the exact same JavaScript fallback array filtering logic inside `server/db.js` so it works perfectly even when offline.

## 3. Data Fetching (Frontend)
- Use standard `axios` or native `fetch` inside React `useEffect` hooks.
- **Loading States**: Always wrap data fetching in `try/catch` and use `loading` state to display a spinner (`Spinner` component) to the user while data loads.
- **Error States**: Handle errors gracefully (show error alerts or "No Results" placeholders instead of crashing the UI).

## 4. File Uploads (Cloudinary)
- High-quality images are uploaded to Cloudinary via the `upload` endpoint in `server.js`.
- Make sure to enforce file size limits and accepted file types (jpeg, png, webp).
