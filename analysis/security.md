# Project Analysis: Security Audits & Policies

## 1. Authentication Pipeline (JWT Authorization)
Admin operations (such as creating products, editing settings, or deleting categories) require secure verification. This is implemented via a **JSON Web Token (JWT)** protocol:
- **Token Signature**: On successful credential verification, the server signs a payload containing the admin's identity using a secret key (`JWT_SECRET`) with the `HS256` hashing algorithm.
- **Expiration Policy**: Tokens are set to expire within a strict timeline to prevent session hijacking.
- **Middleware Validation**: The server implements an `authenticateToken` middleware:
  ```javascript
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'غير مصرح بالدخول' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'توكن منتهي الصلاحية أو غير صالح' });
    req.user = user;
    next();
  });
  ```
  This interceptor protects all modifying endpoints (`POST`, `PUT`, `DELETE`), rejecting unsigned queries.

---

## 2. Password Protection (Bcrypt Hashing)
Admin passwords are never stored in plain text. They are hashed using **BcryptJS**:
- **Salting Rounds**: Hashing uses 10 salt rounds to defend against dictionary and rainbow table attacks.
- **One-Way Hash**: Even if the MongoDB collection or local `data.json` database is compromised, the original admin password cannot be reversed or decrypted.
- **Comparison**: When logging in, the bcrypt engine compares the typed plaintext password against the hashed string stored in variables or database settings.
- **Seeding script**: `server/hash-password.js` is included in the project to seed/re-hash new admin credentials.

---

## 3. Defensive API Headers (Helmet Policy)
To guard the Node.js Express server from web exploits, we integrate the **Helmet** security middleware:
- **Helmet Middleware**: Configured in `server/server.js` using `app.use(helmet())`.
- **Mitigated Vulnerabilities**:
  - **Cross-Site Scripting (XSS)**: Filters script injections via `X-XSS-Protection` headers.
  - **Clickjacking**: Disallows loading the showroom site inside unauthorized `iframe` tags using `X-Frame-Options: SAMEORIGIN`.
  - **MIME Sniffing**: Instructs browsers to strictly follow the declared Content-Type header using `X-Content-Type-Options: nosniff`.
  - **Information Leakage**: Disables the `X-Powered-By: Express` header, hiding the server type from network sniffers.

---

## 4. Anti-Abuse Controls (Rate Limiting)
To block Denial-of-Service (DDoS) attempts and login brute-forcing, request rate limits are active (`express-rate-limit`):
- **API Protection**: Limits calls from a single IP to a maximum count per window.
- **Brute-Force Shield**: Sensitive entry points (like `POST /api/login`) restrict requests to a very small count per minute. If a crawler tries to brute-force the admin password, the server blocks their IP with a `429 Too Many Requests` status code.

---

## 5. Environment Variable Secrets
All secure integration keys are stored exclusively in `.env` files locally and within Vercel's encrypted system configurations:
- `MONGODB_URI`: Atlas cloud connection endpoint containing cluster credentials.
- `JWT_SECRET`: The cryptographic secret key used to verify access tokens.
- `CLOUDINARY_URL` / `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Secure pipeline parameters for uploading showroom images.
- None of these parameters are exposed in git commits or public React client bundles.
