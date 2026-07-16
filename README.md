# New Jodhpur Sweet Home Mandawa
## Premium Luxury Indian Mithai Brand & Dine-in Portal

This project transforms **"New Jodhpur Sweet Home"**, a real local sweet shop located on **Mandawa Road, Mandawa, Rajasthan, India**, into a world-class premium luxury Indian sweets and restaurant brand. The website balances traditional royal Rajasthani heritage with modern editorial digital design principles.

---

## 🏛️ Brand Identity & Aesthetics

- **Style:** "Royal Rajasthan Luxury — Modern Indian Heritage".
- **Color Tokens:**
  - Primary: Deep Royal Maroon (`#5C1A24`)
  - Accent: Premium Gold (`#C9A24B` - used strictly for underlines, thin lines, and CTAs)
  - Background: Ivory White (`#FBF7F1`) / Warm Cream (`#F3E9DA`)
  - Text: Dark Chocolate Brown (`#2B1810`)
- **Typography:** Serif editorial headings (Playfair Display) paired with clean modern sans-serif body copy (Outfit).

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite) + Tailwind CSS (v3) + Lucide Icons + GSAP & Framer Motion animations.
- **Backend:** Node.js + Express.js API, serving API endpoints for products, orders, reservations, and moderation.
- **Database:** Local JSON file database with persistent reads/writes acting as a lightweight ORM.
- **Fallback Simulation:** Frontend includes a robust client-side fallback matching all database states, allowing full operations even if the backend Express server is offline.

---

## ✨ Key Features

1. ** pre-loader & Custom Cursor:** A clean session-persisted pre-loader alongside an organic lag-ring custom cursor reacting on hover.
2. **Visual Custom Gift Box Builder:** An interactive grid customizer (500g / 1kg) allowing drag-click sweet insertions, price/weight trackers, and an **AI Auto Fill** helper recommending balanced sweet combinations.
3. **AI Gift Planner:** An interactive modal survey (Occasion, Budget, Taste Profile) suggesting custom luxury sweet hampers.
4. **Multistep Checkout with Card Animations:** Multi-step wizard supporting cash on delivery, a simulated UPI scan-QR window, and an interactive credit card that **flips/spins around** to type CVV.
5. **Real-time Order Tracker Map:** Visual milestone stepper (Placed -> Kitchen -> Shipping -> Delivered) with a **moving truck animation** tracking delivery coordinates from Jodhpur to the destination suite.
6. **Table Reservations & Catering Forms:** Fully functional scheduling forms for dine-in seats and corporate B2B catering events.
7. **Invoice PDF/HTML Exporter:** Downloads printable detailed merchant invoices per order.
8. **Admin Dashboard Console:** Secure metrics cards (sales revenue, inquiry counts), custom SVG sales breakdown charts, stock controls (+/- click increments), review moderation (approve/hide), and reservation list view.

---

## 🔑 Authentication & Setup Guide

Authentication is configured through environment variables.
Create an administrator account using the setup script or the database seed.
Refer to the installation guide for configuration.

Sample development credentials are for local development only and must never be used in production.

### Mobile OTP Login Simulation:
OTP delivery requires SMS provider configuration (Twilio/MSG91 or equivalent).

---

## 🚀 Installation & Operation

### 1. Pre-requisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 2. Startup Commands
From the project root directory, run:

```bash
# 1. Install Backend dependencies
cd backend
npm install

# 2. Install Frontend dependencies
cd ../frontend
npm install

# 3. Start both Client & Server concurrently
cd ..
npm start
```

Open **`http://localhost:5173`** (or the port outputted by Vite) to view the luxury brand portal. The backend server will run on **`http://localhost:5000`**.
