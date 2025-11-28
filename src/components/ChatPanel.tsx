import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../lib/ChatService";
import type {
    GetMessageResponse,
    Message,
    SendMessageRequest,
} from "../types/Chat";
import { useUserStore } from "../stores/useUserStore";

interface Props {
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    roomId: string | undefined;
    showChat: boolean;
}

const ChatPanel: React.FC<Props> = ({ messagesEndRef, roomId, showChat }) => {
    const { profile } = useUserStore();
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const loadMessages = async () => {
        if (!roomId) return;
        const response = await getMessages(roomId);

        if (response.ok) {
            const data: GetMessageResponse = await response.json();
            setMessages(data.data);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        loadMessages();
    }, [showChat]);

    const handleSend = async () => {
        if (!roomId) return;
        const request: SendMessageRequest = {
            message: inputText,
            senderDisplayName: profile.firstName,
        };
        const response = await sendMessage(roomId, request);

        if (response.ok) {
            const result = await response.json();
            setMessages([...messages, result.data]);
            setInputText("");
        }
    };

    return (
        <div
            className="
            absolute right-0 top-0 h-full w-80 bg-[#1E1E1E] text-white 
            shadow-xl border-l border-gray-700 p-4 pb-24 flex flex-col
            animate-slide-left z-30
          "
        >
            <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-700/50 tracking-wide">
                Chat de la reunión
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {/* mensajes de ejemplo (puedes ligarlo al store real) */}
                {messages.length === 0 && (
                    <div className="text-sm text-gray-300">
                        No hay mensajes aún.
                    </div>
                )}
                {messages.map((message: any, index: number) => (
                    <li key={index}>
                        {message.senderDisplayName}: {message.message}
                    </li>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2 bg-[#2A2A2A] p-2 rounded-xl border border-gray-700/40 shadow-inner">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#1E1E1E] text-sm border border-gray-700 focus:border-blue-500 outline-none"
                />
                <button
                    className="bg-gradient-to-r from-[#304FFE] to-black px-4 py-2 rounded-lg"
                    onClick={handleSend}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
