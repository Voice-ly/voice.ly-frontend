// stores/useRoomStore.ts
import { create } from "zustand";

interface Room {
    id: string;
    name: string;
    maxParticipants: number;
    isLocked: boolean;
    participantCount: number;
    createdBy: string;
    createdAt: Date;
}

interface RoomState {
    rooms: Room[];
    currentRoom: Room | null;
    isCreating: boolean;
    error: string | null;

    // Actions
    setRooms: (rooms: Room[]) => void;
    setCurrentRoom: (room: Room | null) => void;
    addRoom: (room: Room) => void;
    removeRoom: (roomId: string) => void;
    setCreating: (status: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    currentRoom: null,
    isCreating: false,
    error: null,

    setRooms: (rooms) => set({ rooms }),
    setCurrentRoom: (room) => set({ currentRoom: room }),
    addRoom: (room) =>
        set((state) => ({
            rooms: [...state.rooms, room],
        })),
    removeRoom: (roomId) =>
        set((state) => ({
            rooms: state.rooms.filter((room) => room.id !== roomId),
        })),
    setCreating: (status) => set({ isCreating: status }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
