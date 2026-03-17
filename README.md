# Votek - High-Performance Real-Time Voting Application

### 📝 Brief Overview

**Votek** is a modern, full-stack polling and voting application designed for real-time interaction and dynamic result tracking. Built as a monorepo, it leverages a robust React frontend and a scalable Express backend to provide a seamless user experience for creating, participating in, and analyzing polls.

---

### 🔍 Detailed Explanation

#### 🏗️ Architecture & Core Philosophy

Votek is designed with a **Monorepo** architecture, using **NPM Workspaces** to manage both the `client` and `server` within a single repository. This ensures atomic updates, unified dependency management, and a simplified development workflow.

#### ⚡ Key Features

- **Real-Time Live Updates**: Utilizing **Socket.io**, the platform provides instant feedback. When a vote is cast, it reflects immediately on the results chart for all users without a page refresh.
- **Dynamic Data Visualization**: Powered by **Chart.js** and **React-Chartjs-2**, poll results are presented in stunning, interactive charts.
- **Secure Authentication**: Implementation of **JWT (JSON Web Tokens)** for session management and **Bcryptjs** for secure password hashing. It also features **Google OAuth** integration for quick access.
- **Advanced Export Capabilities**: Users can export poll data to **Excel** format using **ExcelJS**, making it ideal for offline analysis.
- **Responsive & Premium Design**: Built using **Chakra UI** and **Framer Motion**, the interface is sleek, accessible, and fully responsive across all device sizes.
- **API Documentation**: Integrated **Swagger** UI provides a live, interactive playground for testing backend endpoints.

#### 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Redux, Chakra UI, Framer Motion, Axios, Socket.io-client, Chart.js |
| **Backend** | Node.js, Express, Socket.io, JWT, Bcryptjs, ExcelJS, Swagger |
| **Database** | PostgreSQL (Neon), MongoDB (Hybrid Support), Firebase (Real-time features) |
| **Deployment** | Vercel (Production-optimized configuration included) |

---

### 🚀 Getting Started

#### Prerequisites

- **Node.js**: v16 or higher
- **NPM**: v7 or higher (for workspace support)
- **Database**: PostgreSQL (e.g., Neon.tech) and a Firebase project if using real-time features.

#### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Eventpoll
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create a `.env` file in the `server` directory.
   - Required variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`.

4. **Run the application**:
   - **Development**: `npm start` (Runs both client and server concurrently).
   - **Client only**: `npm run start:client`
   - **Server only**: `npm run start:server`

---

### ☁️ Deployment

This project is configured for one-click deployment to **Vercel**.
- The root includes a `vercel.json` and a `build` script that automatically handles the monorepo routing and static build process.
- All API requests are automatically routed to the Node.js server via the `/api` prefix.

---

### 📚 API Documentation
Explore and test the API endpoints directly using the built-in Swagger interface:
- **Local**: `http://localhost:8080/api-docs`
- **Production**: `https://your-app-domain.com/api-docs`
