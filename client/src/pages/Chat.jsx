import React, { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Welcome to EmbrAlrt Chat! How can I help you with wildfire information today?",
      sender: "system",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Add user message to chat
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      
      // Clear input field
      const messageToSend = newMessage;
      setNewMessage("");
      setIsLoading(true);
      
      try {
        // Send message to API
        const response = await fetch("http://localhost:4000/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageToSend }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to get response from server");
        }
        
        const data = await response.json();
        
        // Add AI response to chat
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            text: data.reply, 
            sender: "system" 
          }
        ]);
      } catch (err) {
        console.error("Chat error:", err);
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", 
            sender: "system",
            isError: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const placeholderTips = [
    "What should I do in case of a nearby wildfire?",
    "How can I create a defensible space around my home?",
    "What items should be in my emergency evacuation kit?",
    "What causes wildfires to spread quickly?",
  ];

  return (
    <div className="p-4 pb-20 h-full flex flex-col bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Wildfire Information Chatbot
      </h1>

      <div className="flex-grow mb-4 flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* Chat Messages Area */}
          <div className="space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-amber-600 text-white' 
                      : msg.isError 
                        ? 'bg-red-600/70 text-white' 
                        : 'bg-slate-700 text-gray-100'
                  }`}
                >
                  {msg.isError && (
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={16} className="text-white" />
                      <span className="text-sm font-medium">Connection Error</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Placeholder Tips */}
          {messages.length <= 2 && (
            <div className="mb-4 bg-slate-700/50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Try asking about:
              </p>
              <ul className="space-y-1 text-sm text-gray-300">
                {placeholderTips.map((tip, index) => (
                  <li 
                    key={index}
                    className="cursor-pointer hover:text-amber-400 transition-colors"
                    onClick={() => {
                      setNewMessage(tip);
                    }}
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-700 bg-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow px-3 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              className={`${
                isLoading || !newMessage.trim() 
                  ? 'bg-amber-700/50 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700'
              } text-white px-4 py-2 rounded-lg transition-colors`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
