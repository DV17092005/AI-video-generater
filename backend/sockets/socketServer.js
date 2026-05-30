const socketio = require("socket.io");

const initSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected");
    socket.emit("progress", "Video generation started");
  });
};

module.exports = initSocket;
