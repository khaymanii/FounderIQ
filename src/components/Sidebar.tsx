import { useState } from "react";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([
    "Chat with Investor Bot",
    "Product Feedback Chat",
    "Startup Assistant",
  ]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger icon for mobile - only when sidebar is closed */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar}>
            <PanelRightClose size={30} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-purple-900 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        {/* Header */}
        <div className="px-4 py-10 border-b border-gray-700 relative">
          <h1 className="text-xl font-bold text-center">FounderIQ</h1>

          {/* Close icon (mobile only, inside sidebar) */}
          <button
            onClick={toggleSidebar}
            className="absolute left-4 top-6 md:hidden text-gray-300"
          >
            <PanelLeftClose size={30} />
          </button>

          <button
            onClick={() => setChats(["New Chat", ...chats])}
            className="w-full mt-4 py-2 bg-purple-800 rounded-md text-sm font-medium cursor-pointer"
          >
            + New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {chats.map((chat, index) => (
            <div
              key={index}
              className="p-3 rounded hover:bg-purple-800 cursor-pointer text-sm truncate"
            >
              {chat}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-700 text-sm">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-300"></div>
            <p>My Profile</p>
          </div>
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
