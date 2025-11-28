// useSocketStore.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketStore {
    socket: Socket | null;
    connect: (token: string) => void;
    joinRoom: (meetingId: string) => void;
    onMessage: (callback: (msg: any) => void) => void;
    sendMessage: (meetingId: string, message: string) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,

    connect: (token: string) => {
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Socket conectado:", socket.id);
        });

        // Si ya había callbacks registrados, re-asignarlos
        const cb = (get() as any)._onMessage;
        if (cb) socket.on("receive_message", cb);

        set({ socket });
    },

    joinRoom: (meetingId) => {
        const socket = get().socket;
        if (socket) socket.emit("join_room", { meetingId });
    },

    onMessage: (callback) => {
        const socket = get().socket;
        (get() as any)._onMessage = callback;

        if (socket) socket.on("receive_message", callback);
    },

    sendMessage: (meetingId, message) => {
        const socket = get().socket;
        if (socket) socket.emit("send_message", { meetingId, message });
    },
}));