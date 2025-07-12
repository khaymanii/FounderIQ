import ChatScreen from "../components/ChatScreen";
import Sidebar from "../components/Sidebar";

function Chat() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center w-full">
        {/* Replace this with your Chat UI */}
        <ChatScreen />
      </div>
    </div>
  );
}

export default Chat;
