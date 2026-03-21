const express = require("express")
const cors = require('cors');
const {userController}= require("./routes/user.routes")
const { pool } = require("./config/db");
const authController=require("./routes/signin.routes");
const {convertPollData}= require("./utils/utils");
const {pollController}=require("./routes/poll.routes");
const {templateController}=require("./routes/template.routes")
// const {firebaseController}=require("./routes/poll.firebase.routes")
const app = express();
const PORT = process.env.PORT || 8080;
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

const swaggerUI= require("swagger-ui-express");
const YAML= require("yamljs");
const swaggerJsDocs= YAML.load("./api.yaml");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use("/api/user", userController);
app.use("/api/auth", authController);
app.use("/api/poll",pollController);
app.use("/api/template",templateController);
// app.use("/api/firebase",firebaseController);

// ---------------Socket.io setup to get live changes ------->
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

io.attach(server);

if (require.main === module) {
  server.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    
    try {
      const client = await pool.connect();
      console.log("✅ Database Connected: Successfully established connection to PostgreSQL");
      client.release();
    } catch (err) {
      console.error("❌ Database Connection Failed!");
      console.error("Reason:", err.message);
      console.log("Tip: Check your DATABASE_URL in the .env file.");
    }
  });
}

module.exports = app;