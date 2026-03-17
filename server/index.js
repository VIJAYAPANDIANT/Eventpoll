const express = require("express")
const cors = require('cors');
const {userController}= require("./routes/user.routes")
const { pool } = require("./config/db");
const authController=require("./routes/signin.routes");
const {convertPollData}= require("./utils/utils");
const {pollController}=require("./routes/poll.routes");;
const {templateController}=require("./routes/template.routes")
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
app.use("/user", userController);
app.use("/auth", authController);
app.use("/poll",pollController);
app.use("/template",templateController);

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

server.listen(PORT, async () => {
  try {
    const client = await pool.connect();
    console.log("Server is connected to PostgreSQL (Neon) database");
    client.release();
    console.log(`server is running on ${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});