const fs = require("fs");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(dotenvPath)) {
  require("dotenv").config({ path: dotenvPath });
}
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./sockets/socketServer");

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});