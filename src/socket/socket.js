// src/sockets/index.js
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URLS;

let socket = null;

export const connectSocket = (userId) => {
  if (!userId || (socket && socket.connected)) return;

  socket = io(BASE_URL, {
    query: { userId },
    withCredentials: true, // 👈 allow cookies if you’re using them
    // transports: ["websocket"], // 👈 force websockets (avoid long polling on Render)
    reconnection: true, // 👈 optional: auto-reconnect
    reconnectionAttempts: 5, // 👈 retry a few times
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
