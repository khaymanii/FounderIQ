import { useChat } from "@/context/ChatContext";
import Chatbox from "../components/Chatbox";
import ChatScreen from "../components/ChatScreen";
import Dropdown from "../components/Dropdown";
import Sidebar from "../components/Sidebar";

function Chat() {
  const { setSelectedSector, currentSessionId } = useChat();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-purple-100">
      {/* Sidebar: already responsive */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col h-screen">
        {/* Dropdown fixed at the top */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-purple-100 p-4  md:ml-64">
          <div className="flex justify-center max-w-3xl mx-auto">
            <Dropdown
              onChange={(sector) => {
                setSelectedSector(sector);
              }}
              currentSessionId={currentSessionId}
            />
          </div>
        </div>

        {/* Chat Screen scrolls in between */}
        <div className="flex-1 overflow-y-auto pt-10 pb-4 px-4 w-full custom-scrollbar">
          <ChatScreen />
        </div>

        {/* Chatbox fixed at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-10  bg-purple-100 p-4 md:ml-64">
          <div className="max-w-3xl mx-auto">
            <Chatbox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
