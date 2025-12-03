import { io } from "socket.io-client";

// URL del servidor de chat (eisc-chat)
const SOCKET_URL = "http://localhost:9000";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("token");
        cb({ token });
    }
});
