import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

const AIChatOverlay: React.FC<AIChatOverlayProps> = ({ isOpen, onClose, language = 'English' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hey sis, I'm here. Safe, private, and ready to help. What's on your mind?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are SheOS, a warm, protective, intelligent, and empathetic AI companion for women. 
        Tone: Like a supportive big sister or a wise best friend.
        Language: Respond in ${language}.
        Rules: 
        1. Keep responses short (max 2-3 sentences) unless asked for details.
        2. If safety/danger is mentioned, give immediate, practical safety advice first.
        3. Be affirming and non-judgmental.
        User says: "${userMsg}"`,
      });
      
      const text = response.text || "I'm here for you. Tell me more.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting, but I'm still here with you." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      
      {/* Chat Container */}
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col h-[85vh] animate-slide-up border-t border-pink-100">
        
        {/* Header */}
        <div className="p-4 border-b border-pink-50 flex justify-between items-center bg-white rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-black text-lg">SheOS</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Your AI Companion
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF5F9]/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-none' 
                    : 'bg-white text-black rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-[#FF0F9A] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#FF0F9A] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#FF0F9A] rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-pink-50 bg-white shrink-0 pb-6">
          <div className="relative shadow-sm rounded-full">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-gray-50 border border-gray-200 text-black rounded-full py-4 pl-5 pr-14 focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 text-base"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 bg-black text-white rounded-full hover:bg-[#FF0F9A] disabled:opacity-50 disabled:hover:bg-black transition-colors shadow-sm"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatOverlay;