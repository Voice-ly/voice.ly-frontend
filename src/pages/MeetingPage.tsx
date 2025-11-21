
//import { useState } from "react";
import { Link } from "react-router-dom";

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

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">

            {/* Online status */}
            <button className="absolute top-4 right-4 bg-[#3A3A3A] text-white text-sm px-4 py-1 rounded-md shadow-md hover:bg-[#505050] transition">
                ▣ Vista
            </button>
            <p className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-4 py-1 rounded-md transition">
            <span className="text-green-400 text-lg">●</span>
            En línea
            </p>


            {/* Video zone */}
            <div className="w-full h-full"></div>

            {/* Bottom control bar */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#304FFE] to-[#black] py-4 flex items-center justify-between px-5">

                {/* Central buttons */}
                <div className="flex gap-6 sm:gap-10 mx-auto">

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition">
                        <span className="text-3xl">🎤</span>
                        <span>Activar micrófono</span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition">
                        <span className="text-3xl">📷</span>
                        <span>Activar cámara</span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition">
                        <span className="text-3xl">👥</span>
                        <span>Participantes </span>
                    </button>

                    <button className="text-white flex flex-col items-center text-xs sm:text-sm hover:opacity-80 transition">
                        <span className="text-3xl">💬</span>
                        <span>Chat</span>
                    </button>

                </div>

                 {/* Exit button */}
                <Link to="/dashboard">
                    <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-red-700 transition">
                        Salir
                    </button>
                </Link>


            </div>

        </div>
    );
}
