"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MockAIService, ChatMessage } from "@/lib/ai-service";
import { Send, User, Bot, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatProps {
  content: string;
}

export function AIChat({ content }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
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

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await MockAIService.chat(
        [...messages, userMsg],
        content,
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
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
          <h3 className="font-semibold text-sm text-cyan-400 mb-1">
            Chat Assistant
          </h3>
          <p className="text-xs text-cyan-400/75">
            Ask questions about your note or ask for writing tips.
          </p>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-cyan-500/50">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="w-full text-xs p-3 pr-10 rounded-md border bg-background focus:ring-1 focus:ring-primary outline-none"
            />
            <Button
              size="icon"
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1 top-1 h-7 w-7"
              variant="ghost"
            >
              <Send className="h-3 w-3" />
            </Button>
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
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {msg.role === "user" ? (
                <User className="h-3 w-3" />
              ) : (
                <Bot className="h-3 w-3" />
              )}
            </div>
            <div
              className={cn(
                "p-2 rounded-lg max-w-[85%] whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none",
              )}
            >
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

      <div className="p-3 border-t bg-background border-zinc-200 dark:border-cyan-500/50">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full text-xs p-3 pr-10 rounded-md border bg-background focus:ring-1 focus:ring-primary outline-none"
          />
          <Button
            size="icon"
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1 top-1 h-7 w-7"
            variant="ghost"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
}
