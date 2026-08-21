# Project Roadmap & Current State

## 📊 Current State
**Status**: The core Ceramic Showroom Platform is functional, responsive, and deployed.

**Recently Completed Features:**
- **Dynamic Filters**: Finished/Grades are automatically extracted from the products in the database and displayed as dropdowns on the Catalog page.
- **Category Management**: Full Admin Dashboard support for adding, editing, and deleting categories with automatic Lucide icon matching.
- **Deep Linking & Quick Share**: Added a "Share" button to Product Cards. It uses native mobile sharing sheets and copies a deep-link URL (e.g., `/?product=123`) that auto-opens the product modal when visited.
- **Carton Calculator**: The product modal includes an interactive calculator that computes exactly how many carton boxes a user needs based on room area, tile size, and wastage factors.

## 🚧 Known Issues & Constraints
- **Vercel Serverless Limits**: Vercel kills running functions after 10-15 seconds. Ensure all API responses return quickly. Do not implement long-polling.
- **Git Push GUI Error**: The local Git is using Windows Credential Manager. The AI agent cannot push to the remote repository. The human user must execute `git push origin main`.
- **Enterprise Architecture Flaws to Fix**:
  1. **SEO & Link Previews (OpenGraph)**: WhatsApp/Facebook sharing only shows the site logo because the app is a React SPA (Vite) and lacks dynamic Meta Tags on the server side.
  2. **Vercel Fallback Database Volatility**: The `data.json` fallback writing works locally but will reset on Vercel because Serverless filesystems are read-only and ephemeral. We need a read-only fallback mode for production to prevent data loss.
  3. **JWT Security Risk**: The admin authentication token is currently vulnerable if stored insecurely on the client (e.g., localStorage). Needs an `httpOnly` secure cookie implementation.
  4. **Unfinished Sales Drivers**: Missing features like Multi-Image Carousels and crossed-out original prices which are vital for a luxury e-commerce experience.

## 🔮 Roadmap / Future Features (Pending)
The following "Luxury Features" were proposed to the user and are pending implementation whenever the user requests them:

1. **Dynamic Room Visualizer ("تخيلها في غرفتك")**:
   - *Idea*: Overlaying tile textures onto a pre-rendered room inside the modal to give customers a visual representation of how the tile looks on a floor/wall.
2. **Original vs Discount Price Cross-out**:
   - *Idea*: Allowing admins to specify an `originalPrice`. If present, the UI will render it crossed-out in red next to the golden offer price, automatically calculating and displaying a `% Off` discount badge.
3. **Multi-Image Carousel**:
   - *Idea*: Updating the Product schema to allow up to 3 images per product, rendering them in a slider/carousel inside the product details modal.
