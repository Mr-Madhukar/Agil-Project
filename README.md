<div align="center">

# ✈️ Go Trip — Travel Agency Website

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-gotripagil.netlify.app-ff5f6d?style=for-the-badge&logoColor=white)](https://gotripagil.netlify.app/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*Your trusted travel partner for unforgettable journeys worldwide.*

**[🚀 View Live Site](https://gotripagil.netlify.app/)**

</div>

---

## 📌 About

**Go Trip** is a fully responsive, multi-page travel agency website built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript** — no frameworks, no build tools. It features destination browsing, trip booking, login/sign up, and a booking confirmation summary page.

---

## 🌐 Live Demo

> 🔗 **[https://gotripagil.netlify.app/](https://gotripagil.netlify.app/)**

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 Home | `index.html` | Hero search, destination cards, about & testimonials |
| 📦 Packages | `packages.html` | Browse & filter all travel packages |
| ✈️ Book a Trip | `book.html` | Booking form with live price summary sidebar |
| 👤 Login / Sign Up | `signup.html` | Tabbed login & registration with validation |
| ✅ Booking Summary | `summary.html` | Booking confirmation with reference number |

---

## 📁 Project Structure

```
Agil-Project/
├── index.html            # Home page
├── packages.html         # Packages listing & filter
├── book.html             # Booking form
├── signup.html           # Login + Sign Up (tabbed)
├── summary.html          # Booking confirmation
│
├── css/
│   ├── style.css         # Global styles — nav, footer, responsive
│   ├── index.css         # Home page styles
│   ├── packages.css      # Packages page styles
│   ├── book.css          # Booking form & summary styles
│   └── signup.css        # Login / Sign Up styles
│
└── js/
    ├── packages.js       # Package search & category filter
    ├── book.js           # Booking form logic & price calculator
    └── signup.js         # Tab switcher, form validation
```

---

## ✨ Features

- 🗺️ **6 International Destinations** — Canada, Paris, Monaco, Switzerland, South Korea, Tokyo
- 🔍 **Destination Search** — Hero search bar links straight to the booking page
- 🏷️ **Package Filter** — Filter by All / Europe / Asia / Americas
- 💰 **Live Price Calculator** — Booking sidebar updates total in real time
- 👤 **Login + Sign Up Tabs** — Both forms on one page with smooth tab switching
- 🔒 **Form Validation** — Real-time field errors and password strength meter
- 📱 **Fully Responsive** — Mobile-first layout with smooth hamburger menu & backdrop overlay
- 🎬 **Scroll Animations** — Powered by AOS (Animate On Scroll)
- ✅ **Booking Confirmation** — Summary page with unique booking reference number

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Custom styling, animations, responsive design |
| JavaScript (ES6+) | DOM manipulation, form validation, dynamic pricing |
| [AOS v2.3.4](https://michalsnik.github.io/aos/) | Scroll-triggered animations |
| [Font Awesome v6.4.0](https://fontawesome.com/) | Icons |
| [Google Fonts — Poppins & Satisfy](https://fonts.google.com/) | Typography |
| [Unsplash](https://unsplash.com/) | Destination photography |

---

## 🚀 Getting Started

To run the project locally, you need to start the backend server:

```bash
# Clone the repository
git clone https://github.com/mr-madhukar/Agil-Project.git

# Install dependencies
npm install

# Seed the database (run once)
node seed-users.js

# Start the server
npm start
# OR for development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000`. Navigate to this URL in your browser.

> **Note:** CDN links are used for AOS, Font Awesome, and Google Fonts — an internet connection is needed for full styling.

---

## 🔑 Test Credentials

You can test the features using the following pre-configured accounts:

**Standard User (Traveler)**
- Email: `testuser123@example.com`
- Password: `Password123!`

**Admin User**
- Email: `admin@gotrip.com`
- Password: `admin123`

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

<div align="center">

**Built by Madhukar** — Agil Project  
© 2024 GoTrip. All rights reserved.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20at-gotripagil.netlify.app-ff5f6d?style=flat-square)](https://gotripagil.netlify.app/)

</div>
