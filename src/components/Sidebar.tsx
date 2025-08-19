import { useState, useRef, useEffect } from "react";
import {
  PanelLeftClose,
  PanelRightClose,
  LogOut,
  Ellipsis,
  Trash,
  Pencil,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const {
    chatSessions,
    newChat,
    selectChat,
    currentSessionId,
    deleteChat,
    renameChat,
  } = useChat();

  const profileRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
        setOpenPopoverId(null);
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
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar}>
            <PanelRightClose size={24} />
          </button>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="px-4 pt-6 pb-6 relative">
          <h1 className="text-xl font-bold text-center">
            Founder<span className="text-purple-800">IQ</span>
          </h1>

          <button
            onClick={toggleSidebar}
            className="absolute left-4 top-6 md:hidden text-white"
          >
            <PanelLeftClose size={24} />
          </button>

          <button
            onClick={handleNewChat}
            className="w-full mt-4 py-3 bg-purple-800 rounded text-xs font-medium cursor-pointer"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {chatSessions.map((chat) => {
            const isActive = chat.id === currentSessionId;
            const isOpen = openPopoverId === chat.id;

            return (
              <div key={chat.id} className="relative">
                <div
                  onClick={() => selectChat(chat.id)}
                  className={`p-2 rounded cursor-pointer text-xs truncate transition-colors flex items-center justify-between hover:font-bold ${
                    isActive ? "bg-purple-800 font-bold text-white" : ""
                  }`}
                >
                  <span
                    className="truncate"
                    onClick={() => selectChat(chat.id)}
                  >
                    {chat.title}
                  </span>

                  {isActive && (
                    <Popover
                      open={isOpen}
                      onOpenChange={(val) =>
                        setOpenPopoverId(val ? chat.id : null)
                      }
                    >
                      <PopoverTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId((prev) =>
                            prev === chat.id ? null : chat.id
                          );
                        }}
                        className="p-1 rounded cursor-pointer"
                      >
                        <Ellipsis size={16} />
                      </PopoverTrigger>

                      <PopoverContent
                        side="bottom"
                        align="start"
                        className="w-auto z-[999] cursor-pointer bg-purple-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            const newTitle = prompt(
                              "Enter new chat name:",
                              chat.title
                            );
                            if (newTitle && newTitle.trim()) {
                              renameChat(chat.id, newTitle.trim());
                            }
                            setOpenPopoverId(null);
                          }}
                          className="p-1 text-centertext-xs flex justify-between items-center gap-2 text-xs cursor-pointer mb-2"
                        >
                          <Pencil size={16} />
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            deleteChat(chat.id);
                            setOpenPopoverId(null);
                          }}
                          className="p-1 text-center text-red-600 text-xs flex justify-between items-center gap-2 cursor-pointer"
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-4 text-xs relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowPopover((prev) => !prev)}
          >
            {user && (
              <img
                src={user?.user_metadata?.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 bg-white border-purple-800 object-cover text-xs"
              />
            )}
            <p className="font-bold text-xs">
              {user?.user_metadata?.full_name || "My Profile"}
            </p>
          </div>

          {/* Popover */}
          {showPopover && (
            <div className="absolute bottom-16 left-22 bg-purple-50 text-black shadow-lg rounded-md p-2 w-40 z-50">
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded hover:text-purple-800 w-full text-xs text-left cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
