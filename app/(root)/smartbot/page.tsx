"use client";

import RightChatHistory from "@/components/ui/RightChatHistory";
import { useState, useEffect, useRef } from "react";

type ChatHistoryItem = {
  id: number;
  question: string;
  answer: string;
  created_at: string;
};

type Message = {
  role: "user" | "bot";
  content: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputRows, setInputRows] = useState(1);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found. Redirecting to login.");
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
        setUserId(data.accountNumber);
        fetchChatHistory(token);
        console.log("Chatbot User Data Object:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/chat-history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch chat history");
      
      const data = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaLineHeight = 24;
    const previousRows = e.target.rows;
    e.target.rows = 1;
    
    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);
    
    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }
    
    if (currentRows >= 6) {
      e.target.rows = 6;
      e.target.scrollTop = e.target.scrollHeight;
    } else {
      e.target.rows = currentRows;
    }
    
    setInputRows(currentRows);
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const token = localStorage.getItem("authToken");

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setInputRows(1); // Reset rows when message is sent
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: input,
          user_id: userId,
        }),
      });
      
      const data = await response.json();
      if (data?.response) {
        setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
        fetchChatHistory(token);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="chatbot">
      <div className="container">
      <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-bold text-blue-800 max-xl:hidden text-center mx-auto">
  Smart Chatbot
</h1>

        <div className="chat-window" ref={chatWindowRef}>
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
          <textarea
            rows={inputRows}
            className="chat-input"
            value={input}
            onChange={handleChange}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button className="send-button" onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
      <RightChatHistory 
        history={chatHistory} 
        expandedId={expandedId} 
        onToggle={toggleExpand} 
      />
    </div>
  );
};

export default Chatbot;
