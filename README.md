# 🗳️ Votek — Real-Time Polling Platform

![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-Educational-orange?style=for-the-badge)

**Votek** is a full-stack, production-ready polling application that enables users to **create live polls, collect real-time votes, and visualize results interactively**. It is built with a modern tech stack and designed for performance, scalability, and a premium user experience. Deployed and hosted on **Vercel** with a serverless backend.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Live Demo](#live-demo)
3. [Features](#features)
4. [How It Works](#how-it-works)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [API Reference](#api-reference)
10. [Database Schema](#database-schema)
11. [Deployment (Vercel)](#deployment-vercel)
12. [Vercel Configuration](#vercel-configuration)
13. [Troubleshooting](#troubleshooting)
14. [Known Limitations](#known-limitations)
15. [License](#license)

---

## 📖 Overview

Votek allows **admins** to create and manage polls with various question types (single choice, multiple choice, image choice, open-ended). **Users** can participate in live polls and see results update in real time. Admins can export voter data to Excel and track participation.

The platform was migrated from MongoDB + Firebase to **PostgreSQL (Neon)**, retaining Firebase Realtime Database for live poll broadcasting. The backend Express server is hosted as a **Vercel Serverless Function**, making it globally fast and scalable with zero infrastructure management.

🎥 **[Watch Website Demo Video](https://screenapp.io/app/v/gqNauhDjUd)**

---

## 🌍 Live Demo

> The app is deployed on Vercel. Access the live version at:
>
> **Frontend**: `https://eventpoll-client-a2bl.vercel.app`
>
> **API Docs (Swagger)**: `https://eventpoll-client-a2bl.vercel.app/api-docs`

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| ⚡ **Real-Time Voting** | Instant result updates via Socket.io | ✅ Live |
| 📊 **Live Charts** | Beautiful, animated charts using Chart.js | ✅ Live |
| 🔐 **JWT Authentication** | Secure, token-based auth with role-based access (admin / user) | ✅ Live |
| 👤 **User Sign-up & Sign-in** | Email/password registration with bcrypt hashing | ✅ Live |
| 📁 **Poll Templates** | Save and reuse question sets as templates | ✅ Live |
| 🗂️ **Multiple Question Types** | Single choice, multi-choice, image choice, open-ended | ✅ Live |
| 📥 **Excel Export** | Export voter data to `.xlsx` using ExcelJS | ✅ Live |
| 🎨 **Premium UI** | Glassmorphism, Framer Motion animations, Chakra UI | ✅ Live |
| 🌐 **Vercel Deployment** | Serverless backend + frontend on Vercel CDN | ✅ Live |
| 🔑 **Role-Based Access** | Admin dashboard vs User dashboard, separate permissions | ✅ Live |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop | ✅ Live |
| 🔒 **Authentication Gate** | Protected routes — login required to access core pages | ✅ Live |
| 🗳️ **Voter Tracking** | Tracks who voted on which option, prevents double-voting | ✅ Live |

---

## ⚙️ How It Works

### User Flow
```
User visits site → Redirected to Sign-in/Sign-up
        ↓
  Creates account or Signs in
        ↓
  JWT Token issued → Stored in localStorage
        ↓
  Redirected to Dashboard
        ↓
  User: Browse & vote on live polls
  Admin: Create polls, manage templates, view results
        ↓
  Poll ends → Results archived to PostgreSQL
```

### Voting Flow
```
Admin creates poll → Saved to Firebase Realtime DB
        ↓
  Share poll link with participants
        ↓
  Participant opens link → Authenticates via JWT
        ↓
  Answers questions → POST /api/firebase/vote
        ↓
  Firebase DB updates → All viewers see real-time results via Socket.io
        ↓
  Admin stops poll → Data saved to PostgreSQL for archive
```

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** — UI framework
- **Chakra UI** — Component library
- **Redux + Redux Thunk** — Global state & async actions
- **React Router Dom v6** — Client-side routing
- **Chart.js / react-chartjs-2** — Data visualization
- **Framer Motion** — Animations
- **Axios** — HTTP client
- **Socket.io Client** — Real-time communication

### Backend (`/server`)
- **Node.js + Express** — REST API server
- **PostgreSQL (Neon)** — Primary relational database (via `pg`)
- **Firebase Realtime Database** — Live poll state broadcasting
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **ExcelJS** — Excel file generation
- **Socket.io** — WebSocket server
- **Swagger UI** — Interactive API documentation

### Infrastructure
- **Vercel** — Hosting (frontend + serverless API)
- **Neon PostgreSQL** — Managed cloud database

---

## 📁 Project Structure

```
Eventpoll/                  ← Root (NPM Workspaces Monorepo)
├── client/                 ← React frontend application
│   ├── src/
│   │   ├── components/     ← Reusable UI components
│   │   ├── pages/          ← Route-level page components
│   │   ├── redux/          ← Redux store, reducers, actions
│   │   ├── routes/         ← Route protection logic
│   │   ├── styles/         ← Global CSS
│   │   └── utils/          ← Utility helpers
│   └── public/
├── server/                 ← Express backend
│   ├── config/             ← Database connection (PostgreSQL)
│   ├── models/             ← Legacy Mongoose models (unused)
│   ├── routes/             ← API route handlers
│   │   ├── user.routes.js      → Sign-up & user details
│   │   ├── signin.routes.js    → Sign-in authentication
│   │   ├── poll.routes.js      → Ended polls (PostgreSQL)
│   │   ├── template.routes.js  → Poll templates
│   │   └── poll.firebase.routes.js → Live polls (Firebase)
│   ├── utils/              ← Token generation, data helpers
│   ├── schema.sql          ← PostgreSQL table definitions
│   └── index.js            ← Server entry point
├── api/                    ← Vercel serverless proxy
│   └── index.js
└── package.json            ← Monorepo root
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) (local) **or** a [Neon](https://neon.tech/) cloud database
- npm v8+ (for workspace support)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Eventpoll

# 2. Install all dependencies (client + server)
npm install
```

### Database Setup

```bash
# Run this once to create the required tables
cd server
node init-db.js
cd ..
```

### Start Development

```bash
# From the root, starts both frontend (port 3000) and backend (port 8080)
npm start
```

> The frontend proxies API requests to `http://localhost:8080` automatically (configured in `client/package.json`).

---

## ⚙️ Environment Variables

### `server/.env`
Create this file based on `server/env.template`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>
PRIMARY_SECRET_KEY=your_jwt_primary_secret
REFRESH_SECRET_KEY=your_jwt_refresh_secret
FRONTEND_URL=http://localhost:3000
```

> ⚠️ **Important:** Each variable must be on its own line. Do not merge them together.

---

## 📡 API Reference

Interactive documentation is available via Swagger UI:
- **Local**: `http://localhost:8080/api-docs`
- **Production**: `https://<your-app>.vercel.app/api-docs`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/user/signup` | Register a new user |
| `POST` | `/api/auth/signin` | Sign in with email + password |

### User

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/user/user-details` | Get logged-in user's details | ✅ Bearer Token |

### Polls

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/firebase/create-poll` | Create a new live poll | ✅ |
| `GET` | `/api/firebase/live-polls` | Get all live polls for admin | ✅ |
| `GET` | `/api/firebase/live-poll/:pollId` | Get a single live poll | ✅ |
| `POST` | `/api/firebase/vote` | Submit a vote | ✅ |
| `POST` | `/api/poll/save-poll` | Save ended poll to DB | ✅ |
| `GET` | `/api/poll/ended-polls` | Get all ended polls | ✅ |

### Templates

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/template/save-template` | Save a poll template | ✅ |
| `GET` | `/api/template/get-template/:id` | Get template by ID | ✅ |

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    fullName      VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    userRole      VARCHAR(50),        -- 'user' or 'admin'
    pollsCreated  JSONB DEFAULT '[]',
    templateCreated JSONB DEFAULT '[]',
    pollsAttended JSONB DEFAULT '[]'
);

-- Ended polls table (archived from Firebase)
CREATE TABLE polls (
    id            SERIAL PRIMARY KEY,
    pollId        VARCHAR(255) UNIQUE,
    adminId       VARCHAR(255),
    pollName      VARCHAR(255),
    topic         VARCHAR(255),
    questions     JSONB DEFAULT '[]',
    pollStatus    BOOLEAN DEFAULT TRUE,
    usersAttended JSONB DEFAULT '[]',
    pollCreatedAt VARCHAR(50),
    pollEndsAt    VARCHAR(50)
);

-- Templates table
CREATE TABLE templates (
    id            SERIAL PRIMARY KEY,
    adminId       VARCHAR(255),
    templateName  VARCHAR(255),
    topic         VARCHAR(255),
    topicImage    TEXT,
    questions     JSONB DEFAULT '[]'
);
```

---

## ☁️ Deployment (Vercel)

Votek is fully deployed on **Vercel** — both the React frontend and the Express backend (as a Serverless Function).

### How Vercel Serves This App

```
 Browser
   │
   ▼
 Vercel CDN
   ├── /                    → Serves React build (client/build/)
   ├── /api/*               → Proxied to Express (api/index.js → server/index.js)
   └── /api-docs            → Swagger UI (served by Express)
```

The `/api` directory contains a single `index.js` that imports and re-exports the full Express app. Vercel treats this as a serverless function that handles all `/api/*` routes.

### Step-by-Step Deployment Guide

#### 1. Prepare Your Repository
```bash
# Make sure your code is committed and pushed to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New Project"** → **"Import Git Repository"**.
3. Select your GitHub repository.
4. Set the **Root Directory** to the project root (leave as-is if repo root = project).

#### 3. Configure Build Settings

| Setting | Value |
|---|---|
| **Framework Preset** | `Create React App` |
| **Build Command** | `npm run build` (or `cd client && npm run build`) |
| **Output Directory** | `client/build` |
| **Install Command** | `npm install` |

#### 4. Set Environment Variables

In the Vercel dashboard under **Settings → Environment Variables**, add:

| Variable | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Neon PostgreSQL connection string |
| `PRIMARY_SECRET_KEY` | `your_random_secret_1` | JWT signing secret |
| `REFRESH_SECRET_KEY` | `your_random_secret_2` | JWT refresh token secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Used for generating poll share links |

> ⚠️ **Important:** Each variable must be a separate entry. Never combine them on one line.

#### 5. Deploy
1. Click **"Deploy"**.
2. Vercel will install dependencies, build the React app, and publish.
3. Done! Your app is live.

#### 6. Redeploy After Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys on every push to main
```

---

## 🔧 Vercel Configuration

The `vercel.json` file (if present) controls routing. The key rule routes all `/api/*` traffic to the Express serverless function:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

The `api/index.js` file is the Vercel serverless entry point:

```js
// api/index.js
const app = require("../server/index.js");
module.exports = app;
```

> The React app is served as static files. All `/api/*` calls made by the frontend are automatically forwarded to the Express backend.

---

## 🩺 Troubleshooting

### Server Fails to Start Locally

**Problem:** `node index.js` exits immediately with code 1.

**Fix:** Check your `.env` file:
```env
# WRONG — all on one line:
PRIMARY_SECRET_KEY=abc123REFRESH_SECRET_KEY=xyz456

# CORRECT — each on its own line:
PRIMARY_SECRET_KEY=abc123
REFRESH_SECRET_KEY=xyz456
```

### Sign-up / Sign-in Not Working

| Symptom | Cause | Fix |
|---|---|---|
| Button does nothing | Server not running | Run `npm start` from project root |
| Network Error toast | Server down | Restart `server/index.js` |
| "User already exists" | Email taken | Use a different email |
| Redirect doesn't happen | State not updating | Check Redux store for error responses |

### Database Connection Failed

```bash
cd server
node test-db.js
# Should print: Database Connection: SUCCESS
```

If it fails, verify your `DATABASE_URL` in `server/.env` is correct and that your PostgreSQL instance is running.

### Vercel Build Fails

- Ensure `client/build` is the **Output Directory** in Vercel settings.
- Make sure all environment variables are set in Vercel dashboard.
- Check that `npm run build` works locally before deploying.

---

## ⚠️ Known Limitations

- **Live Polls** (create poll, vote, live results) require Firebase Realtime Database credentials. Without them, the `/api/firebase/*` routes are disabled. Sign-in and Sign-up are not affected.
- **Socket.io** real-time features may not work in Vercel's serverless environment (serverless functions are stateless). For full Socket.io support, deploy the server on a persistent host like **Railway**, **Render**, or **Fly.io**.
- **Excel download** works locally. In Vercel's serverless environment, large file streaming may time out after 10 seconds.
- Legacy `server/models/` directory contains old Mongoose schemas — these are unused and can be ignored.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m 'Add your feature'`.
4. Push to your branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## 📜 License

This project is for educational and demonstration purposes. Feel free to use it as a reference or starting point for your own projects.

---

<div align="center">
  <strong>Built with ❤️ using React, Node.js, and PostgreSQL</strong><br/>
  <strong>Deployed ☁️ on Vercel</strong>
</div>
