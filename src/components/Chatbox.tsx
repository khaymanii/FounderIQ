import { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function Chatbox({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex-1 flex justify-around items-center p-4 border border-gray-500 rounded-md resize-none">
        <textarea
          rows={2}
          placeholder="Ask me like you’d ask Elon...."
          className="border-none w-full h-full resize-none focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            // Send on Enter, allow Shift + Enter for newline
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="bg-purple-800 hover:bg-purple-900 text-white p-2 rounded-full cursor-pointer"
          disabled
        >
          <ArrowUp size={20} />{" "}
        </button>
      </div>
    </div>
  );
}
