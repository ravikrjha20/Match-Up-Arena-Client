// src/sockets/index.js
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.PROD
  ? "https://match-up-arena-server-1.onrender.com"
  : "http://localhost:3000";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId || (socket && socket.connected)) return socket;

  socket = io(BASE_URL, {
    path: "/socket.io",
    transports: ["websocket"], // ⭐ no polling
    auth: { userId },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
