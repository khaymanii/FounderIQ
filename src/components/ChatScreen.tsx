const messages = [
  { id: 1, sender: "founderiq", text: "Hey! I'm FounderIQ. How can I help?" },
  {
    id: 2,
    sender: "user",
    text: "I'm trying to validate an idea for a startup.",
  },
  {
    id: 3,
    sender: "founderiq",
    text: "Awesome! The first step is to identify the real problem your target audience faces. Have you done any research?",
  },
  {
    id: 4,
    sender: "user",
    text: "Yeah, I talked to a few people but I’m not sure if their feedback is reliable.",
  },
  {
    id: 5,
    sender: "founderiq",
    text: "That’s okay. It’s best to collect insights from at least 10–20 people in your target market. Consistency in their pain points means you’re onto something.",
  },
  {
    id: 6,
    sender: "user",
    text: "Got it. I think the main issue they have is tracking shipments across different carriers.",
  },
  {
    id: 7,
    sender: "founderiq",
    text: "Great. That’s a pain point worth solving. How are you thinking of approaching the solution?",
  },
  {
    id: 8,
    sender: "user",
    text: "I want to build a dashboard that integrates multiple APIs and lets them track everything in one place.",
  },
  {
    id: 9,
    sender: "founderiq",
    text: "That sounds promising. You'll want to test a basic version of that idea as soon as possible—maybe even a Figma prototype first.",
  },
  {
    id: 10,
    sender: "user",
    text: "True. I can mock something up and share with a few users.",
  },
  {
    id: 11,
    sender: "founderiq",
    text: "Exactly. Let’s keep it lean and focus on feedback loops.",
  },
  {
    id: 12,
    sender: "user",
    text: "What would be a good pitch line for this idea?",
  },
  {
    id: 13,
    sender: "founderiq",
    text: "Try something like: 'We help businesses track all their shipments from one sleek dashboard—no matter the courier.'",
  },
  {
    id: 14,
    sender: "user",
    text: "Nice! That actually sounds professional and clear.",
  },
  {
    id: 15,
    sender: "founderiq",
    text: "Glad you like it! Simplicity wins in early pitches. People should get it in one sentence.",
  },
  {
    id: 16,
    sender: "user",
    text: "Okay, but what if competitors already exist?",
  },
  {
    id: 17,
    sender: "founderiq",
    text: "Competition is a good sign. It proves demand. Your job is to find what makes your version better—faster, cheaper, easier, or more delightful.",
  },
  {
    id: 18,
    sender: "user",
    text: "Makes sense. Maybe I can focus on user experience as the differentiator.",
  },
  {
    id: 19,
    sender: "founderiq",
    text: "Exactly. People often stick with the product that feels best to use, even if it's not the most powerful.",
  },
  {
    id: 20,
    sender: "user",
    text: "Thanks, this was super helpful. I feel more confident now!",
  },
];

function ChatScreen() {
  return (
    <div className="flex flex-col space-y-4 py-6">
      {messages.map((msg) => (
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
      ))}
    </div>
  );
}

export default ChatScreen;
