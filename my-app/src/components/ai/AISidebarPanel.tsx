"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Summarizer } from './Summarizer';
import { QuizGenerator } from './QuizGenerator';
import { AIChat } from './AIChat';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AIToolType = 'summarize' | 'chat' | 'quiz' | null;

interface AISidebarPanelProps {
    isOpen: boolean;
    activeTool: AIToolType;
    onClose: () => void;
    onToolChange: (tool: AIToolType) => void;
    noteContent: string;
}

export function AISidebarPanel({ isOpen, activeTool, onClose, onToolChange, noteContent }: AISidebarPanelProps) {
    if (!activeTool) return null;

    const renderTool = () => {
        switch (activeTool) {
            case 'summarize':
                return <Summarizer content={noteContent} />;
            case 'quiz':
                return <QuizGenerator content={noteContent} />;
            case 'chat':
                return <AIChat content={noteContent} />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 w-full bg-[#050505]/95 backdrop-blur-2xl flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] md:static md:w-full md:h-full md:border-l md:border-cyan-500/20 md:shadow-none"
        >
            <div className="p-6 border-b border-cyan-500/20 flex flex-col gap-6 bg-transparent shrink-0">
                <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        <h3 className="font-black text-2xl tracking-tighter uppercase italic">
                            Klaer <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">AI</span>
                        </h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-cyan-500/10 text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/20" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex bg-[#0a0a0a] rounded-full p-1 border border-cyan-500/10 w-full shadow-inner">
                    {(['chat', 'summarize', 'quiz'] as const).map((tool) => {
                        const isActive = activeTool === tool;
                        const label = tool.charAt(0).toUpperCase() + tool.slice(1);

                        return (
                            <button
                                key={tool}
                                onClick={() => onToolChange(tool)}
                                className={cn(
                                    "relative flex-1 h-9 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 outline-none group",
                                    isActive ? "text-cyan-400" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/40 rounded-full"
                                        initial={false}
                                        animate={{
                                            boxShadow: [
                                                "0 0 10px rgba(6,182,212,0.1)",
                                                "0 0 20px rgba(6,182,212,0.25)",
                                                "0 0 10px rgba(6,182,212,0.1)"
                                            ],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                                            opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                                        }}
                                    />
                                )}
                                <span className="relative z-10">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {renderTool()}
            </div>
        </motion.div>
    );
}
