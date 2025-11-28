import type { SendMessageRequest } from "../types/Chat";
import { chatApiFetch } from "./fetch";

export function sendMessage(
    meetingId: string,
    request: SendMessageRequest
): Promise<Response> {
    const token = "Bearer " + localStorage.getItem("token");
    console.log(request);
    return chatApiFetch(`/${meetingId}/messages`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json", Authorization: token },
    });
}

export function getMessages(
    meetingId: string,
    limit: number = 50,
    startAfter?: number
): Promise<Response> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    if (startAfter !== undefined && startAfter !== null) {
        params.append("startAfter", String(startAfter));
    }

    const token = "Bearer " + localStorage.getItem("token");

    return chatApiFetch(`/${meetingId}/messages?${params.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
    });
}
