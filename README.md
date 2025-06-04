# 🔧 Mini CRM – Backend

This is the **backend server** for the Mini CRM Platform built using **Node.js**, **Express**, and **MongoDB**. It handles authentication, customer and campaign management, AI-generated email previews using the **Gemini API**, and campaign delivery logs.

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **Google OAuth 2.0**
- **Gemini Generative AI API**
- **Axios**, **dotenv**, **cookie-parser**, **cors**

---

## 📁 Project Structure

server/
├── controllers/ # Route logic for campaigns, auth, etc.
├── models/ # Mongoose schemas (Customer, Campaign, Logs)
├── routes/ # All REST API routes
├── utils/ # Helper functions (JWT, Gemini, Email)
├── middleware/ # Authentication middleware
├── index.js # Entry point
└── .env # Environment variables (not committed)

---

## ⚙️ Environment Setup

Install dependencies:
npm install

Create a .env file with the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_google_gemini_api_key

Start the server:
node app.js

🔐 Authentication
Google OAuth 2.0 is used for login.

A JWT token is issued upon successful login, stored in cookies.

Token automatically expires in 1 hour and logs the user out.

Middleware protects sensitive routes (authMiddleware.js).

🧠 AI Integration
The backend uses Google Gemini API to generate 5 personalized marketing emails per customer in Latin-scripted regional languages (e.g., Hinglish) with inline HTML formatting.


Uses customer attributes (name, age, location, language) to generate responses.


🔐 Protected Routes
Middleware requireAuth ensures that only authenticated users can:

Create campaigns

Access history

View or send AI-generated emails
