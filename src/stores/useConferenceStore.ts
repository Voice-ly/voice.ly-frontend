import { create } from "zustand";
import { type ConferenceState } from "../types/Conference";
import { devtools } from "zustand/middleware";

const initialState = {
    room: null,
    participants: [],
    currentUser: null,
    localStream: null,
    screenStream: null,
    isConnected: false,
    isJoining: false,
};

export const useConferenceStore = create<ConferenceState>()(
    devtools(
        (set, get) => ({
            ...initialState,
            setRoom: (room) => set({ room }),
            setParticipants: (participants) => set({ participants }),
            addParticipant: (participant) =>
                set((state) => ({
                    participants: [...state.participants, participant],
                })),
            removeParticipant: (userId) =>
                set((state) => ({
                    participants: state.participants.filter(
                        (p) => p.userId !== userId
                    ),
                })),
            updateParticipant: (userId, updates) =>
                set((state) => ({
                    participants: state.participants.map((p) =>
                        p.userId === userId ? { ...p, ...updates } : p
                    ),
                })),
            setLocalStream: (stream) => set({ localStream: stream }),
            toggleAudio: () => {
                const state = get();
                if (state.currentUser) {
                    const updated = !state.currentUser.isAudioEnabled;
                    state.currentUser.isAudioEnabled = updated;
                    state.updateParticipant(state.currentUser.userId, {
                        isAudioEnabled: updated,
                    });
                }
            },
            toggleVideo: () => {
                const state = get();
                if (state.currentUser) {
                    const updated = !state.currentUser.isVideoEnabled;
                    state.currentUser.isVideoEnabled = updated;
                    state.updateParticipant(state.currentUser.userId, {
                        isVideoEnabled: updated,
                    });
                }
            },
            setConnectionStatus: (status) => set({ isConnected: status }),
            setJoiningStatus: (status) => set({ isJoining: status }),
            reset: () => set(initialState),
        }),
        { name: "conference-store" }
    )
);
