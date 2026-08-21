# Project Analysis: Deployment, Cloud Integrations & DevOps

## 1. Vercel Serverless Function Architecture
Deploying a Node.js Express server to Vercel requires converting standard listener sockets to Serverless Functions. This is accomplished via custom routing configurations:

### `vercel.json` Routing Config
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

### Serverless Entrypoint (`api/index.js`)
Instead of starting a running socket loop (`app.listen()`), Vercel imports `server/server.js` directly as a modular handler:
```javascript
let app;
try {
  app = require('../server/server.js');
} catch (err) {
  const express = require('express');
  app = express();
  app.use(express.json());
  app.all('*', (req, res) => {
    res.status(500).json({ error: "Init Error", message: err.message });
  });
}
module.exports = app;
```
This enables the backend to execute on-demand inside temporary edge containers, automatically spinning down to save server resources and scaling up to handle traffic spikes.

---

## 2. Local Containerization (Docker Config)
For consistent local development environments, Docker Compose binds the frontend and backend services:

### Services in `docker-compose.yml`
- **`backend`**:
  - Builds from `./server/Dockerfile` (exposes port `5000`).
  - Volume binds `data.json` and `uploads/` to ensure persistent storage across container restarts.
- **`frontend`**:
  - Builds from `./client/Dockerfile` (binds to port `80`).
  - Automatically depends on the `backend` container start.

---

## 3. Cloudinary CDN Integration Pipeline
To serve high-resolution product images without degrading server performance, the backend connects directly to Cloudinary:

- **Storage Method**: Images uploaded via the Admin Dashboard form are sent as a multi-part form stream to the server (processed by `multer` storage memory memory buffer).
- **Direct Upload Pipeline**: The buffer is streamed directly to Cloudinary API using secure environment keys (`CLOUDINARY_URL`).
- **Optimization**: Cloudinary compresses images automatically and returns a web-optimized URL (e.g. `https://res.cloudinary.com/...`). This URL is saved in MongoDB/local database fields, serving the images globally via Cloudinary’s Content Delivery Network.
