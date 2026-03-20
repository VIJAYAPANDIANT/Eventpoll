# 🗳️ Votek - Real-Time Voting Platform

**Votek** is a premium, full-stack polling application designed for real-time interaction and dynamic data visualization.

---

### 🏗️ Modern Architecture
Built as a **Monorepo** using **NPM Workspaces**, Votek separates concerns while keeping the developer experience unified:
- `/client`: React (Chakra UI + Framer Motion)
- `/server`: Node.js & Express (PostgreSQL + JWT)
- `/api`: Vercel-specific serverless function proxy

### 🚀 Key Features
- **⚡ Real-Time**: Instant result updates via Socket.io.
- **📊 Interactive Charts**: Beautiful data viz with Chart.js.
- **🔐 Secure Auth**: JWT and Google OAuth 2.0.
- **📥 Data Export**: Export results to Excel (.xlsx).
- **🎨 Premium UI**: Glassmorphism and smooth animations.

---

### ☁️ Vercel Deployment (Recommended)

This project is optimized for **Vercel's Modern Architecture**. To deploy:

1.  **Connect to Vercel**: Import this repository into a new Vercel project.
2.  **Configure Root Directory**: Leave as `.` (the project root).
3.  **Set Environment Variables**:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `JWT_SECRET`: A long, secure random string.
    - `CI`: Set to `false` to ignore lint warnings during build.
4.  **One-Time Dashboard Rewrite**: (Optional but recommended) In Vercel Settings -> Rewrites, map all unknown paths to `client/build/index.html`.

### 🛠️ Local Development

1.  **Install**: `npm install`
2.  **Environment**: Create `server/.env` based on `server/env.template`.
3.  **Run**: `npm start` (Starts both frontend and backend).

---

### 📚 API Playground
Explore the API endpoints directly via Swagger:
- **Local**: `http://localhost:8080/api-docs`
- **Production**: `https://<your-app>.vercel.app/api-docs`
