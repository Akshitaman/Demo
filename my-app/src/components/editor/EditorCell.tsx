"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Ensure CSS is imported in globals or here. 
// Note: We might need to import katex CSS in globals if this fails, but let's try.
import { Cell } from '@/store/types';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea'; // We need this component or raw textarea
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Sparkles } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorCellProps {
    cell: Cell;
    onChange: (content: string) => void;
    onDelete: () => void;
    isActive?: boolean;
}

export function EditorCell({ cell, onChange, onDelete, isActive }: EditorCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: cell.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Auto-resize textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [cell.content, isEditing]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative mb-4 rounded-lg border border-transparent bg-card transition-all hover:border-border hover:shadow-sm",
                isActive && "border-primary ring-1 ring-primary",
                isEditing && "border-border shadow-md"
            )}
        >
            {/* Drag Handle & Actions - Visible on Hover/Focus */}
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-muted rounded">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <button onClick={onDelete} className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded">
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Content Area */}
            <div
                className="min-h-[3rem] p-4 w-full"
                onClick={() => setIsEditing(true)}
            >
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={cell.content}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        className="w-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed"
                        placeholder="Type markdown..."
                        autoFocus
                    />
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        {cell.content ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {cell.content}
                            </ReactMarkdown>
                        ) : (
                            <span className="text-muted-foreground italic">Empty cell. Click to edit.</span>
                        )}
                    </div>
                )}
            </div>

            {/* AI Action Hint */}
            {isEditing && (
                <div className="absolute right-2 top-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" title="AI Assist">
                        <Sparkles className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}
