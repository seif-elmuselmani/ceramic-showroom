# Project Analysis: Database Schema & Synchronization

## 1. Mongoose Database Models
The application connects to MongoDB Atlas using Mongoose object modeling. The schemas are declared inside `server/models/index.js` and contain the following data fields:

### ⚙️ Settings Schema (`Settings`)
Defines the showroom configurations and branding links:
- `showroomName` (String): The retail brand name.
- `tagline` (String): Slogan/motto text displayed on the landing page.
- `whatsappNumber` (String): Hot WhatsApp phone number for inquiries.
- `phoneNumber` (String): Showroom telephone number.
- `facebookUrl` / `tiktokUrl` (String): Brand social links.
- `mapUrl` / `mapUrl1` / `mapUrl2` (String): Google/Bing Maps integration links for branches.
- `address` / `address1` / `address2` (String): Individual branch addresses.
- `workingHours` (String): Standard operating hours.
- `announcement` (String): Text announcement shown inside the Gold Sand ribbon.

### 📁 Category Schema (`Category`)
- `id` (String, required, unique): Unique identifier (e.g. `cat-1`).
- `name` (String, required): Public name of the category (e.g. `سيراميك أرضيات`).
- `icon` (String, required): Lucide icon reference (e.g. `Bath`, `Layers`, `Grid`).
- `subcategories` ([String]): Array of nested subcategory tags.

### 🏺 Product Schema (`Product`)
Details specs, calculations, and catalog requirements:
- `id` (String, required, unique, indexed): Code-assigned ID (e.g. `prod-201`).
- `name` (String, required): Name of the ceramic tile model.
- `code` (String, required, indexed): Showroom code (e.g. `ESP-CAL-60120`).
- `brand` (String, indexed): Tile manufacturer brand name (e.g. `الجوهرة`).
- `category` (String, required, indexed): Belongs to category name.
- `subcategory` (String, indexed): Belongs to subcategory tag.
- `price` (Number, required): Unit price for purchasing.
- `originalPrice` (Number, default 0): Old price crossed-out in offers.
- `offerEndDate` / `offerNote` (String): Offer parameters.
- `priceUnit` (String, default `متر مربع`): Display unit for the price tag.
- `boxCoverage` (Number, default 1.44): Area covered by a single box in square meters.
- `dimensions` (String): Physical size (e.g. `60x120 سم`).
- `finish` (String): Gloss level/finish type.
- `grade` (String): Tile sorting grade (e.g. `فرز أول`).
- `origin` (String): Producing country (e.g. `إسبانيا`).
- `usage` (String): Recommended application areas.
- `inStock` (Boolean): Stock availability switch.
- `featured` (Boolean): Show in featured slider flag.
- `isDeleted` (Boolean, indexed): Soft-delete flag.
- `description` / `image` (String): Overview details and hosted image URL.

### 📊 Analytics Schema (`Analytics`)
Telemetry events tracked dynamically:
- `id` (String, default `main-analytics`, unique): Analytics document ID.
- `totalPageViews` / `totalVisitors` / `totalTimeSpentSeconds` (Number): Global stats counters.
- `whatsappClicks` (Number): Global click counter.
- `whatsappClickDetails` (Object): Clicks broken down by page source (floating badge, product card, product modal, calculator).
- `productViews` (Object): View count map per product ID.
- `searchQueries` (Object): Map of search strings queried by clients.
- `mobileCount` / `desktopCount` (Number): User-agent category split.
- `lastActivity` (String): ISO timestamp of the latest event.

---

## 2. In-Memory JSON Synchronization Engine
If MongoDB Atlas is disconnected or not configured in environment variables, the database layer (`server/db.js`) transparently falls back to an **In-Memory Cache & JSON File Storage engine**:
- **Initialization**: On backend start, `db.js` scans and loads `server/data.json` into memory (`memoryCache`). If the file is missing, it seeds it using `initialData`.
- **Migration & Updates**: Migrations verify that all categories and product structures match the latest schema parameters (e.g., ensuring default brands, codes, and subcategories exist).
- **Disk Persistence**: Any create/update/delete operation writes the updated in-memory state back to `server/data.json` synchronously using Node.js file system APIs:
  ```javascript
  fs.writeFileSync(dataPath, JSON.stringify(cache, null, 2), 'utf8');
  ```
- **Transparent MongoDB Sync**: If `process.env.MONGODB_URI` is present, the class automatically redirects CRUD functions to MongoDB Mongoose methods while updating the local cache file, providing both cloud persistence and local backup safety.
