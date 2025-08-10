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
  id: number | string;
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
  deleteChat: (sessionId: string) => Promise<void>;
  renameChat: (sessionId: string, newTitle: string) => Promise<boolean>;
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
  isAILoading: boolean;
  setIsAILoading: (loading: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

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

    // ✅ Create session if none exists
    if (!sessionId) {
      const { data: newSession, error: newSessionError } = await supabase
        .from("chat_sessions")
        .insert([{ uid: user.id, title: text.slice(0, 30) || "New Chat" }])
        .select()
        .single();

      if (newSessionError || !newSession) {
        console.error("Error creating session:", newSessionError?.message);
        return;
      }

      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
      setChatSessions((prev) => [
        { id: newSession.id, title: newSession.title || "New Chat" },
        ...prev,
      ]);
    }

    // ✅ Save user message
    const { data, error } = await supabase
      .from("messages")
      .insert([{ uid: user.id, session_id: sessionId, sender: "user", text }])
      .select();

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    if (data && data[0]) {
      setMessages((prev) => [
        ...prev,
        { id: data[0].id, sender: "user", text },
      ]);
    }

    // ✅ Start loading
    setIsAILoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_FOUNDERIQ_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "FounderIQ",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "system",
              content: `You are FounderIQ — an AI business consultant and cofounder. 
              Tailor all advice to the "${
                selectedSector || "General Tech"
              }" industry. 
              Give strategic, practical advice in markdown format with headings and bullet points.
              Ask clarifying questions before making recommendations.`,
            },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: text },
          ],
          stream: true,
        }),
      });

      if (!res.body) throw new Error("No response body for streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      // First, add an empty AI message so we can update it live
      let tempId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: tempId, sender: "founderiq", text: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse Server-Sent Events (SSE) chunks
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");
        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.replace("data: ", ""));
            const token = data.choices?.[0]?.delta?.content;
            if (token) {
              accumulatedText += token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId ? { ...m, text: accumulatedText } : m
                )
              );
            }
          }
        }
      }

      // ✅ Save final AI message to Supabase
      const { data: botData, error: botError } = await supabase
        .from("messages")
        .insert([
          {
            uid: user.id,
            session_id: sessionId,
            sender: "founderiq",
            text: accumulatedText,
          },
        ])
        .select();

      if (botError) console.error("Bot reply save error:", botError.message);
      if (botData && botData[0]) {
        setMessages((prev) =>
          prev.map((m) =>
            String(m.id) === tempId ? { ...m, id: botData[0].id } : m
          )
        );
      }
    } catch (err) {
      console.error("Error calling OpenRouter:", err);
    } finally {
      setIsAILoading(false);
    }
  };

  const deleteChat = async (sessionId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("uid", user.id); // Optional: ensure user can only delete their own session

    if (error) {
      console.error("Error deleting chat:", error.message);
      return;
    }

    // Update state after deletion
    setChatSessions((prev) =>
      prev.filter((session) => session.id !== sessionId)
    );
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const renameChat = async (sessionId: string, newTitle: string) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ title: newTitle })
      .eq("id", sessionId)
      .eq("uid", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error renaming chat:", error.message);
      return false;
    }

    // Update state with the new title
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, title: data.title } : session
      )
    );

    return true; // ✅ Indicate success
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
        deleteChat,
        renameChat,
        selectedSector,
        setSelectedSector,
        isAILoading,
        setIsAILoading,
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
