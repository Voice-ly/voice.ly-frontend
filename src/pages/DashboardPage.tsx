import React from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Dashimage from "/Dashimage.png";

import { useUserStore } from "../stores/useUserStore";
import { useRoomStore } from "../stores/useRoomStore";
import { useMeetingApiStore } from "../stores/useMeetingApiStore";


/**
 * Dashboard Component
 * 
 * This component renders "Dashboard" page of the application. It includes sections to create and join
 * meetings
 * 
 * @returns the Dashboard page
 */
export default function DashboardPage() {
    const navigator = useNavigate();

    const { profile } = useUserStore();
    const { setCurrentRoom, setError, isCreating, setCreating } =
        useRoomStore();
    const { createMeeting, joinMeeting, error } = useMeetingApiStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(profile);
    }, [profile]);

    //  JOIN MEETING

    /**
     * Handles the Joining a meeting action
     * 
     * @returns : joins the user to the meeting
     */
    const handleJoinMeeting = async () => {
        if (!joinRoomId.trim()) {
            setError("Por favor ingresa un ID");
            return;
        }
        setIsJoining(true);
        setError(null);

        const meeting = await joinMeeting(joinRoomId);

        if (!meeting) {
            setIsJoining(false);
            return;
        }

        setCurrentRoom(meeting);
        setIsJoining(false);
        navigator(`/meeting/${joinRoomId}`);
    };

    //  CREATE MEETING

    /**
     * Handles the cration of a meeting
     * 
     * @returns : the Meeting created
     */
    const handleCreateMeeting = async () => {
        if (!title.trim()) {
            setError("Por favor ingresa un título");
            return;
        }

        setCreating(true);
        setError(null);

        const meeting = await createMeeting(title, description);

        if (!meeting) {
            setCreating(false);
            return;
        }

        setCurrentRoom(meeting);
        setCreating(false);

        navigator(`/meeting/${meeting.id}`);
    };

    /**
     * Handles the key event to send on every section.
     * 
     * @param e : Event of pressing "Enter" key
     * @param action : the action of the section.
     */
    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === "Enter") action();
    };

    /**
     * Renders the Dashboard page
     */
    return (
        <div className="w-full px-6 md:px-14 lg:px-20 py-10">
            <h1 className="text-[28px] md:text-[34px] font-bold text-center text-[#304FFE] mb-10">
                Bienvenido {user?.firstName || ""} 👋
            </h1>

            {/* Errores del store de API */}
            {error && (
                <div className="max-w-lg mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side */}
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

                {/* Right side */}
                <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
                    {/* JOIN */}
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <label className="block text-sm font-medium text-[#304FFE]">
                            Ingresa inmediatamente con la ID de la reunión
                        </label>

                        <input
                            type="text"
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE]"
                            placeholder="Introduce el ID"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            onKeyPress={(e) =>
                                handleKeyPress(e, handleJoinMeeting)
                            }
                            disabled={isJoining}
                        />

                        <button
                            onClick={handleJoinMeeting}
                            disabled={isJoining}
                            className={`w-full mt-4 py-2 bg-[#304FFE] rounded-full text-white font-semibold transition ${isJoining
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#1E40FF]"
                                }`}
                        >
                            {isJoining ? "Uniéndose..." : "Unirse"}
                        </button>
                    </div>

                    {/* CREATE MEETING */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                        <div className="px-6 py-3 bg-gradient-to-r from-[#304FFE] to-[#5E6BFF]">
                            <h3 className="text-white font-semibold text-lg">
                                Crear una reunión
                            </h3>
                        </div>

                        <div className="px-6 py-6">
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
                                    handleKeyPress(e, handleCreateMeeting)
                                }
                                disabled={isCreating}
                            />

                            <label className="block text-sm font-medium text-[#304FFE] mt-5">
                                Descripción
                            </label>
                            <textarea
                                placeholder="Escribe una descripción (opcional)"
                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE]"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isCreating}
                            ></textarea>

                            <button
                                onClick={handleCreateMeeting}
                                disabled={isCreating || !title.trim()}
                                className={`w-full mt-6 py-3 bg-[#304FFE] text-white font-semibold rounded-full transition ${isCreating || !title.trim()
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[#1E40FF]"
                                    }`}
                            >
                                {isCreating ? "Creando..." : "Crear reunión"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
