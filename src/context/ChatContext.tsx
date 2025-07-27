/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

type Message = {
  id: number;
  sender: "user" | "founderiq";
  text: string;
};

type ChatSession = {
  id: string;
  title: string;
};

type ChatContextType = {
  messages: Message[];
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  sendMessage: (text: string) => Promise<void>;
  newChat: () => Promise<void>;
  selectChat: (sessionId: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Fetch all chat sessions for this user
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("id, title, created_at")
        .eq("uid", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error.message);
      } else if (data) {
        setChatSessions(
          data.map((s: { id: string; title: string }) => ({
            id: s.id,
            title: s.title || "New Chat",
          }))
        );
      }
    };

    fetchSessions();
  }, [user]);

  // Create a new chat session
  const newChat = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([{ uid: user.id, title: "New Chat" }])
      .select()
      .single();

    if (error) {
      console.error("Error creating new chat:", error.message);
      return;
    }

    if (data) {
      const newSession = { id: data.id, title: data.title || "New Chat" };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]); // clear current messages
    }
  };

  // Load messages for a selected session
  const selectChat = async (sessionId: string) => {
    if (!user) return;
    setCurrentSessionId(sessionId);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("uid", user.id)
      .eq("session_id", sessionId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error.message);
    } else if (data) {
      const formatted = data.map(
        (row: { id: number; sender: "user" | "founderiq"; text: string }) => ({
          id: row.id,
          sender: row.sender,
          text: row.text,
        })
      );
      setMessages(formatted);
    }
  };

  // Send a new message in the current session
  const sendMessage = async (text: string) => {
    if (!user) return;

    let sessionId = currentSessionId;

    // ✅ If no current session, create one on the fly
    if (!sessionId) {
      const { data: newSession, error: newSessionError } = await supabase
        .from("chat_sessions")
        .insert([{ uid: user.id, title: text.slice(0, 30) || "New Chat" }]) // use first message as title
        .select()
        .single();

      if (newSessionError || !newSession) {
        console.error("Error creating session:", newSessionError?.message);
        return;
      }

      sessionId = newSession.id;
      setCurrentSessionId(sessionId);

      // Add this new session to sidebar list
      setChatSessions((prev) => [
        { id: newSession.id, title: newSession.title || "New Chat" },
        ...prev,
      ]);
    }

    // ✅ Now insert the message with the sessionId
    const { data, error } = await supabase
      .from("messages")
      .insert([{ uid: user.id, session_id: sessionId, sender: "user", text }])
      .select();

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    if (data && data[0]) {
      const newMsg = data[0];
      setMessages((prev) => [...prev, { id: newMsg.id, sender: "user", text }]);
    }

    // ✅ Optional: Bot reply
    setTimeout(async () => {
      const botReply = "Thanks for your message! I'll help you shortly.";
      const { data: botData, error: botError } = await supabase
        .from("messages")
        .insert([
          {
            uid: user.id,
            session_id: sessionId,
            sender: "founderiq",
            text: botReply,
          },
        ])
        .select();

      if (botError) {
        console.error("Bot reply error:", botError.message);
        return;
      }

      if (botData && botData[0]) {
        const botMsg = botData[0];
        setMessages((prev) => [
          ...prev,
          { id: botMsg.id, sender: "founderiq", text: botReply },
        ]);
      }
    }, 1000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        chatSessions,
        currentSessionId,
        sendMessage,
        newChat,
        selectChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
