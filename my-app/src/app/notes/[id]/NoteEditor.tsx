"use client";

import React, { useEffect } from 'react';
import { useNote } from '@/hooks/useNote';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { Loader2 } from 'lucide-react';

export function NoteEditor({ id }: { id: string }) {
    const { note, loading, saveNote } = useNote(id);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-semibold">Note not found</h2>
                <p className="text-muted-foreground">This note might have been deleted or does not exist.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <EditorCanvas note={note} onUpdate={saveNote} />
        </div>
    );
}
