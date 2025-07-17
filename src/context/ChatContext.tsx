/* eslint-disable react-refresh/only-export-components */
// src/context/ChatContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type Message = {
  id: number;
  sender: "user" | "founderiq";
  text: string;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => void;
  newChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text },
    ]);

    // OPTIONAL: add a mock bot response after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "founderiq",
          text: "Thanks for your message! I'll help you shortly.",
        },
      ]);
    }, 1000);
  };

  const newChat = () => {
    setMessages([]); // clear messages
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, newChat }}>
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
