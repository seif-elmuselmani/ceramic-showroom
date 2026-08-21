# Project Analysis: System Architecture & Data Flow

## 1. System Architecture Diagram
The system is built on a client-server architecture model. The client (React app) initiates HTTP requests via Axios to the backend (Express API server), which connects to either the MongoDB Atlas database cloud cluster or falls back to a local JSON file store.

```
+--------------------------------------------------+
|                  Client Browser                  |
|  [React SPA - Port 3000 / Vercel Edge CDN]       |
+------------------------+-------------------------+
                         |
                HTTP REST API Calls
                         |
                         v
+--------------------------------------------------+
|                   Backend API                    |
|  [Node.js / Express - Port 5000 / Vercel Server]  |
+------------+------------------------+------------+
             |                        |
     Database Queries         Media Upload Pipeline
             |                        |
             v                        v
+------------------------+  +----------------------+
|     Database Layer     |  |   Media Storage      |
|  [MongoDB Cloud /      |  |   [Cloudinary CDN]   |
|   Local JSON Fallback] |  |                      |
+------------------------+  +----------------------+
```

---

## 2. API Endpoints Map
The backend server (Express routing inside `server/server.js`) exposes the following RESTful endpoints:

### 🔑 Authentication Routes
- `POST /api/login` / `/login`: Accepts admin username and password. Validates credentials and signs a secure JWT access token.

### ⚙️ Showroom Settings Routes
- `GET /api/settings` / `/settings`: Returns general settings (name, hotline, map embeds, announcement ribbons).
- `PUT /api/settings` / `/settings`: Updates settings (requires active Admin JWT authentication).

### 📁 Category Routes
- `GET /api/categories` / `/categories`: Returns list of categories and subcategories.
- `POST /api/categories`: Adds a new category and icon (requires JWT authentication).
- `PUT /api/categories/:id`: Updates an existing category's properties (requires JWT authentication).
- `DELETE /api/categories/:id`: Deletes a category (requires JWT authentication).

### 🏺 Product Routes
- `GET /api/products` / `/products`: Returns catalog products list. Supports filters via query strings:
  - `?category=Name` (filters by category)
  - `?subcategory=Name` (filters by subcategory tag)
  - `?finish=GlossType` (filters by surface texture)
  - `?grade=GradeName` (filters by grade)
  - `?inStock=true` (filters in-stock items)
- `POST /api/products` / `/products`: Creates a new product. Accepts multi-part/form-data for image uploads (requires JWT authentication).
- `PUT /api/products/:id` / `/products/:id`: Edits a product (requires JWT authentication).
- `DELETE /api/products/:id` / `/products/:id`: Deletes a product (requires JWT authentication).

---

## 3. Frontend Client Flow & State Management
The React frontend leverages hooks (`useState`, `useEffect`) and Axios service utilities (`client/src/services/api.js`) to drive state:

- **App.jsx**: Root entry point containing main state contexts for categories list and active category filter selections. Handles routing and propagates these values to child components like the `<Navbar />`, `<Home />`, and `<Footer />`.
- **Home.jsx**:
  - Dynamically fetches categories on mount.
  - Queries products from the backend depending on search queries and active filter states (gloss, grade, categories, in-stock switch, sort criteria).
  - Handles detailed product modal visibility and triggers carton calculations.
- **AdminDashboard.jsx**:
  - Requires a valid JWT token stored in `localStorage` or redirects to `<AdminLogin />`.
  - Maintains state panels for catalog modifications, category tags operations, and settings values.
