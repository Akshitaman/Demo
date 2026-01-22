"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MockAIService, ChatMessage } from '@/lib/ai-service';
import { Send, User, Bot, Loader2, MessageSquare, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <MessageSquare className="h-8 w-8 text-cyan-400 mb-2" />
          <h3 className="font-semibold text-sm text-foreground mb-1">Chat Assistant</h3>
          <p className="text-xs">Ask questions about your note or ask for writing tips.</p>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative w-full bg-[#1e1e1e] rounded-2xl border border-cyan-500 flex items-center px-4 py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white focus:outline-none border-none mr-2 font-sans"
              />
              <div className="flex items-center gap-3">
                <button type="button" className="text-zinc-400 hover:text-white transition-colors">
                  <Mic className="h-5 w-5 stroke-[1.5]" />
                </button>
                <Button
                  size="icon"
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="h-8 w-8 text-white hover:text-zinc-300 hover:bg-white/10 transition-colors bg-transparent border-none shadow-none"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-full gap-2 text-xs",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
            </div>
            <div className={cn(
              "p-2 rounded-lg max-w-[85%] whitespace-pre-wrap",
              msg.role === 'user'
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 text-xs">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Bot className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="bg-muted p-2 rounded-lg rounded-tl-none flex items-center">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative w-full bg-[#1e1e1e] rounded-2xl border border-cyan-500 flex items-center px-4 py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white focus:outline-none border-none mr-2 font-sans"
            />
            <div className="flex items-center gap-3">
              <button type="button" className="text-zinc-400 hover:text-white transition-colors">
                <Mic className="h-5 w-5 stroke-[1.5]" />
              </button>
              <Button
                size="icon"
                type="submit"
                disabled={!input.trim() || loading}
                className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors bg-transparent border-none shadow-none"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
