const socketIO = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected 🔌");

    
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
