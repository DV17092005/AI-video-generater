require("dotenv").config();
const http = require("http");
const app = require("./app");
const dbModule = require("./config/db");
const connectDB = typeof dbModule === 'function' ? dbModule : dbModule.connectDB;
const initSocket = require("./sockets/socketServer");

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});