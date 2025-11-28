import { useEffect, useState } from "react";
import { getMessages } from "../lib/ChatService";
import { useUserStore } from "../stores/useUserStore";
import { useSocketStore } from "../stores/useSocketStore";
import type { GetMessageResponse, Message } from "../types/Chat";

interface Props {
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    roomId: string | undefined;
    showChat: boolean;
}

const ChatPanel: React.FC<Props> = ({ messagesEndRef, roomId }) => {
    const { profile } = useUserStore();
    const { socket, connect, joinRoom, onMessage, sendMessage: sendSocketMessage } =
        useSocketStore();

    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // 1. Conectar socket si no está conectado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        connect(token);
    }, []);

    // 2. Cargar historial + unirse a la sala + escuchar mensajes
    useEffect(() => {
        if (!roomId || !socket) return;

        joinRoom(roomId);
        loadMessages();

        onMessage((msg: Message) => {
            if (msg.meetingId !== roomId) return;

            setMessages((prev) => [...prev, msg]);

            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, [roomId, socket]);

    // cargar historial desde HTTP
    const loadMessages = async () => {
        if (!roomId) return;

        const response = await getMessages(roomId);
        if (response.ok) {
            const data: GetMessageResponse = await response.json();
            setMessages(data.data);
        }
    };

    // enviar mensaje por websocket
    const handleSend = () => {
        if (!roomId || !inputText.trim()) return;

        sendSocketMessage(roomId, inputText);
        setInputText("");
    };

    // obtiene nombre que se va a mostrar
    const getSenderName = (msg: Message) => {
        if (msg.senderId === profile.id) return profile.firstName;

        return msg.senderDisplayName || "Usuario";
    };

    return (
        <div className="absolute right-0 top-0 h-full w-80 bg-[#1E1E1E] text-white p-4 pb-24 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-700/50">
                Chat de la reunión
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg, i) => (
                    <div key={i}>
                        <strong>{getSenderName(msg)}</strong>: {msg.message}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex gap-2 bg-[#2A2A2A] p-2 rounded-xl">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#1E1E1E]"
                    placeholder="Escribe un mensaje..."
                />
                <button onClick={handleSend} className="px-4 py-2 bg-blue-600 rounded-lg">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;