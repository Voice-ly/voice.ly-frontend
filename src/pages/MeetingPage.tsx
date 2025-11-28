import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useRoomStore } from "../stores/useRoomStore";
import { useMeetingApiStore } from "../stores/useMeetingApiStore";
import ChatPanel from "../components/ChatPanel";

export default function MeetingPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const { profile } = useUserStore();
    const { currentRoom, setCurrentRoom } = useRoomStore();
    const { getMeetingById } = useMeetingApiStore();
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Cargar reunión cuando cambia roomId (y evitar petición si ya la tenemos)
    useEffect(() => {
        const loadMeeting = async () => {
            if (!roomId) {
                setLoading(false);
                return;
            }

            // si currentRoom ya es la misma no volver a pedir
            if (currentRoom && currentRoom.id === roomId) {
                setLoading(false);
                return;
            }

            const meeting = await getMeetingById(roomId);
            if (meeting) {
                setCurrentRoom(meeting);
            }
            setLoading(false);
        };

        loadMeeting();
        // eslint-disable-next-line react-hooks/exhaustive-deps

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                setShowChat(!showChat);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        roomId /* deliberately not including getMeetingById/setCurrentRoom if they are stable */,
    ]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-white">
                Cargando reunión...
            </div>
        );
    }

    // Si no se encontró la reunión después de cargar
    if (!currentRoom) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-2xl font-semibold mb-4">
                        Reunión no encontrada
                    </p>
                    <Link to="/dashboard">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Volver al dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleCopyLink = async () => {
        const url = `${window.location.origin}/meeting/${currentRoom.id}`;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                // puedes mostrar un toast o feedback visual
                // ejemplo simple:
                alert("Enlace copiado al portapapeles");
            } else {
                // fallback
                const tmp = document.createElement("textarea");
                tmp.value = url;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand("copy");
                document.body.removeChild(tmp);
                alert("Enlace copiado al portapapeles (fallback)");
            }
        } catch (e) {
            console.error("No se pudo copiar el enlace", e);
            alert("No se pudo copiar el enlace");
        }
    };

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            {/* INFO DE LA SALA */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-white bg-[#1E1E1E] px-6 py-2 rounded-lg shadow-md z-20">
                <p className="text-sm opacity-80">ID de la reunión:</p>
                <p className="text-lg font-bold break-words">
                    {currentRoom.id}
                </p>

                <button
                    onClick={handleCopyLink}
                    className="mt-2 text-blue-400 underline text-sm"
                >
                    Copiar enlace
                </button>
            </div>

            {/* Cabecera con nombre de usuario */}
            <div className="absolute top-4 right-4 text-white z-20">
                <p className="text-sm opacity-80">Conectado como</p>
                <p className="text-base font-medium">
                    {profile?.firstName || "Usuario"}
                </p>
            </div>

            {/* Aquí iría la zona de video / canvas */}
            <div className="w-full h-full" />

            {/* CHAT PANEL */}
            {showChat && (
                <ChatPanel
                    roomId={roomId}
                    showChat={showChat}
                    messagesEndRef={messagesEndRef}
                />
            )}

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#304FFE] to-black py-4 flex items-center justify-between px-5 z-20">
                <div className="flex gap-6 sm:gap-10 mx-auto">
                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80"
                        title="Activar/Desactivar de microfono (Ctrl + D)"
                    >
                        <span className="text-3xl">🎤</span>
                        <span>Mic</span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80"
                        title="Activar/Desactivar camara (Ctrl + E)"
                    >
                        <span className="text-3xl">📷</span>
                        <span>Cam</span>
                    </button>

                    <button
                        onClick={() => setShowChat((s) => !s)}
                        className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80"
                        title="Mostrar/Cerrar chat (Esc)"
                    >
                        <span className="text-3xl">💬</span>
                        <span>{showChat ? "Cerrar chat" : "Chat"}</span>
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
