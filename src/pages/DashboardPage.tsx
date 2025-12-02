import React from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Dashimage from "/Dashimage.png";
import { useUserStore } from "../stores/useUserStore";
import { useSocketStore } from "../stores/useSocketStore";
import { useRoomStore } from "../stores/useRoomStore";

/**
 * Dashboard page for authenticated users.
 * Provides quick access to join or create a meeting,
 * along with a welcoming layout.
 *
 * @component
 */
export default function DashboardPage() {
    const navigator = useNavigate();

    const { currentRoom, setCurrentRoom, setError, isCreating, setCreating } =
        useRoomStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    /** User profile state */
    const [user, setUser] = useState<any>(null);

    /**
     * Fetches the user profile when the page loads.
     *
     * @returns {Promise<void>}
     */


    /**
     * Redirects the user to the meeting page.
     * Used for both joining and creating a meeting (temporary behavior).
     *
     * @function
     */
    function joinMeeting() {
        if (!joinRoomId.trim()) {
            setError("Por favor ingresa un ID de reunión");
            return;
        }
        setIsJoining(true);
        setError(null);
        navigator(`/meeting/${joinRoomId}`);
    }

    const createMeeting = () => {
        if (!title.trim()) {
            setError("Por favor ingresa un título para la reunión");
            return;
        }
        
        const newMeetingId = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        navigator(`/meeting/${newMeetingId}`); 

        // setCreating(true);
        // setError(null);

    };

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === "Enter") {
            action();
        }
    };

    return (
        <div className="w-full px-6 md:px-14 lg:px-20 py-10">
            {/* --- WELCOME TITLE --- */}
            <h1 className="text-[28px] md:text-[34px] font-bold text-center text-[#304FFE] mb-10">
                Bienvenido {user?.firstName || ""} 👋
            </h1>

            {/* --- MAIN SECTION: LEFT (text + illustration) | RIGHT (forms) --- */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* ---------------- LEFT: TEXT + IMAGE ---------------- */}
                <div className="flex flex-col items-center">
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#304FFE] text-center mb-6 leading-tight">
                        Conéctate ahora con varias <br /> personas.
                    </h2>

                    <img
                        src={Dashimage}
                        alt="Dashboard illustration"
                        className="w-[350px] md:w-[450px] lg:w-[500px]"
                    />
                </div>

                {/* ---------------- RIGHT: FORMULARIOS ---------------- */}
                <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
                    {/* --- FORM: JOIN WITH ID --- */}
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <label className="block text-sm font-medium text-[#304FFE]">
                            Ingresa inmediatamente con la ID de la reunión
                        </label>

                        <input
                            type="text"
                            placeholder="Introduce el ID"
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE] transition"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, joinMeeting)}
                            disabled={isJoining}
                        />

                        <button
                            onClick={joinMeeting}
                            disabled={isJoining}
                            className={`w-full mt-4 py-2 bg-[#304FFE] rounded-full text-white font-semibold transition ${
                                isJoining
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#1E40FF]"
                            }`}
                        >
                            {isJoining ? "Uniéndose..." : "Unirse"}
                        </button>
                    </div>

                    {/* --- FORM: CREATE MEETING --- */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                        {/* HEADER GRADIENT*/}
                        <div className="px-6 py-3 bg-gradient-to-r from-[#304FFE] to-[#5E6BFF]">
                            <h3 className="text-white font-semibold text-lg">
                                Crear una reunión
                            </h3>
                        </div>

                        {/* BODY OF FORM */}
                        <div className="px-6 py-6">
                            {/* TITLE */}
                            <label className="block text-sm font-medium text-[#304FFE]">
                                Título de la reunión *
                            </label>

                            <input
                                type="text"
                                placeholder="Introduce un título"
                                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE]"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyPress={(e) =>
                                    handleKeyPress(e, createMeeting)
                                }
                                disabled={isCreating}
                            />

                            {/* DESCRIPTION */}
                            <label className="block text-sm font-medium text-[#304FFE] mt-5">
                                Descripción
                            </label>

                            <textarea
                                placeholder="Escribe una descripción (opcional)"
                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE] resize-none"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isCreating}
                            ></textarea>

                            {/* BUTTON OF CREATE */}
                            <button
                                onClick={createMeeting}
                                disabled={isCreating || !title.trim()}
                                className={`w-full mt-6 py-3 bg-[#304FFE] text-white font-semibold rounded-full transition ${
                                    isCreating || !title.trim()
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[#1E40FF]"
                                }`}
                            >
                                {isCreating ? "Creando..." : "Crear Reunión"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
