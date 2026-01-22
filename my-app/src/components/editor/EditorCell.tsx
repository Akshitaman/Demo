"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Cell } from '@/store/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, Trash, Bold, Italic, Code } from 'lucide-react';
import { LintService, LintError } from '@/lib/lint-service';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorCellProps {
    cell: Cell;
    onChange: (content: string) => void;
    onDelete: () => void;
    onSelect?: () => void;
    onCursorMove?: (line: number, col: number) => void;
    isActive?: boolean;
}

export function EditorCell({ cell, onChange, onDelete, onSelect, onCursorMove, isActive }: EditorCellProps) {
    const [isEditing, setIsEditing] = useState(true); // Default to true
    const [lintErrors, setLintErrors] = useState<LintError[]>([]);
    const [selection, setSelection] = useState<{ start: number, end: number, top: number, left: number } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [cell.content, isEditing]);

    // Run linting when editing
    useEffect(() => {
        if (isEditing) {
            if (cell.content) {
                const errors = LintService.lint(cell.content);
                setLintErrors(errors);
            }
            const timer = setTimeout(() => {
                const errors = LintService.lint(cell.content);
                setLintErrors(errors);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setLintErrors([]);
        }
    }, [cell.content, isEditing]);

    const updateCursorPosition = () => {
        if (textareaRef.current && onCursorMove) {
            const val = textareaRef.current.value;
            const selectionStart = textareaRef.current.selectionStart;
            const lines = val.substring(0, selectionStart).split("\n");
            const line = lines.length;
            const col = lines[lines.length - 1].length + 1;
            onCursorMove(line, col);
        }
    };

    const handleFocus = () => {
        setIsEditing(true);
        if (onSelect) onSelect();
        updateCursorPosition();
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        updateCursorPosition();
    };

    const handleSelect = () => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;

        if (start !== end) {
            // Calculate position for toolbar
            const rect = textareaRef.current.getBoundingClientRect();
            // Simple approximation for floating toolbar position
            setSelection({ start, end, top: rect.top - 50, left: rect.left + 20 });
        } else {
            setSelection(null);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
                "group relative mb-6 rounded-3xl border transition-all duration-500 overflow-hidden",
                "bg-[#050505]/60 backdrop-blur-xl border-cyan-500/20 font-sans",
                // Focus state
                "focus-within:border-cyan-400/50 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
                isActive && "border-cyan-400 ring-1 ring-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            )}
            onClick={() => {
                if (onSelect) onSelect();
            }}
        >
            {/* Content Area */}
            <div
                className="min-h-[1.5em] p-4 w-full cursor-text text-gray-200"
                onClick={(e) => {
                    e.stopPropagation();
                    handleFocus();
                }}
            >
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            ref={textareaRef}
                            value={cell.content}
                            onChange={handleChange}
                            onKeyUp={() => { updateCursorPosition(); handleSelect(); }}
                            onClick={() => { updateCursorPosition(); handleSelect(); }}
                            onSelect={handleSelect}
                            className="w-full bg-transparent resize-none outline-none font-medium text-xl leading-relaxed min-h-[1.5em] overflow-hidden text-zinc-100 placeholder:text-zinc-900 transition-all"
                            placeholder="Start writing..."
                            autoFocus
                        />
                        {/* Lint Warnings */}
                        {lintErrors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-2 text-xs text-yellow-600 dark:text-yellow-400"
                            >
                                <div className="flex items-center gap-1.5 font-semibold mb-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Suggestion</span>
                                </div>
                                <ul className="pl-5 list-disc space-y-0.5">
                                    {lintErrors.slice(0, 3).map((err) => (
                                        <li key={err.id}>
                                            <span className="opacity-80">{err.message}</span>
                                            {err.suggestion && <span className="font-medium ml-1">→ {err.suggestion}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="prose dark:prose-invert max-w-none text-lg">
                        {cell.content ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {cell.content}
                            </ReactMarkdown>
                        ) : (
                            <span className="text-muted-foreground/40 italic text-lg select-none">
                                Start writing...
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Toolbar */}
            <AnimatePresence>
                {selection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="fixed z-50 flex items-center gap-1 bg-[#050505]/90 backdrop-blur-xl border border-cyan-500/30 p-1 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.1)]"
                        style={{ top: selection.top, left: selection.left }}
                    >
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-400 rounded-full transition-all">
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-400 rounded-full transition-all">
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-400 rounded-full transition-all">
                            <Code className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Hint */}
            {/* Cell Actions */}
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                    onClick={onDelete}
                    title="Delete Cell"
                >
                    <Trash className="h-4 w-4" />
                </Button>
                {isEditing && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-all"
                        title="AI Assist"
                    >
                        <Sparkles className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
