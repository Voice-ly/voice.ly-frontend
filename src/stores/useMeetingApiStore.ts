import { create } from "zustand";

interface MeetingApiState {
    createMeeting: (title: string, description: string) => Promise<any>;
    joinMeeting: (meetingId: string) => Promise<any>;
    getMeetingById: (meetingId: string) => Promise<any>;
    error: string | null;
    setError: (msg: string | null) => void;
}

// URL 
const BASE_URL = "https://voice-ly.onrender.com/api/meetings";

export const useMeetingApiStore = create<MeetingApiState>((set) => ({
    error: null,

    setError: (msg) => set({ error: msg }),

    // CREATE MEETING → POST /api/meetings
    createMeeting: async (title, description) => {
        try {
            const resp = await fetch(`${BASE_URL}`, {
                method: "POST",
                credentials: "include", // Envia la cookie token
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description: description || "Reunión sin descripción",
                }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                set({ error: data.message || "Error creando la reunión" });
                return null;
            }

            return data.data; 
        } catch {
            set({ error: "No se pudo conectar con el servidor" });
            return null;
        }
    },

    // JOIN MEETING → POST /api/meetings/:id/join
    joinMeeting: async (meetingId) => {
        try {
            const resp = await fetch(`${BASE_URL}/${meetingId}/join`, {
                method: "POST",
                credentials: "include",
            });

            const data = await resp.json();

            if (!resp.ok) {
                set({ error: data.message || "Error al unirse a la reunión" });
                return null;
            }

            return data.data;
        } catch {
            set({ error: "No se pudo conectar con el servidor" });
            return null;
        }
    },

    // GET MEETING BY ID → GET /api/meetings/:id
    getMeetingById: async (meetingId) => {
        try {
            const resp = await fetch(`${BASE_URL}/${meetingId}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await resp.json();

            if (!resp.ok) {
                set({ error: data.message || "Error obteniendo la reunión" });
                return null;
            }

            return data.data;
        } catch {
            set({ error: "No se pudo conectar con el servidor" });
            return null;
        }
    },
}));
