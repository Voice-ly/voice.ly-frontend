import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface ChatSocketState {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
}

/**
 * Function that manages chat sockets
 */
export const useChatSocketStore = create<ChatSocketState>((set, get) => ({
  socket: null,

  connect: (token: string) => {
    const URL = import.meta.env.VITE_CHAT_SOCKET_URL;

    // evitar múltiples conexiones
    if (get().socket) return;

    const socket = io(URL, {
      auth: { token },
      transports: ["websocket", "polling"], // recomendado
    });

    socket.on("connect", () => console.log("🟢 Chat socket connected"));
    socket.on("disconnect", () => console.log("🔴 Chat socket disconnected"));

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.disconnect();
    set({ socket: null });
  },
}));
