# E-Track PK 2.0 - SaaS Platform

A premium MERN stack SaaS to manage Cash on Delivery (COD) risks for online stores.

## Features
- **Shared Blacklist:** Stores can report fraudulent customers and share data.
- **Risk Assessment:** Real-time Low/Medium/High risk scores.
- **Subscription Management:** Automated 14-day trial and paid plans (1mo, 6mo, 1yr).
- **Live Support:** Real-time private chat between Stores and Admin.
- **Admin Control:** Manage stores, block users, and approve payments.

## Setup Instructions

### 1. Backend
1. Go to `backend` folder.
2. Run `npm install`.
3. Make sure MongoDB is running.
4. Run `npm run dev` to start the server on port 5000.

### 2. Frontend
1. Go to `frontend` folder.
2. Run `npm install`.
3. Run `npm run dev` to start the Vite development server.
4. Open the browser at the provided local URL (usually `http://localhost:5173`).

### 3. Creating Admin
You can create an admin manually in MongoDB or create a temporary script to seed the admin user.

## Tech Stack
- **Frontend:** React, Vanilla CSS, Lucide React, Socket.io-client.
- **Backend:** Node.js, Express, MongoDB, Socket.io, JWT, Bcrypt.
