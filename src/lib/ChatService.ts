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
        headers: { "Content-Type": "application/json", authorization: token },
    });
}

export function getMessages(
    meetingId: string,
    limit: number = 50,
    startAfter?: number
): Promise<Response> {
    const params = new URLSearchParams({
        limit: limit.toString(),
    });
    const token = "Bearer " + localStorage.getItem("token");

    if (startAfter) {
        params.append("startAfter", startAfter.toString());
    }

    return chatApiFetch(`/${meetingId}/messages?${params.toString}`, {
        method: "GET",
        headers: { authorization: token },
    });
}
