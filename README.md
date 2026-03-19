<div align="center">

# ✈️ Go Trip — Travel Agency Website

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-agil--project.onrender.com-ff5f6d?style=for-the-badge&logoColor=white)](https://agil-project.onrender.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

*Your trusted travel partner for unforgettable journeys worldwide.*

**[🚀 View Live Site](https://agil-project.onrender.com/)**

</div>

---

## 📌 About

**Go Trip** is a comprehensive travel agency website featuring a responsive, dynamic frontend built with **HTML5**, **CSS3**, and **Vanilla JavaScript**, powered by a robust **Node.js/Express.js backend** and **MongoDB** database (via Mongoose). It features dynamic navigation based on user authentication (admin vs. regular user), destination browsing, live trip booking price calculation, and a full booking management system.

*(Note: The database was recently migrated from SQLite to MongoDB to fully support persistent live-hosting on platforms like Render.com!)*

---

## 🌐 Live Demo

> 🔗 **[https://agil-project.onrender.com/](https://agil-project.onrender.com/)**


## 🚀 Getting Started

To run the project locally, you need to configure your database and start the backend server:

```bash
# Clone the repository
git clone https://github.com/mr-madhukar/Agil-Project.git

# Install dependencies (Mongoose, Express, etc.)
npm install

# Configure MongoDB Environment Variables (CRITICAL!)
# 1. Open the project and copy the `.env.example` file to a new file named `.env`.
# 2. Paste your live MongoDB Atlas connection URL into the `MONGODB_URI` variable.

# Start the server
npm start
# OR for development with auto-reload
npm run dev

# Run automated Jest testing suite
npm test
```

The server will start on `http://localhost:5000` (assuming your MongoDB connected successfully). Navigate to this URL in your browser to view the application!

> **Note:** Travel packages are seeded automatically into your MongoDB cluster upon the first successful connection.

---

## 🔑 Accounts

Since this template uses real MongoDB clusters, earlier default testing accounts have been wiped.
Simply click **Sing Up** on the frontend to create your own Traveler account, or register an agent account directly in the database to test the Admin dashboard!

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

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20at-agil--project.onrender.com-ff5f6d?style=flat-square)](https://agil-project.onrender.com/)

</div>
