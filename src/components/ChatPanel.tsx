import { useEffect, useState } from "react";
import { useChatSocketStore } from "../stores/useChatSocketStore";
import { useUserStore } from "../stores/useUserStore";

/**
 *  Properties of the chat room
 */
interface Props {
  roomId: string | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  showChat: boolean;
  onClose: () => void;
}

/**
 * Participants Array Model
 */
interface ParticipantMap {
  [uid: string]: string; // uid -> firstName
}

/**
 * Messages Model
 */
interface Message {
  meetingId: string;
  senderId: string;
  message: string;
  senderDisplayName?: string;
  createdAt: number;
}

/**
 * Panel that works as a Chat, where users can send messages.
 *  
 * @param param0 : roomId, which identifies the room for the chat, and reference to the endpoint
 * @returns : The visual panel for the chat
 */
export default function ChatPanel({ roomId, messagesEndRef, showChat, onClose }: Props) {
  const { profile } = useUserStore();
  const { socket, connect } = useChatSocketStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [participantsMap, setParticipantsMap] = useState<ParticipantMap>({});

  /**
   * Connects to the socket on mount
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    connect(token);

    /**
     * Key event to send messages with Enter.
     * @param e : Keyboard event
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter or Intro
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);



  /**
   * Join to the room and listens(shows) the messages on the panel.
   */
  useEffect(() => {
    if (!socket || !roomId) return;

    // Unirse al room
    socket.emit("join_room", { meetingId: roomId });

    // Escuchar mensajes entrantes
    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    socket.on("receive_message", handleReceiveMessage);

    // Escuchar lista de participantes para mapear senderId -> firstName
    const handleParticipants = (participants: { uid: string; firstName: string }[]) => {
      const map: ParticipantMap = {};
      participants.forEach((p) => (map[p.uid] = p.firstName));
      setParticipantsMap(map);
    };

    socket.on("room_participants", handleParticipants);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_participants", handleParticipants);
    };
  }, [socket, roomId]);

  /**
   * Method on charge to handle the sending of messages.
   * 
   * @returns returns response from the backend.
   */
  const handleSend = () => {
    if (!socket || !inputText.trim() || !roomId) return;

    socket.emit("send_message", {
      meetingId: roomId,
      message: inputText,
    });

    setInputText("");
  };

  /**
   * Method on charge to get the name from the sender.
   */
  const getSenderName = (senderId: string) => {
    if (senderId === profile.id) return profile.firstName;
    return participantsMap[senderId] || "Usuario";
  };

  return (
    <div
      className={`fixed inset-0 md:right-0 md:left-auto md:w-80 h-full bg-[#1E1E1E] text-white 
        shadow-xl md:border-l border-gray-700 p-4 pb-24 flex flex-col
        transition-transform duration-300 z-30
        ${showChat ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold tracking-wide">
          Chat de la reunión
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex-shrink-0"
          aria-label="Cerrar chat"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.length === 0 && (
          <div className="text-sm text-gray-300">No hay mensajes aún.</div>
        )}

        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{getSenderName(msg.senderId)}</strong>: {msg.message}
          </li>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2 bg-[#2A2A2A] p-2 rounded-xl border border-gray-700/40 shadow-inner">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-[#1E1E1E] text-sm border border-gray-700 focus:border-blue-500 outline-none"
        />
        <button
          className="bg-gradient-to-r from-[#304FFE] to-black px-4 py-2 rounded-lg"
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
    </div>
  );
}