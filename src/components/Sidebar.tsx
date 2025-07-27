import { useState, useRef, useEffect } from "react";
import { PanelLeftClose, PanelRightClose, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const { user, signOut } = useAuth();
  const { chatSessions, newChat, selectChat, currentSessionId } = useChat();

  const profileRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewChat = async () => {
    await newChat(); // create a new chat session and clear messages
  };
  return (
    <>
      {/* Hamburger icon for mobile - only when sidebar is closed */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar}>
            <PanelRightClose size={24} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-6 relative">
          <h1 className="text-xl font-bold text-center">
            Founder<span className="text-purple-800">IQ</span>
          </h1>

          {/* Close icon (mobile only, inside sidebar) */}
          <button
            onClick={toggleSidebar}
            className="absolute left-4 top-6 md:hidden text-white"
          >
            <PanelLeftClose size={24} />
          </button>

          <button
            onClick={handleNewChat}
            className="w-full mt-4 py-3 bg-purple-800 rounded-md text-xs font-medium cursor-pointer"
          >
            + New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {chatSessions.map((chat) => {
            const isActive = chat.id === currentSessionId;
            return (
              <div
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`p-3 rounded cursor-pointer text-xs truncate transition-colors
                  ${isActive ? "bg-purple-800 font-bold" : ""}`}
              >
                {chat.title}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 text-sm relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowPopover((prev) => !prev)}
          >
            {user && (
              <img
                src={user?.user_metadata?.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-purple-800 object-cover text-xs"
              />
            )}
            <p className="font-bold">
              {user?.user_metadata?.full_name || "My Profile"}
            </p>
          </div>

          {/* Popover */}
          {showPopover && (
            <div className="absolute bottom-16 left-22 bg-purple-100 text-black shadow-lg rounded-md p-2 w-40 z-50">
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded hover:text-purple-800 w-full text-left cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
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
