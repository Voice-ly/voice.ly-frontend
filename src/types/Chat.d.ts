export interface Message {
    id: string;
    meetingId: string;
    senderId: string;
    senderDisplayName: string | null;
    message: string;
    createdAt: number;
}

export interface SendMessageRequest {
    message: string;
    senderDisplayName?: string;
}

export interface GetMessageResponse {
    success: boolean;
    data: Message[];
}