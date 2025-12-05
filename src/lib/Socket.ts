import { io } from "socket.io-client";

// URL of chat server (eisc-chat)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

/**
 * Creates and configures a Socket.IO client instance used for real-time
 * communication in the application. 
 */
export const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("token");
        cb({ token });
    }
});
