import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Loader from "./Loader";

const quirkyMessages = [
  "Ask me like you’d ask your smartest co-founder.",
  "Your next big idea starts here… go ahead!",
  "Pitch me like a founder, I’m all ears.",
  "Got a startup brainwave? Let’s hear it!",
  "I turn ideas into insights—drop one below!",
  "Your FounderIQ session is ready—fire away!",
  "Big visions welcome. Start typing…",
  "Where founders and questions collide. Go on!",
  "No pitch too crazy—let’s talk!",
  "Building something bold? Let’s chat!",
];

function ChatScreen() {
  const { messages, isAILoading } = useChat();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isEmpty = messages.length === 0;

  // 👇 Ref for chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // 👇 Auto-scroll when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAILoading]); // runs whenever new message or loader appears

  useEffect(() => {
    if (isEmpty) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % quirkyMessages.length);
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [isEmpty]);

  return (
    <div
      className="flex flex-col space-y-4 h-[800px] overflow-y-auto px-4 custom-scrollbar"
      ref={chatContainerRef}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center text-center mt-40 px-4 custom-scrollbar">
          <p className="text-gray-600 text-2xl transition-all duration-500 ease-in-out">
            {quirkyMessages[currentIndex]}
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl h-auto text-white text-sm shadow-md ${
                msg.sender === "user"
                  ? "self-end bg-black"
                  : "self-start bg-purple-800"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}

          {/* AI is typing loader */}
          {isAILoading && (
            <div>
              <Loader />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ChatScreen;
