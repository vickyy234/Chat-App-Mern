import { Server } from "socket.io";

const userSocketMap = {};

export let io;

export function initSocket(server, CLIENT_URL) {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  return io;
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
