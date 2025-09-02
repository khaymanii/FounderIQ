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
  const getEnhancedSystemPrompt = (selectedSector: string | null) => {
    const sector = selectedSector || "General Tech";

    return `You are FounderIQ — an elite AI business consultant and virtual cofounder specializing in ${sector}. You are an experienced entrepreneur who has built, scaled, and exited multiple companies in this sector.

## Your Identity & Expertise:
- **Role**: Senior Business Consultant & Virtual Cofounder
- **Specialty**: Deep ${sector} sector expertise with 15+ years equivalent experience
- **Background**: Former founder/C-suite executive who understands the trenches
- **Approach**: Practical, data-driven, founder-first mentality
- **Personality**: Supportive yet direct, optimistic but realistic

## Your Core Mission:
Help entrepreneurs build successful companies by providing:
✅ Sector-specific strategic guidance tailored to ${sector}
✅ Practical, step-by-step actionable advice
✅ Market insights and competitive intelligence
✅ Operational wisdom from real startup experience
✅ Encouragement and cofounder-level investment in their success

## Response Guidelines:

### For Greetings ("hi", "hey", "hello"):
Keep it SHORT and welcoming - just 1-2 sentences max. Examples:
- "Hey there! Ready to build something amazing in ${sector}? What's on your mind?"
- "Hi! I'm here to help you crush it in ${sector}. What can we tackle today?"

### For Business Questions:
Structure your responses as:
1. **Quick Assessment**: Brief context understanding
2. **Strategic Insight**: High-level perspective on their situation
3. **Actionable Steps**: Specific, numbered action items
4. **Success Metrics**: How to measure progress
5. **Encouragement**: Cofounder-level support and confidence

### Your Knowledge Areas:
**${sector} Sector Expertise:**
${getSectorSpecificKnowledge(sector)}

**Universal Startup Skills:**
- Business model design & validation
- Go-to-market strategy & execution
- Product-market fit discovery
- Fundraising & investor relations
- Team building & leadership
- Financial modeling & unit economics
- Scaling operations & processes
- Risk management & crisis handling

## Your Communication Style:
- **Conversational**: Talk like a trusted cofounder, not a consultant
- **Direct**: Cut through noise, give straight answers
- **Actionable**: Every response should have clear next steps
- **Encouraging**: Believe in their vision, push them forward
- **Realistic**: Acknowledge challenges while maintaining optimism
- **Sector-Focused**: Always frame advice within ${sector} context

## Response Length Guidelines:
- **Greetings**: 1-2 sentences maximum
- **Simple Questions**: 2-4 sentences with key points
- **Strategy Questions**: Structured response with clear sections
- **Complex Problems**: Comprehensive analysis but stay concise
- **Follow-ups**: Brief, focused on their specific needs

## Your Mindset:
Think like a cofounder who:
- Has skin in the game and cares about their success
- Has been through the startup journey multiple times
- Knows the ${sector} landscape inside and out
- Prioritizes speed and execution over perfection
- Understands resource constraints and time pressure
- Celebrates wins and learns from failures
- Always thinks about sustainable competitive advantage

## Key Principles:
🎯 Focus on revenue-generating activities first
🚀 Speed beats perfection in early stages
📊 Data-driven decisions, gut-check validation
💡 Customer obsession over product obsession
🔄 Iterate based on real market feedback
💰 Unit economics must work at scale
🛡️ Build defensible moats from day one

Remember: You're not just providing information — you're acting as their strategic partner who genuinely wants them to succeed. Every response should feel like advice from someone who has equity in their outcome and has walked this path before.

Always end responses with forward momentum - either next steps, a question to keep them thinking, or encouragement to take action.`;
  };

  // Enhanced sector-specific knowledge function
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

  const getSectorSpecificKnowledge = (sector: string) => {
    const sectorKnowledge: Record<SectorKey, string> = {
      FinTech: `
- Regulatory landscape (PCI DSS, KYC/AML, GDPR, PSD2, open banking)
- Payment infrastructure and processor relationships
- Banking partnerships and API integrations
- Fraud detection, risk management, and security protocols
- Financial product design and user experience optimization
- Capital requirements, licensing, and compliance strategies
- Blockchain/crypto implications and opportunities
- Embedded finance and API-first business models
- Customer acquisition in highly regulated markets`,

      HealthTech: `
- Healthcare regulations (HIPAA, FDA, HITECH, state licensing)
- Clinical validation processes and evidence generation
- EHR integration strategies and interoperability standards
- Provider workflow optimization and change management
- Reimbursement models and payer relationship building
- Telehealth platforms and remote care delivery
- Medical device development and certification pathways
- Patient engagement and health outcome measurement
- Healthcare data analytics and AI implementation`,

      EdTech: `
- Educational technology adoption cycles and decision-making
- LMS integration and institutional sales processes
- Student data privacy (FERPA, COPPA, GDPR compliance)
- Curriculum design and pedagogical effectiveness measurement
- Teacher training and professional development programs
- Assessment methodologies and learning analytics
- B2B education sales and procurement processes
- International expansion and localization strategies
- Accessibility standards (WCAG) and inclusive design`,

      "E-commerce": `
- Marketplace dynamics and platform optimization strategies
- Supply chain management and inventory optimization
- Payment processing and fraud prevention systems
- Customer acquisition cost (CAC) and lifetime value (LTV) optimization
- Conversion rate optimization and user experience design
- Multi-channel retail and omnichannel integration
- International expansion and cross-border commerce
- Logistics partnerships and fulfillment strategies
- Brand building and customer retention in competitive markets`,

      SaaS: `
- Subscription business models and pricing strategy optimization
- Product-led growth (PLG) and viral coefficient improvement
- Customer success programs and churn reduction strategies
- Enterprise sales processes and account-based marketing
- API design and third-party integration strategies
- Onboarding optimization and time-to-value acceleration
- Feature prioritization and product roadmap management
- Vertical SaaS vs horizontal platform positioning
- Usage-based pricing and value metric identification`,

      "AI/ML": `
- Machine learning model development and deployment pipelines
- Data infrastructure and ML operations (MLOps) best practices
- AI ethics, bias detection, and responsible AI implementation
- Computer vision and natural language processing applications
- Edge computing and on-device AI optimization
- Synthetic data generation and privacy-preserving techniques
- AI regulation compliance and governance frameworks
- Model performance monitoring and continuous improvement
- AI product design and human-AI interaction patterns`,

      "Blockchain/Web3": `
- Smart contract development, security, and audit processes
- Tokenomics design and cryptocurrency mechanics
- Decentralized autonomous organization (DAO) governance
- DeFi protocols, yield farming, and liquidity management
- NFT marketplaces and digital asset monetization
- Cross-chain interoperability and bridge technologies
- Regulatory compliance in evolving crypto landscape
- Community building and token-based incentive systems
- Web3 user experience and wallet integration strategies`,

      IoT: `
- Connected device architecture and communication protocols
- Edge computing and real-time data processing strategies
- Device management platforms and over-the-air update systems
- Industrial IoT and smart manufacturing implementations
- Consumer IoT privacy, security, and data governance
- Sensor integration and hardware-software co-design
- Connectivity options (5G, LoRaWAN, WiFi 6, Bluetooth LE)
- IoT data monetization and analytics platform development
- Scalable device provisioning and lifecycle management`,

      Cybersecurity: `
- Threat detection and incident response automation
- Zero-trust architecture design and implementation
- Compliance frameworks (SOC 2, ISO 27001, NIST, PCI DSS)
- Identity and access management (IAM) and privileged access
- Cloud security and multi-cloud governance strategies
- Security awareness training and human factor optimization
- Penetration testing and vulnerability management programs
- Security operations center (SOC) design and staffing
- Cyber insurance and risk quantification methodologies`,

      "Climate Tech": `
- Carbon accounting, ESG reporting, and impact measurement
- Renewable energy systems design and integration
- Sustainability metrics and environmental impact assessment
- Green financing, carbon credits, and climate-focused investing
- Circular economy business models and waste reduction
- Environmental compliance and regulatory navigation
- Clean technology adoption barriers and market education
- Climate risk assessment and adaptation strategies
- Corporate sustainability programs and B-Corp certification`,

      "General Tech": `
- Cross-industry technology trends and adoption patterns
- Platform business models and network effect strategies
- Developer ecosystem building and API monetization
- Cloud infrastructure decisions and scalability planning
- Data strategy, analytics, and business intelligence
- Digital transformation and legacy system modernization
- Emerging technology evaluation and strategic implementation
- Technology stack optimization and technical debt management
- Innovation processes and technology scouting methodologies`,
    };

    return (
      sectorKnowledge[sector as SectorKey] || sectorKnowledge["General Tech"]
    );
  };

  // Usage example:
  const systemPrompt = getEnhancedSystemPrompt(selectedSector);

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
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "system",
            content: systemPrompt,
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
