import type { SendMessageRequest } from "../types/Chat";
import { chatApiFetch } from "./fetch";


export function sendMessage(meetingId: string, request: SendMessageRequest): Promise<Response> {
    return chatApiFetch(`/${meetingId}/messages`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function getMessages(meetingId: string, limit: number = 50, startAfter?: number): Promise<Response> {
    const params = new URLSearchParams({
        limit: limit.toString()
    });

    if (startAfter) {
        params.append('startAfter', startAfter.toString());
    }

    return chatApiFetch(`/${meetingId}/messages?${params.toString}`, {
        method: "GET"
    });
}