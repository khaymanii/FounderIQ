import Chatbox from "../components/Chatbox";
import ChatScreen from "../components/ChatScreen";
import Dropdown from "../components/Dropdown";
import Sidebar from "../components/Sidebar";

function Chat() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar: already responsive inside Sidebar component */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between p-4 pt-10 lg:pt-6">
        {/* Dropdown at top */}
        <div className="mb-4 flex justify-center">
          <Dropdown
            onChange={(value) => console.log("Selected sector:", value)}
          />
        </div>

        {/* Chat screen fills available height */}
        <div className="flex-1 overflow-y-auto">
          <ChatScreen />
        </div>

        {/* Chatbox at bottom */}
        <div className="my-4">
          <Chatbox
            onSend={(message) => console.log("Sent message:", message)}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
