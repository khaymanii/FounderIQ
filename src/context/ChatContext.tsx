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

  // Decide temperature dynamically based on question type
  function getTemperature(question: string): number {
    const lowerQ = question.toLowerCase();

    // If it's a greeting or factual query, keep it lower
    if (["hi", "hello", "hey"].includes(lowerQ.trim())) return 0.5;
    if (lowerQ.includes("define") || lowerQ.includes("what is")) return 0.4;

    // If it's asking for strategy, ideas, or brainstorming, allow more creativity
    if (
      lowerQ.includes("strategy") ||
      lowerQ.includes("ideas") ||
      lowerQ.includes("creative")
    ) {
      return 0.9;
    }

    // Default balance
    return 0.7;
  }
  const sendMessage = async (text: string) => {
    if (!user) return;

    // Prevent multiple concurrent requests
    if (isAILoading) {
      console.warn("⚠️ Already processing a message, please wait...");
      return;
    }

    let sessionId = currentSessionId;

    try {
      // 1️⃣ Create session if none exists
      if (!sessionId) {
        const { data: newSession, error: newSessionError } = await supabase
          .from("chat_sessions")
          .insert([
            {
              uid: user.id,
              title: text.slice(0, 30) || "New Chat",
              selected_sector: selectedSector || "General Tech",
            },
          ])
          .select()
          .single();

        if (newSessionError || !newSession) {
          console.error("❌ Error creating session:", newSessionError?.message);
          throw new Error("Failed to create chat session");
        }

        sessionId = newSession.id;
        setCurrentSessionId(sessionId);

        setChatSessions((prev) => [
          {
            id: newSession.id,
            title: newSession.title || "New Chat",
            selected_sector: newSession.selected_sector || "General Tech",
          },
          ...prev,
        ]);
      }

      // 2️⃣ Save USER message
      const { data: userMsg, error: userError } = await supabase
        .from("messages")
        .insert([{ uid: user.id, session_id: sessionId, sender: "user", text }])
        .select();

      if (userError) {
        console.error("❌ Error saving user message:", userError.message);
        throw new Error("Failed to save user message");
      }

      if (userMsg && userMsg[0]) {
        setMessages((prev) => [
          ...prev,
          { id: userMsg[0].id, sender: "user", text },
        ]);
      }

      // 3️⃣ Start AI response
      setIsAILoading(true);

      // Trim context to prevent hitting limits (keep last 20 messages + system)
      const recentMessages = messages.slice(-20);

      const requestBody = {
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
        messages: [
          {
            role: "system",
            content: `You are FounderIQ — an AI business consultant and cofounder...`, // your system prompt
          },
          ...recentMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: text },
        ],
        temperature: getTemperature(text),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        max_tokens: 2000, // Add max tokens to prevent runaway responses
      };

      console.log("🚀 Sending request to OpenRouter...", {
        messageCount: requestBody.messages.length,
        temperature: requestBody.temperature,
      });

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_FOUNDERIQ_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "FounderIQ",
        },
        body: JSON.stringify(requestBody),
      });

      // ✅ Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ OpenRouter API error: ${res.status} - ${errorText}`);
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      if (!res.body) {
        throw new Error("❌ No response body for streaming");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let hasReceivedContent = false;

      // ⏳ Temporary AI message
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: tempId, sender: "founderiq", text: "" },
      ]);

      // Add timeout for streaming
      const streamTimeout = setTimeout(() => {
        console.error("❌ Stream timeout after 30 seconds");
        reader.cancel();
      }, 30000);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("✅ Stream completed");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (let line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.replace("data: ", "").trim();
              if (payload === "[DONE]") continue;

              try {
                const data = JSON.parse(payload);
                const token = data.choices?.[0]?.delta?.content;

                if (token) {
                  hasReceivedContent = true;
                  accumulatedText += token;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === tempId ? { ...m, text: accumulatedText } : m
                    )
                  );
                }

                // Check for finish_reason
                const finishReason = data.choices?.[0]?.finish_reason;
                if (finishReason) {
                  console.log(`🏁 Stream finished: ${finishReason}`);
                  break;
                }
              } catch (parseError) {
                console.error(
                  "⚠️ Stream parse error:",
                  parseError,
                  "Payload:",
                  payload
                );
                // Don't break the loop, continue processing
              }
            }
          }
        }
      } finally {
        clearTimeout(streamTimeout);
      }

      // Check if we got any content
      if (!hasReceivedContent || accumulatedText.trim().length === 0) {
        console.error("❌ No content received from AI");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        throw new Error("No response received from AI model");
      }

      // 4️⃣ Save AI message in DB ✅
      console.log("💾 Saving AI message to DB...");
      const { data: botMsg, error: botError } = await supabase
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

      if (botError) {
        console.error("❌ Error saving AI message:", botError.message);
        // Don't throw here, the user still sees the message
      } else if (botMsg && botMsg[0]) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: botMsg[0].id } : m))
        );
      }

      console.log("✅ Message sent successfully");
    } catch (err) {
      console.error("❌ Error in sendMessage:", err);

      // Show error message to user
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "founderiq",
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ]);
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
      .eq("uid", user.id);

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
