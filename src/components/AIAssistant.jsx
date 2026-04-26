import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiRobot2Line, RiSendPlane2Line, RiCloseLine } from "react-icons/ri";

const AIAssistant = () => {
  const userState = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "SYSTEM_INITIALIZED: I am the ThinkTank Editorial Agent. How can I assist with your research?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    if (!userState.userInfo) {
      setMessages([...messages, { role: "assistant", content: "SYSTEM_OFFLINE: Please authenticate (Enter) to access Editorial Intelligence." }]);
      return;
    }
    
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userState.userInfo.token}`,
        },
      };
      const { data } = await axios.post("/api/ai/query", {
        prompt: input,
        context: "Global Archive Interface"
      }, config);
      setMessages([...newMessages, data]);
    } catch (error) {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "SYSTEM_ERROR: AI reasoning protocol failed. Check backend configuration." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[1000]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-bone dark:bg-matte-black border-thin border-black/20 dark:border-white/20 flex flex-col shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
          <div className="p-6 border-b-thin border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-syne font-bold text-xs uppercase tracking-widest">Editorial Agent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 border-thin ${msg.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-black/10 dark:border-white/10 opacity-80'} font-ibm text-[10px] uppercase tracking-wider leading-relaxed whitespace-pre-wrap`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-4 border-thin border-black/10 dark:border-white/10 opacity-40 font-ibm text-[8px] uppercase tracking-[0.3em] animate-pulse">
                  [REASONING_IN_PROGRESS...]
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t-thin border-black/10 dark:border-white/10 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="QUERY_SYSTEM..."
              className="flex-1 bg-transparent border-thin border-black/5 dark:border-white/5 px-4 py-3 font-ibm text-[10px] uppercase tracking-widest focus:border-black dark:focus:border-white outline-none transition-colors"
            />
            <button onClick={handleSend} className="p-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
              <RiSendPlane2Line className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-thin border-transparent hover:scale-110 active:scale-95 transition-all shadow-xl"
        >
          <div className="absolute inset-0 border-thin border-black dark:border-white animate-ping opacity-20 scale-125" />
          <RiRobot2Line className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
