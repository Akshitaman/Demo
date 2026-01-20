"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Summarizer } from './Summarizer';
import { QuizGenerator } from './QuizGenerator';
import { AIChat } from './AIChat';

export type AIToolType = 'summarize' | 'chat' | 'quiz' | null;

interface AISidebarPanelProps {
    isOpen: boolean;
    activeTool: AIToolType;
    onClose: () => void;
    noteContent: string;
}

export function AISidebarPanel({ isOpen, activeTool, onClose, noteContent }: AISidebarPanelProps) {
    if (!isOpen || !activeTool) return null;

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

    const getTitle = () => {
        switch (activeTool) {
            case 'summarize': return "Summarize Note";
            case 'quiz': return "Quiz Generator";
            case 'chat': return "AI Assistant";
            default: return "AI Tool";
        }
    };

    return (
        <div className="absolute top-0 right-[-320px] w-[320px] h-full bg-background border-l shadow-2xl z-50 transition-all duration-300 transform translate-x-0 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold text-sm">{getTitle()}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                {renderTool()}
            </div>
        </div>
    );
}
