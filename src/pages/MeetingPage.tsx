import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { socket } from "../lib/Socket";

/**
 * MeetingPage Component
 * ---------------------
 * Displays the meeting UI with:
 * - A video area (placeholder for future video stream).
 * - Controls for microphone, camera, participants, and chat.
 * - Online status indicator.
 * - Exit button that redirects to the dashboard.
 *
 * @component
 *
 * @returns {JSX.Element} The meeting interface layout.
 *
 * @example
 * <MeetingPage />
 *
 * @description
 * This page simulates the main meeting interface.
 * Future features can include:
 * - Live video rendering
 * - WebRTC integration
 * - Real-time participant list and chat
 */

export default function MeetingPage() {

    const [showChat, setShowChat] = useState(false);

    type Message = { text: string; self: boolean; name: string };
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsersCount, setOnlineUsersCount] = useState(0);

    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    const { profile } = useUserStore();
    const { id: meetingId } = useParams();
    const [guestId] = useState(() => "guest-" + Math.random().toString(36).substr(2, 9));
    const userId = profile?.id || guestId;
    const userName = profile?.firstName || "Invitado";

    useEffect(() => {
        if (!meetingId) return;

        socket.connect();

        socket.emit("newUser", { userId, name: userName, roomId: meetingId });

        const handleMessage = (payload: { userId: string; message: string; name: string }) => {
            setMessages((prev) => [
                ...prev,
                { 
                    text: payload.message, 
                    self: payload.userId === userId,
                    name: payload.name 
                },
            ]);
        };

        socket.on("chat:message", handleMessage);

        const handleUsersOnline = (users: any[]) => {
            setOnlineUsersCount(users.length);
        };
        socket.on("usersOnline", handleUsersOnline);

        return () => {
            socket.off("chat:message", handleMessage);
            socket.off("usersOnline", handleUsersOnline);
            socket.disconnect();
        };
        return () => {
            socket.off("chat:message", handleMessage);
            socket.off("usersOnline", handleUsersOnline);
            socket.disconnect();
        };
    }, [userId, userName, meetingId]);

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        
        socket.emit("chat:message", {
            userId,
            name: userName,
            message: inputValue.trim(),
            roomId: meetingId,
        });

        setInputValue("");
    };

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            {/* Online status */}
            <button className="absolute top-4 right-4 bg-[#3A3A3A] text-white text-sm px-4 py-1 rounded-md shadow-md hover:bg-[#505050] transition">
                ▣ Vista
            </button>

            <p className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-4 py-1 rounded-md transition">
                <span className="text-green-400 text-lg">●</span>
                En línea ({onlineUsersCount})
            </p>

            <div className="w-full h-full"></div>

            {/* CHAT PANEL */}
            {showChat && (
                <div
                    className="
                    absolute right-0 top-0 h-full w-80 bg-[#1E1E1E] text-white 
                    shadow-xl border-l border-gray-700 p-4 pb-24 flex flex-col
                    animate-slide-left
                "
                >
                    {/* Header */}
                    <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-700/50 tracking-wide">
                        Chat de la reunión
                    </h2>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${
                                    msg.self ? "items-end" : "items-start"
                                }`}
                            >
                                <span className="text-xs text-gray-400 mb-1 px-1">
                                    {msg.self ? "Tú" : msg.name}
                                </span>
                                <div
                                    className={`w-fit max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-md break-words 
                                    ${
                                        msg.self
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-[#2E2E2E] text-white rounded-bl-none border border-gray-700/40"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="mt-4 flex gap-2 bg-[#2A2A2A] p-2 rounded-xl border border-gray-700/40 shadow-inner">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="flex-1 px-3 py-2 rounded-lg bg-[#1E1E1E] text-sm border border-gray-700 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition outline-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-gradient-to-r from-[#304FFE] to-black hover:bg-blue-700 active:scale-95 transition px-4 py-2 rounded-lg shadow-md text-lg"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#304FFE] to-black py-4 flex items-center justify-between px-5">
                <div className="flex gap-6 sm:gap-10 mx-auto">
                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition cursor-pointer">
                        <span className="text-3xl">🎤</span>
                        <span>Activar micrófono</span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition cursor-pointer">
                        <span className="text-3xl">📷</span>
                        <span>Activar cámara</span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition cursor-pointer">
                        <span className="text-3xl">👥</span>
                        <span>Participantes</span>
                    </button>

                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition"
                    >
                        <span className="text-3xl">💬</span>
                        <span>Chat</span>
                    </button>
                </div>

                <Link to="/dashboard">
                    <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-red-700 transition">
                        Salir
                    </button>
                </Link>
            </div>
        </div>
    );
}
