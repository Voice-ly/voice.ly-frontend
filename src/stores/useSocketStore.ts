// useSocketStore.ts
import { create } from "zustand";
import type { SocketState } from "../types/Socket";
import { io, Socket } from "socket.io-client";

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    error: null,

    connect: (roomId?: string, userId?: string, token?: string) => {
        const connectionUrl: string = import.meta.env.VITE_SOCKET_URL || "";

        // Si ya existe un socket previo, evitar duplicados
        const oldSocket = get().socket;
        if (oldSocket) {
            oldSocket.disconnect();
        }

        // Crear socket sin autoconectar
        const socket: Socket = io(connectionUrl, {
            autoConnect: false,
            auth: {
                token,         
                roomId,
                userId,
            },
            transports: ["websocket"],
        });

        // Listeners
        socket.on("connect", () => {
            set({ isConnected: true, error: null });
        });

        socket.on("disconnect", () => {
            set({ isConnected: false });
        });

        socket.on("connect_error", (err) => {
            set({ error: err.message });
        });

        socket.on("error", (err) => {
            set({ error: err.message });
        });

        set({ socket });

        socket.connect(); // conectar después de asignarlo
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