# Votek - Voting Application

Welcome to Votek! This is a full-stack web application designed for interactive voting and real-time result tracking.

## 🚀 Technologies Used

### Frontend (Client)

- **React.js**: A JavaScript library for building user interfaces.
- **Redux**: State management container for JavaScript apps.
- **Chakra UI**: A simple, modular, and accessible component library.
- **Socket.io-Client**: Real-time bidirectional event-based communication.
- **Chart.js & React-Chartjs-2**: Data visualization for live voting results.
- **Framer Motion**: An animation library for React.

### Backend (Server)

- **Node.js & Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB & Mongoose**: NoSQL database and object data modeling (ODM) library.
- **Socket.io**: Enables real-time, bi-directional communication between web clients and servers.
- **JWT (JsonWebToken)**: Secure authentication and authorization.
- **Swagger**: API documentation tool.
- **Firebase**: (Used for auxiliary cloud functions or storage).

## 📁 Project Structure

This repository is structured as a monorepo containing two main directories:

- `/client` - Contains the React frontend web application.
- `/server` - Contains the Node.js/Express backend API and real-time services.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory and add the necessary environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).

Start the server:

```bash
npm start
```

By default, the backend will run using `nodemon` on the specified port.

### 2. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The client app should now be running (typically on `http://localhost:3000`).

## 📚 API Documentation

The backend API is documented using Swagger. Once the server is running, you can typically view the API docs by navigating to:
`http://localhost:<PORT>/api-docs` (Check configuration in `server/index.js` for the exact route).
