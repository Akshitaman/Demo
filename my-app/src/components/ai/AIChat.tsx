"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MockAIService, ChatMessage } from '@/lib/ai-service';
import { Send, User, Bot, Loader2, MessageSquare, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  content: string;
}

export function AIChat({ content }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await MockAIService.chat([...messages, userMsg], content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent),radial-gradient(1.5px_1.5px_at_40px_70px,#fff,transparent),radial-gradient(2px_2px_at_50px_160px,#fff,transparent),radial-gradient(1px_1px_at_80px_120px,#fff,transparent),radial-gradient(1.5px_1.5px_at_110px_190px,#fff,transparent)] bg-size-[200px_200px]" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-20 w-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <MessageSquare className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tighter mb-2 italic">Neural Network Ready</h3>
              <p className="text-zinc-500 text-sm max-w-[200px]">Query the database or request analysis of the current node content.</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              key={index}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed relative overflow-hidden",
                  message.role === 'user'
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "bg-cyan-900/10 border border-cyan-500/20 text-zinc-300 backdrop-blur-xl italic shadow-inner ml-2"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40" />
                )}
                {message.content}
              </div>
            </motion.div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-sm ml-2">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-transparent">
        <div className="relative group">
          {/* Scanning Line Animation */}
          {loading && (
            <motion.div
              className="absolute top-0 h-full w-1 bg-cyan-400 blur-[2px] z-10"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query Klaer AI..."
            className="w-full bg-[#0a0a0a]/80 backdrop-blur-3xl border border-cyan-500/30 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all placeholder:text-zinc-700 font-medium text-white shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-cyan-500 text-black rounded-full hover:bg-cyan-400 disabled:opacity-50 transition-all font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
