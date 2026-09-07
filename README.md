# 🌟 STARSHINE — Haute Horology, Footwear & Designer Apparel

A luxury e-commerce web platform designed for high-end retail, featuring **Watches, Shoes, Clothing, and Accessories**.

Engineered with a **Dark Obsidian & Champagne Gold** aesthetic, editorial serif typography, glassmorphism cards, interactive product quick-views, and a high-converting **1-Click WhatsApp Direct Ordering System**.

---

## ✨ Key Features & Highlights

1. **Luxury Visual Design & Theme**:
   - Palette: Deep Obsidian (`#090A0D`), Rich Charcoal (`#151821`), and Champagne Gold metallic gradients (`#D4AF37`).
   - Typography: **Cinzel** (majestic Roman serif) paired with **Plus Jakarta Sans** for modern digital legibility.
   - Ambient gold radial backlights and card hover lift effects.

2. **The 4 Signature Departments**:
   - ⌚ **Horology & Watches**: Skeleton automatics, Swiss chronographs, celestial tourbillons.
   - 👞 **Footwear & Shoes**: Handcrafted calfskin Oxfords, suede tassel loafers, luxury Nappa court sneakers, Chelsea boots.
   - 👔 **Apparel & Suiting**: Super 130s virgin wool blazers, Egyptian silk dress shirts, weatherproof gabardine trench coats, Mongolian cashmere knitwear.
   - 🕶️ **Fine Accessories**: 24K monogram reversible belts, aerospace titanium aviators, croc-embossed RFID cardholders, sterling silver & onyx cufflinks.

3. **High-Conversion WhatsApp 1-Click Ordering**:
   - Customers add products (selecting custom sizes, colors, and quantities).
   - In the slide-over bag, clicking **"Complete Order On WhatsApp"** generates a pre-formatted message sent directly to your uncle:
     ```text
     ✨ *NEW ORDER - STARSHINE* ✨
     ━━━━━━━━━━━━━━━━━━━━━
     🛍️ *ORDERED LUXURY PIECES*:

     1. *Aethelgard Skeleton Automatic Gold*
        • Details: Size 42mm, Color: Champagne Gold
        • Qty: 1 × $420 = $420

     2. *Milano Handcrafted Oxford Shoes*
        • Details: Size EU 43, Color: Cognac Patina
        • Qty: 1 × $280 = $280
     ━━━━━━━━━━━━━━━━━━━━━
     💵 Subtotal: $700
     🎟️ Voucher (STAR10): -$70
     📦 Express Delivery: COMPLIMENTARY
     💎 *TOTAL ORDER AMOUNT*: *$630*

     📍 *Customer City / Delivery Note*: Manhattan, NY
     ━━━━━━━━━━━━━━━━━━━━━
     Please confirm availability and share payment / shipping instructions. Thank you!
     ```

4. **Product Quick View Modal**:
   - Multi-angle thumbnail gallery (click to inspect different angles).
   - Real-time color swatches with active ring indicator.
   - Size selector (Shoes: EU 39–45, Apparel: S–XXL, Watches: 39mm–43mm).
   - Private reserve stock countdown (e.g. *"Only 4 pieces remaining"*).
   - Direct *"Instant WhatsApp Inquiry"* button for asking questions about a specific piece.

5. **Slide-Over Shopping Bag**:
   - Real-time quantity adjustments (`+` / `−`).
   - Coupon voucher engine (`STAR10` for 10% off, `STAR20` for 20% off).
   - Delivery city / customer notes input.
   - Free luxury shipping badge.

6. **Currency Converter**:
   - Supports **USD ($)**, **EUR (€)**, **GBP (£)**, **INR (₹)**, **AED (د.إ)**, **CAD (C$)** with real-time price updates across all products and modals.

7. **Wishlist with Local Storage**:
   - Tap the heart icon on any card to save items.
   - Access saved items via the top header or mobile bottom bar.

8. **⚙️ Uncle's Store Settings Modal**:
   - Click the gear icon in the header or footer to update:
     - Uncle's WhatsApp phone number (with international country code)
     - Display phone number
     - Store Name
     - Default Currency
   - Updates instantly across the whole application and saves to `localStorage`.

9. **Mobile First Responsive Design**:
   - Bottom floating navigation bar on phones (Home, Catalog, Wishlist, Bag).
   - Floating WhatsApp Concierge button with pulsing ping animation.

---

## 🚀 How to Run the Website

### Option 1: Quick Shell Script
```bash
cd /data/data/com.termux/files/home/MANISOFT/projects/starshine
./start.sh
```

### Option 2: Python Command
```bash
cd /data/data/com.termux/files/home/MANISOFT/projects/starshine
python3 app.py
```

Open your browser and navigate to:
```
http://localhost:5000
```
*(Or if accessing from another phone/computer on your local Wi-Fi, use your local IP: `http://<your-device-ip>:5000`)*.

---

## 📂 Project Structure

```
starshine/
├── app.py                     # Flask web server & REST API
├── start.sh                   # One-click startup script
├── README.md                  # Documentation & user guide
├── templates/
│   └── index.html             # Master luxury storefront template
└── static/
    ├── css/
    │   └── style.css          # Dark obsidian & gold luxury styling
    ├── js/
    │   └── app.js             # Cart, WhatsApp order generator, quick view, currency
    └── data/
        └── products.json      # 16 curated high-end products with full metadata
```

---

## ✏️ Adding / Editing Products

To add new items or change prices, simply edit [`static/data/products.json`](file:///data/data/com.termux/files/home/MANISOFT/projects/starshine/static/data/products.json).
Each item supports:
- `id`, `name`, `category` (`watches`, `shoes`, `clothes`, `accessories`)
- `price`, `originalPrice`, `rating`, `reviewsCount`, `badge`
- `image` and `secondaryImage` (lifestyle angle on hover)
- `description`, `features` list
- `colors` (array of `{name, hex}`)
- `sizes` (array of size strings)
- `stockCount`
