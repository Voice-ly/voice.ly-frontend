import { useEffect, useState } from "react";
import { useChatSocketStore } from "../stores/useChatSocketStore";
import { useUserStore } from "../stores/useUserStore";
import { useSocketStore } from "../stores/useSocketStore";
import type { GetMessageResponse, Message } from "../types/Chat";

interface Props {
  roomId: string | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  showChat: boolean;
}

interface ParticipantMap {
  [uid: string]: string; // uid -> firstName
}

interface Message {
  meetingId: string;
  senderId: string;
  message: string;
  senderDisplayName?: string;
  createdAt: number;
}

export default function ChatPanel({ roomId, messagesEndRef }: Props) {
  const { profile } = useUserStore();
  const { socket, connect } = useChatSocketStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [participantsMap, setParticipantsMap] = useState<ParticipantMap>({});

  // Conectar socket al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    connect(token);

    //Add event to send w Enter or Intro keys
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



  // Unirse al room y escuchar mensajes
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

  const handleSend = () => {
    if (!socket || !inputText.trim() || !roomId) return;

    socket.emit("send_message", {
      meetingId: roomId,
      message: inputText,
    });

    setInputText("");
  };

  const getSenderName = (msg: Message) => {
    if (msg.senderId === profile.id) return profile.firstName;
    return msg.senderDisplayName || participantsMap[msg.senderId] || "Usuario";
  };

  return (
    <div
      className="
        absolute right-0 top-0 h-full w-80 bg-[#1E1E1E] text-white 
        shadow-xl border-l border-gray-700 p-4 pb-24 flex flex-col
        animate-slide-left z-30
      "
    >
      <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-700/50 tracking-wide">
        Chat de la reunión
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.length === 0 && (
          <div className="text-sm text-gray-300">No hay mensajes aún.</div>
        )}

        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{getSenderName(msg)}</strong>: {msg.message}
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
