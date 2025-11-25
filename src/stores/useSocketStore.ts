import { create } from "zustand";
import type { SocketState } from "../types/Socket";
import { io } from "socket.io-client";

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    error: null,
    connect: (roomId: string, userId: string) => {
        const connectionId: string = import.meta.env.VITE_SOCKET_URL || "";
        const socket = io(connectionId, { query: { roomId, userId } });

        socket.on("connect", () => {
            set({ isConnected: true, error: null });
        });
        socket.on("disconnect", () => {
            set({ isConnected: false });
        });

        socket.on("error", (error) => {
            set({ error: error.message });
        });

        set({ socket });
    },
    disconnect: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, isConnected: false });
    },
    emitEvent: (event: string, data: any) => {
        const { socket } = get();
        socket?.emit(event, data);
    },

    setError: (error) => set({ error }),
}));
