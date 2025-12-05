import { io } from "socket.io-client";

// URL del servidor de chat (eisc-chat)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("token");
        cb({ token });
    }
});
