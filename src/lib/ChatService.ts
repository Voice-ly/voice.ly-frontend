import type { SendMessageRequest } from "../types/Chat";
import { apiFetch } from "./fetch";

export function sendMessage(
    meetingId: string,
    request: SendMessageRequest
): Promise<Response> {
    if (!meetingId) throw new Error("No meetingId provided");

    const token = "Bearer " + localStorage.getItem("token");
    console.log(request);
    return apiFetch(`/${meetingId}/messages`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json", "Authorization": token }, // fix header
    });
}

export function getMessages(
    meetingId: string,
    limit: number = 50,
    startAfter?: number
): Promise<Response> {
    if (!meetingId) throw new Error("No meetingId provided");

    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    if (startAfter !== undefined && startAfter !== null) {
        params.append("startAfter", String(startAfter));
    }

    const token = "Bearer " + localStorage.getItem("token");

    return apiFetch(`/${meetingId}/messages?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    });
}
