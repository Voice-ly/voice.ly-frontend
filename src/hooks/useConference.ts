import { useEffect } from "react";
import { useConferenceStore } from "../stores/useConferenceStore";
import { useSocketStore } from "../stores/useSocketStore";
import type { Participant } from "../types/Conference";

export const useConference = (roomId: string, userId: string) => {
    const {
        room,
        participants,
        currentUser,
        localStream,
        screenStream,
        isConnected,
        isJoining,
        setRoom,
        setParticipants,
        addParticipant,
        removeParticipant,
        updateParticipant,
        setLocalStream,
        setConnectionStatus,
        setJoiningStatus,
        reset,
    } = useConferenceStore();

    //const { socket, Conference, disconnect, emitEvent } = useSocketStore();
    const { socket, disconnect } = useSocketStore();

    useEffect(() => {
        setJoiningStatus(true);
        //Conference(roomId, userId);
        return () => {
            disconnect();
            reset();
        };
    }, [roomId, userId]);

    useEffect(() => {
        if (!socket) return;

        const handleUserJoined = (data: { user: any; participants: any[] }) => {
            addParticipant(data.user);
            setParticipants(data.participants);
        };

        const handleUserLeft = (data: {
            userId: string;
            participants: any[];
        }) => {
            removeParticipant(data.userId);
            setParticipants(data.participants);
        };

        const handleUserUpdated = (data: { userId: string; updates: any }) => {
            updateParticipant(data.userId, data.updates);
        };

        const handleRoomInfo = (data: { room: any; participants: any[] }) => {
            setRoom(data.room);
            setParticipants(data.participants);
            setConnectionStatus(true);
            setJoiningStatus(false);
        };

        socket?.on("user-joined", handleUserJoined);
        socket?.on("user-left", handleUserLeft);
        socket?.on("user-updated", handleUserUpdated);
        socket?.on("room-info", handleRoomInfo);

        return () => {
            socket?.off("user-joined", handleUserJoined);
            socket?.off("user-left", handleUserLeft);
            socket?.off("user-updated", handleUserUpdated);
            socket?.off("room-info", handleRoomInfo);
        };
    }, [socket]);

    const initializeMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            const user: Participant = {
                id: userId,
                userId,
                name: `Usuario ${userId.slice(0, 8)}`,
                isAudioEnabled: true,
                isVideoEnabled: true,
                stream,
                isCurrentUser: true,
            };

            //emitEvent("join-room", { roomId, user });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const canJoin = participants.length < (room?.maxParticipants || 10);

    const toggleAudio = () => {
        const { toggleAudio } = useConferenceStore.getState();
        toggleAudio();
        //emitEvent("toggle-audio", { userId });
    };

    const toggleVideo = () => {
        const { toggleVideo } = useConferenceStore.getState();
        toggleVideo();
        //emitEvent("toggle-video", { userId });
    };

    const leaveRoom = () => {
        //emitEvent("leave-room", { userId, roomId });
        disconnect();
        reset();
    };

    return {
        room,
        participants,
        currentUser,
        localStream,
        screenStream,
        isConnected,
        isJoining,
        canJoin,
        initializeMedia,
        toggleAudio,
        toggleVideo,
        leaveRoom,
    };
};
