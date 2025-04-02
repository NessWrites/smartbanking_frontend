// components/Chatbot.tsx
"use client";


import RightChatHistory from "@/components/ui/RightChatHistory";
import { useState, useEffect } from "react";

// import ChatHistory from "@/components/ui/ChatHistory";

// Define the Message type with specific roles
type Message = {
  role: "user" | "bot";
  content: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Use the Message type
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); // Add state for user_id

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");


      if (!token) {
        console.log("No token found. Redirecting to login.");
        // Redirect to login if no token (you may want to handle this more gracefully in your UI)
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        
        const data = await response.json();
        setUserId(data.accountNumber); // Save user_id in the state
        
        // Log the whole user data object
        console.log("Chatbot User Data Object:", data);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const token = localStorage.getItem("authToken");

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`,
           "Content-Type": "application/json", },
        
        body: JSON.stringify({ query: input,
          user_id: userId,
        }),
      });
      

      const data = await response.json();
      if (data && data.response){
      setMessages((prev) => [
        ...prev, { role: "bot", content: data.response },
      ]);
    }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="container">
        <h1 className="title">Chatbot</h1>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={handleChange}
            placeholder="Type a message..."
          />
          <button className="send-button" onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
      <RightChatHistory messages={messages} />
    </div>
  );
};
export default Chatbot;
