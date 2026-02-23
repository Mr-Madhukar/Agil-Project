# ✈️ Go Trip — Travel Agency Website

> *Your trusted travel partner for unforgettable journeys worldwide.*

A fully responsive, multi-page travel agency website built with pure **HTML**, **CSS**, and **JavaScript**. No frameworks, no build tools — just clean, modern front-end code.

---

## 🌐 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero section, destination cards, about section & testimonials |
| Packages | `packages.html` | Browse all travel packages with filters |
| Book a Trip | `book.html` | Trip booking form with dynamic package details |
| Sign Up / Login | `signup.html` | User registration and login |
| Booking Summary | `summary.html` | Order confirmation & booking summary |

---

## 📁 Project Structure

```
Madhukar-GoTrip/
├── index.html          # Home page
├── packages.html       # Travel packages listing
├── book.html           # Booking form
├── signup.html         # Sign up / Login
├── summary.html        # Booking summary / confirmation
│
├── css/
│   ├── style.css       # Global / shared styles (nav, footer, utilities)
│   ├── index.css       # Home page styles
│   ├── packages.css    # Packages page styles
│   ├── book.css        # Booking form styles
│   └── signup.css      # Sign up / login styles
│
└── js/
    ├── packages.js     # Package filtering & rendering logic
    ├── book.js         # Booking form logic & validation
    └── signup.js       # Sign up / login form handling
```

---

## ✨ Features

- 🗺️ **6 International Destinations** — Canada, Paris, Monaco, Switzerland, South Korea, Tokyo
- 🔍 **Search & Book** — Destination search from the hero section links directly to the booking page
- 📦 **Package Details** — URL query parameters pass the selected package across pages seamlessly
- 📱 **Fully Responsive** — Mobile-friendly hamburger navigation and fluid grid layouts
- 🎬 **Smooth Animations** — Powered by [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- 👤 **Auth UI** — Sign up & login forms with client-side validation
- ✅ **Booking Summary** — Confirmation page showing final booking details

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic page structure |
| CSS3 | Custom styling, animations, responsive layout |
| JavaScript (ES6+) | DOM manipulation, form validation, URL params |
| [AOS v2.3.4](https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js) | Scroll animations |
| [Font Awesome v6.4.0](https://fontawesome.com/) | Icons throughout the site |
| [Google Fonts — Poppins & Satisfy](https://fonts.google.com/) | Typography |

---

## 🚀 Getting Started

No installation or build step required. Simply open the project in a browser:

1. Clone or download the repository
2. Open `index.html` in any modern browser

```bash
# Using VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"
```

> **Note:** The project uses CDN links for AOS, Font Awesome, and Google Fonts, so an internet connection is required for full styling.

---

## 🗺️ Destinations & Pricing

| Destination | Duration | Price (INR) | Price (USD) | Rating |
|-------------|----------|-------------|-------------|--------|
| 🍁 Canada | 5 Days | ₹1,99,999 | $2,382 | ⭐ 4.9 |
| 🗼 Paris | 4 Days | ₹1,49,999 | $1,786 | ⭐ 4.8 |
| 🎰 Monaco | 4 Days | ₹1,39,999 | $1,667 | ⭐ 4.7 |
| 🏔️ Switzerland | 5 Days | ₹1,59,999 | $1,906 | ⭐ 4.9 |
| 🌸 South Korea | 4 Days | ₹1,49,999 | $1,787 | ⭐ 4.8 |
| 🗾 Tokyo | 5 Days | ₹1,69,999 | $2,024 | ⭐ 4.9 |

---

## 📬 Contact

| | |
|---|---|
| 📍 Location | MMDU |
| 📞 Phone | +91 XXXXXXXXXX |
| 📧 Email | info@gotrip.com |

---

## 👨‍💻 Developer

**Madhukar** — Built as part of the Agil Project  
© 2024 GoTrip. All rights reserved.
