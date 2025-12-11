import type { SendMessageRequest } from "../types/Chat";
import { apiFetch } from "./fetch";

/**
 * Sends a message.
 *
 * This function builds a query string based on the provided parameters
 * and performs an authenticated POST request to the messages endpoint.
 *
 * @param meetingId : Identifier of the meeting
 * @param request : user info and credentials
 * @returns {Promise<Response>} : The API response retutned by `apiFetch`.
 */
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
        headers: { "Content-Type": "application/json", Authorization: token }, // fix header
    });
}

/**
 * Gets a list of messages associated with a specific meeting.
 *
 * This function builds a query string based on the provided parameters
 * and performs an authenticated GET request to the messages endpoint.
 *
 * @param meetingId : Identifier of the meeting.
 * @param limit : Maximum amount of messages to retrieve.
 * @param startAfter : Message ID or timestamp used for pagination; retrieves
 *                      messages that come after this value.
 * @returns {Promise<Response>} : The API response returned by `apiFetch`.
 */
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
            Authorization: token,
        },
    });
}

export function exitMeeting(meetingId: string) {
    const token = "Bearer " + localStorage.getItem("token");
    return apiFetch(
        `/${meetingId}/end`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        },
        "meetings"
    );
}
