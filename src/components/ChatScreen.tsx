import Chatbox from "./Chatbox";
import Dropdown from "./Dropdown";

function ChatScreen() {
  return (
    <div>
      <Dropdown onChange={(value) => console.log("Selected sector:", value)} />
      <div>
        <h2 className="text-2xl font-semibold mt-40 text-center">
          Welcome to FounderIQ
        </h2>
        <Chatbox />
      </div>
    </div>
  );
}

export default ChatScreen;
