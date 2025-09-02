/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

type Message = {
  id: number | string;
  sender: "user" | "founderiq";
  text: string;
};

type ChatSession = {
  id: string;
  title: string;
};

type ChatContextType = {
  messages: Message[];
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  sendMessage: (text: string) => Promise<void>;
  newChat: () => Promise<void>;
  selectChat: (sessionId: string) => Promise<void>;
  deleteChat: (sessionId: string) => Promise<void>;
  renameChat: (sessionId: string, newTitle: string) => Promise<boolean>;
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
  isAILoading: boolean;
  setIsAILoading: (loading: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Fetch all chat sessions for this user
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("id, title, created_at")
        .eq("uid", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error.message);
      } else if (data) {
        setChatSessions(
          data.map((s: { id: string; title: string }) => ({
            id: s.id,
            title: s.title || "New Chat",
          }))
        );
      }
    };

    fetchSessions();
  }, [user]);

  const newChat = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([{ uid: user.id, title: "New Chat" }])
      .select()
      .single();

    if (error) {
      console.error("Error creating new chat:", error.message);
      return;
    }

    if (data) {
      const newSession = { id: data.id, title: data.title || "New Chat" };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]); // clear current messages
    }
  };

  // Load messages for a selected session
  const selectChat = async (sessionId: string) => {
    if (!user) return;
    setCurrentSessionId(sessionId);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("uid", user.id)
      .eq("session_id", sessionId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error.message);
    } else if (data) {
      const formatted = data.map(
        (row: { id: number; sender: "user" | "founderiq"; text: string }) => ({
          id: row.id,
          sender: row.sender,
          text: row.text,
        })
      );
      setMessages(formatted);
    }
  };

  // Decide temperature dynamically based on question type
  function getTemperature(question: string): number {
    const lowerQ = question.toLowerCase();

    // If it's a greeting or factual query, keep it lower
    if (["hi", "hello", "hey"].includes(lowerQ.trim())) return 0.5;
    if (lowerQ.includes("define") || lowerQ.includes("what is")) return 0.4;

    // If it's asking for strategy, ideas, or brainstorming, allow more creativity
    if (
      lowerQ.includes("strategy") ||
      lowerQ.includes("ideas") ||
      lowerQ.includes("creative")
    ) {
      return 0.9;
    }

    // Default balance
    return 0.7;
  }

  const getSystemPrompt = (selectedSector: string | null) => {
    const sector = selectedSector || "General Tech";

    return `You are FounderIQ — an elite AI business consultant and virtual cofounder specializing in ${sector}. You combine deep industry expertise with practical startup experience to help entrepreneurs build successful tech companies.

## Your Core Identity:
- **Role**: Senior Business Consultant & Virtual Cofounder
- **Specialty**: ${sector} sector expertise
- **Experience**: 15+ years equivalent in startups, scaling, and exits
- **Approach**: Data-driven, pragmatic, and founder-focused

## Your Expertise Areas:

### Business Strategy & Planning:
- Market analysis and competitive intelligence for ${sector}
- Business model design and validation
- Go-to-market strategy development
- Product-market fit assessment
- Pricing strategy and revenue optimization
- Strategic partnerships and business development

### ${sector}-Specific Knowledge:
${getSectorSpecificExpertise(sector)}

### Startup Operations:
- Team building and hiring strategies
- Fundraising preparation and investor relations
- Financial modeling and unit economics
- Legal structure and compliance guidance
- Operational scaling and process optimization
- Risk management and mitigation

### Growth & Marketing:
- Customer acquisition strategies
- Retention and engagement tactics
- Brand positioning and messaging
- Content marketing and thought leadership
- Performance marketing and analytics
- Community building and network effects

## Your Communication Style:
- **Direct & Actionable**: Provide concrete, implementable advice
- **Evidence-Based**: Back recommendations with data and examples
- **Startup-Savvy**: Use appropriate terminology and understand startup culture
- **Balanced Perspective**: Present both opportunities and risks honestly
- **Mentor-Like**: Supportive yet challenging, like an experienced cofounder

## Your Response Framework:
1. **Understand Context**: Ask clarifying questions when needed
2. **Provide Strategic Insight**: Share high-level perspective first
3. **Offer Tactical Steps**: Break down into actionable next steps
4. **Consider Constraints**: Factor in resources, timeline, and stage
5. **Suggest Metrics**: Recommend KPIs to track progress

## Key Principles:
- Prioritize founder success over theoretical perfection
- Focus on revenue-generating activities
- Emphasize speed and iteration over extensive planning
- Consider the human element in all business decisions
- Adapt advice to company stage (ideation, MVP, scaling, growth)
- Always think about sustainable competitive advantages

## When You Don't Know:
- Acknowledge limitations honestly
- Suggest where to find reliable information
- Connect to relevant industry experts or resources
- Recommend validation methods for uncertainty

Remember: You're not just providing information — you're acting as a strategic partner helping founders make better decisions and avoid common pitfalls. Think like a cofounder who has equity in the outcome.`;
  };

  // Sector-specific expertise function
  type SectorKey =
    | "FinTech"
    | "HealthTech"
    | "EdTech"
    | "E-commerce"
    | "SaaS"
    | "AI/ML"
    | "Blockchain/Web3"
    | "IoT"
    | "Cybersecurity"
    | "Climate Tech"
    | "General Tech";

  const getSectorSpecificExpertise = (sector: string) => {
    const sectorData: Record<SectorKey, string> = {
      FinTech: `
- Regulatory compliance (PCI DSS, KYC, AML, GDPR)
- Payment processing and financial infrastructure
- Banking partnerships and API integrations
- Fraud detection and security protocols
- Financial product design and user experience
- Capital requirements and licensing considerations
- Blockchain and cryptocurrency implications
- Open banking and embedded finance trends`,

      HealthTech: `
- HIPAA compliance and healthcare regulations
- Clinical validation and FDA approval processes
- Electronic health records (EHR) integration
- Telemedicine platforms and remote care delivery
- Medical device development and certification
- Healthcare data analytics and AI applications
- Provider network management and reimbursement
- Patient engagement and care coordination`,

      EdTech: `
- Learning management systems (LMS) and platforms
- Educational content creation and curriculum design
- Student data privacy (FERPA, COPPA compliance)
- Assessment and analytics methodologies
- Institutional sales and B2B education markets
- Teacher training and professional development
- Accessibility standards and inclusive design
- International education markets and localization`,

      "E-commerce": `
- Marketplace dynamics and platform strategies
- Supply chain optimization and logistics
- Payment gateway integration and fraud prevention
- Inventory management and demand forecasting
- Customer acquisition cost (CAC) optimization
- Conversion rate optimization and UX design
- Multi-channel retail and omnichannel strategies
- International expansion and cross-border commerce`,

      SaaS: `
- Subscription business models and pricing strategies
- Customer success and churn reduction
- Product-led growth (PLG) methodologies
- API design and third-party integrations
- Enterprise sales and account-based marketing
- Onboarding optimization and time-to-value
- Feature prioritization and product roadmaps
- Vertical SaaS vs horizontal platform strategies`,

      "AI/ML": `
- Machine learning model development and deployment
- Data pipeline architecture and infrastructure
- AI ethics and bias mitigation strategies
- Computer vision and natural language processing
- MLOps and model lifecycle management
- Edge computing and on-device AI
- AI regulation and compliance considerations
- Synthetic data generation and privacy-preserving ML`,

      "Blockchain/Web3": `
- Smart contract development and auditing
- Tokenomics and cryptocurrency mechanics
- Decentralized autonomous organizations (DAOs)
- NFT marketplaces and digital asset management
- DeFi protocols and yield farming strategies
- Cross-chain interoperability solutions
- Regulatory landscape and compliance challenges
- Community governance and incentive alignment`,

      IoT: `
- Connected device architecture and protocols
- Edge computing and data processing strategies
- Device management and over-the-air updates
- Sensor integration and hardware considerations
- Industrial IoT and smart manufacturing
- Consumer IoT privacy and security concerns
- Connectivity options (5G, LoRaWAN, WiFi, Bluetooth)
- Data monetization and analytics platforms`,

      Cybersecurity: `
- Threat detection and incident response
- Zero-trust architecture and implementation
- Compliance frameworks (SOC 2, ISO 27001, NIST)
- Identity and access management (IAM)
- Cloud security and multi-cloud strategies
- Security awareness training and human factors
- Penetration testing and vulnerability management
- Security operations center (SOC) design`,

      "Climate Tech": `
- Carbon accounting and ESG reporting
- Renewable energy systems and storage
- Sustainability metrics and impact measurement
- Green financing and climate-focused investing
- Circular economy business models
- Environmental compliance and regulations
- Clean technology adoption barriers
- Climate risk assessment and adaptation strategies`,

      "General Tech": `
- Cross-industry technology trends and adoption
- Platform business models and network effects
- Developer ecosystem and API strategies
- Cloud infrastructure and scalability considerations
- Data strategy and analytics implementation
- Digital transformation and legacy system integration
- Emerging technology evaluation and adoption
- Technology stack decisions and architecture planning`,
    };

    if (sector in sectorData) {
      return sectorData[sector as SectorKey];
    }
    return sectorData["General Tech"];
  };

  // Usage in your ChatContext:
  const systemPrompt = getSystemPrompt(selectedSector);

  const sendMessage = async (text: string) => {
    if (!user) return;

    // Prevent multiple concurrent requests
    if (isAILoading) {
      console.warn("⚠️ Already processing a message, please wait...");
      return;
    }

    let sessionId = currentSessionId;

    try {
      // 1️⃣ Create session if none exists
      if (!sessionId) {
        const { data: newSession, error: newSessionError } = await supabase
          .from("chat_sessions")
          .insert([
            {
              uid: user.id,
              title: text.slice(0, 30) || "New Chat",
              selected_sector: selectedSector || "General Tech",
            },
          ])
          .select()
          .single();

        if (newSessionError || !newSession) {
          console.error("❌ Error creating session:", newSessionError?.message);
          throw new Error("Failed to create chat session");
        }

        sessionId = newSession.id;
        setCurrentSessionId(sessionId);

        setChatSessions((prev) => [
          {
            id: newSession.id,
            title: newSession.title || "New Chat",
            selected_sector: newSession.selected_sector || "General Tech",
          },
          ...prev,
        ]);
      }

      // 2️⃣ Save USER message
      const { data: userMsg, error: userError } = await supabase
        .from("messages")
        .insert([{ uid: user.id, session_id: sessionId, sender: "user", text }])
        .select();

      if (userError) {
        console.error("❌ Error saving user message:", userError.message);
        throw new Error("Failed to save user message");
      }

      if (userMsg && userMsg[0]) {
        setMessages((prev) => [
          ...prev,
          { id: userMsg[0].id, sender: "user", text },
        ]);
      }

      // 3️⃣ Start AI response
      setIsAILoading(true);

      // Trim context to prevent hitting limits (keep last 20 messages + system)
      const recentMessages = messages.slice(-20);

      const requestBody = {
        model: "google/gemma-3n-e4b-it:free",
        messages: [
          {
            role: "system",
            content: systemPrompt, // ✅ Dynamic system prompt
          },
          ...recentMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: text },
        ],
        temperature: getTemperature(text),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        max_tokens: 2000, // Add max tokens to prevent runaway responses
      };

      console.log("🚀 Sending request to OpenRouter...", {
        messageCount: requestBody.messages.length,
        temperature: requestBody.temperature,
      });

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_FOUNDERIQ_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "FounderIQ",
        },
        body: JSON.stringify(requestBody),
      });

      // ✅ Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ OpenRouter API error: ${res.status} - ${errorText}`);
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      if (!res.body) {
        throw new Error("❌ No response body for streaming");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let hasReceivedContent = false;

      // ⏳ Temporary AI message
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: tempId, sender: "founderiq", text: "" },
      ]);

      // Add timeout for streaming
      const streamTimeout = setTimeout(() => {
        console.error("❌ Stream timeout after 30 seconds");
        reader.cancel();
      }, 30000);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("✅ Stream completed");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (let line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.replace("data: ", "").trim();
              if (payload === "[DONE]") continue;

              try {
                const data = JSON.parse(payload);
                const token = data.choices?.[0]?.delta?.content;

                if (token) {
                  hasReceivedContent = true;
                  accumulatedText += token;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === tempId ? { ...m, text: accumulatedText } : m
                    )
                  );
                }

                // Check for finish_reason
                const finishReason = data.choices?.[0]?.finish_reason;
                if (finishReason) {
                  console.log(`🏁 Stream finished: ${finishReason}`);
                  break;
                }
              } catch (parseError) {
                console.error(
                  "⚠️ Stream parse error:",
                  parseError,
                  "Payload:",
                  payload
                );
                // Don't break the loop, continue processing
              }
            }
          }
        }
      } finally {
        clearTimeout(streamTimeout);
      }

      // Check if we got any content
      if (!hasReceivedContent || accumulatedText.trim().length === 0) {
        console.error("❌ No content received from AI");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        throw new Error("No response received from AI model");
      }

      // 4️⃣ Save AI message in DB ✅
      console.log("💾 Saving AI message to DB...");
      const { data: botMsg, error: botError } = await supabase
        .from("messages")
        .insert([
          {
            uid: user.id,
            session_id: sessionId,
            sender: "founderiq",
            text: accumulatedText,
          },
        ])
        .select();

      if (botError) {
        console.error("❌ Error saving AI message:", botError.message);
        // Don't throw here, the user still sees the message
      } else if (botMsg && botMsg[0]) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: botMsg[0].id } : m))
        );
      }

      console.log("✅ Message sent successfully");
    } catch (err) {
      console.error("❌ Error in sendMessage:", err);

      // Show error message to user
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "founderiq",
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  const deleteChat = async (sessionId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("uid", user.id);

    if (error) {
      console.error("Error deleting chat:", error.message);
      return;
    }

    // Update state after deletion
    setChatSessions((prev) =>
      prev.filter((session) => session.id !== sessionId)
    );
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const renameChat = async (sessionId: string, newTitle: string) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ title: newTitle })
      .eq("id", sessionId)
      .eq("uid", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error renaming chat:", error.message);
      return false;
    }

    // Update state with the new title
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, title: data.title } : session
      )
    );

    return true; // ✅ Indicate success
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        chatSessions,
        currentSessionId,
        sendMessage,
        newChat,
        selectChat,
        deleteChat,
        renameChat,
        selectedSector,
        setSelectedSector,
        isAILoading,
        setIsAILoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
