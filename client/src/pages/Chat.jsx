import React, { useState } from "react";
import { Send } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Welcome to EmbrAlrt Chat! How can we help you today?",
      sender: "system",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      
      // Simulate a response after a short delay
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            text: "Thanks for your message. Our team is reviewing your inquiry and will respond shortly.", 
            sender: "system" 
          }
        ]);
      }, 1000);
      
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const placeholderTips = [
    "Ask about current wildfire conditions",
    "Get information about evacuation routes",
    "Learn about fire prevention tips",
    "Check air quality in your area",
  ];

  return (
    <div className="p-4 pb-20 h-full flex flex-col bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Wildfire Information Chatbot
      </h1>

      <div className="flex-grow mb-4 flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">
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
                      : 'bg-slate-700 text-gray-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder Tips */}
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
            />
            <button
              onClick={handleSendMessage}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
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
