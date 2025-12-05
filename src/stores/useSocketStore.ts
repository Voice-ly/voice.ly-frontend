import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketStore {
    socket: Socket | null;

    // CHAT ONLY
    connect: (token: string) => void;
    joinRoom: (meetingId: string) => void;
    onMessage: (callback: (msg: any) => void) => void;
    sendMessage: (meetingId: string, message: string) => void;

    disconnect: () => void;
}

/**
 * Function in charge of managing sockets for chat
 */
export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,

    connect: (token: string) => {
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
            transports: ["websocket"]
        });

        socket.on("connect", () => {
            console.log("Chat socket conectado:", socket.id);
        });

        // restaurar listener si existía
        const savedCallback = (get() as any)._onMessage;
        if (savedCallback) socket.on("receive_message", savedCallback);

        set({ socket });
    },

    joinRoom: (meetingId) => {
        get().socket?.emit("join_room", { meetingId });
    },

    onMessage: (callback) => {
        const socket = get().socket;

        (get() as any)._onMessage = callback;

        if (socket) socket.on("receive_message", callback);
    },

    sendMessage: (meetingId, message) => {
        get().socket?.emit("send_message", { meetingId, message });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) socket.disconnect();
        set({ socket: null });
    }
}));