import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function Chatbox() {
  const [input, setInput] = useState("");
  const { sendMessage } = useChat();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };
  return (
    <div className="max-w-5xl mx-auto text-xs">
      <div className="flex-1 flex justify-around items-center p-4 border border-gray-500  hover:border-purple-700 rounded-md resize-none">
        <textarea
          rows={2}
          placeholder="Ask me like you’d ask Elon...."
          className="border-none w-full h-full resize-none focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // Send on Enter, allow Shift + Enter for newline
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="submit"
          onClick={handleSend}
          className={`p-2 rounded-full cursor-pointer ${
            input.trim()
              ? "bg-purple-800 hover:bg-purple-900 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!input.trim()}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
