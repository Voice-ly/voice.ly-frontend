import type { Socket } from "socket.io-client";

export interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    error: string | null;

    //Methods
    connect: (roomId: string, userId: string) => void;
    disconnect: () => void;
    emitEvent: (event: string, data: any) => void;
    setError: (error: string | null) => void;
}
