# Project Analysis: UI/UX, Design Systems & Logic Formulas

## 1. CSS Design Tokens & Cashmere Palette
The visual aesthetics of the showroom platform follow a high-contrast luxury styling framework defined inside `client/src/styles/App.css` using CSS custom variables:

```css
:root {
  --primary-gold: #c5a059;       /* Luxury gold accent used for primary details */
  --dark-espresso: #1a1510;      /* Ultra-deep dark brown/black for text headers */
  --bg-cashmere: #fdfbf7;        /* Soft cashmere light-cream background */
  --announcement-gold: linear-gradient(135deg, #dfbc7a 0%, #c49e56 100%);
  --font-cairo: 'Cairo', sans-serif;
}
```
### Responsive Adjustments:
- **Horizontal Chips**: On mobile layout viewports, category options overflow and display as a single-row horizontally scrollable container with hidden scrollbars, preventing massive vertical page stretching.
- **Dynamic Columns Grid**: Responsive columns are styled dynamically:
  - Desktop: 4 items/row (`xl={3}`)
  - Laptops: 3 items/row (`lg={4}`)
  - Tablets: 2 items/row (`sm={6}`)
  - Mobile Phones: 1 item/row (full width)

---

## 2. Micro-Animations & Interactivity
To make the page feel alive, several key hover transitions and micro-animations are written in the styling sheet:
- **Card Hover Zoom**: Product cards use `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` which raises card height by `-8px` and soft-shifts shadow depth on mouse-hover.
- **bouncing Search Icon**: Bounces inside the No Results Found card using keyframe transforms:
  ```css
  @keyframes bounce-anim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  ```
- **Megaphone Pulsing**: Pulsing warning animation next to the top announcement bar to draw notice.

---

## 3. Carton Calculator Mathematics
Inside `client/src/components/TileCalculatorModal.jsx`, a core logic engine processes box metrics and wastage percentages dynamically:

### Input Parameters
- $A_{room}$ : Total surface area of the room in square meters ($m^2$).
- $W_{wastage}$ : Wastage margin percentage (e.g. 5% for straight layout, 10% for diagonal).
- $C_{box}$ : Coverage area in square meters provided by a single box (e.g. $1.44\ m^2$).
- $P_{unit}$ : Price per square meter ($ج.م / م^2$).

### Equations & Formulas
1. **Total Area with Wastage Factor ($A_{req}$)**:
   $$A_{req} = A_{room} \times \left(1 + \frac{W_{wastage}}{100}\right)$$

2. **Total Boxes Required ($B_{count}$)**:
   $$B_{count} = \left\lceil \frac{A_{req}}{C_{box}} \right\rceil$$
   *(Rounded up to the nearest integer using `Math.ceil()` to ensure the client doesn't buy half-boxes)*.

3. **Final Total Area Purchased ($A_{final}$)**:
   $$A_{final} = B_{count} \times C_{box}$$

4. **Total Price ($P_{total}$)**:
   $$P_{total} = A_{final} \times P_{unit}$$

---

## 4. Deep-Linking Query Router
To enable sharing direct links to specific items on WhatsApp or social media, a custom URL parser runs inside `Home.jsx` on page mount:
- **URL Syntax**: `https://showroom-url/?product=ID`
- **Parsing logic**:
  1. Checks if `products` list is loaded.
  2. Extracts the `product` query parameter using `URLSearchParams(window.location.search)`.
  3. Finds the matching product in the array:
     ```javascript
     const prod = products.find(p => p.id === productId || p._id === productId);
     ```
  4. Triggers `setSelectedProduct(prod)`, rendering the detail popup overlay.
  5. Automatically executes a smooth scroll operation (`scrollIntoView({ behavior: 'smooth' })`) to position the viewport correctly.
