export interface Participant {
    id: string;
    userId: string;
    name: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    stream?: MediaStream;
    isCurrentUser?: boolean;
}

interface Room {
    id: string;
    name: string;
    maxParticipants: number;
    isLocked: boolean;
}

export interface ConferenceState {
    room: Room | null;
    participants: Participant[];
    currentUser: Participant | null;

    // Media states
    localStream: MediaStream | null;
    screenStream: MediaStream | null;
    isConnected: boolean;
    isJoining: boolean;

    // Actions
    setRoom: (room: Room) => void;
    setParticipants: (participants: Participant[]) => void;
    addParticipant: (participant: Participant) => void;
    removeParticipant: (userId: string) => void;
    updateParticipant: (userId: string, updates: Partial<Participant>) => void;
    setLocalStream: (stream: MediaStream | null) => void;
    setScreenStream: (stream: MediaStream | null) => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
    setConnectionStatus: (status: boolean) => void;
    setJoiningStatus: (status: boolean) => void;
    reset: () => void;
}
