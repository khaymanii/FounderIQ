/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useChat } from "../context/ChatContext";

const quirkyMessages = [
  "Ask me like you’d ask your smartest co‑founder.",
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
  const { messages } = useChat();

  // Pick one random message when component mounts
  const isEmpty = messages.length === 0;
  const randomMessage = useMemo(() => {
    const index = Math.floor(Math.random() * quirkyMessages.length);
    return quirkyMessages[index];
  }, [isEmpty]);

  return (
    <div className="flex flex-col space-y-4 py-6">
      {messages.length === 0 ? (
        <div className="text-gray-600 text-2xl sm:text-4xl flex-col items-center justify-center text-center mt-10">
          {randomMessage}
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl h-auto text-white text-sm shadow-md ${
              msg.sender === "user"
                ? "self-end bg-black"
                : "self-start bg-purple-800"
            }`}
          >
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
}

export default ChatScreen;
