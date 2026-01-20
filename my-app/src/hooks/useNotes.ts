"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import { Note } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';

export function useNotes(currentFolderId: string | null = null) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const fetched = await db.notes.getByFolder(currentFolderId);
            // Sort by updatedAt desc
            fetched.sort((a, b) => b.updatedAt - a.updatedAt);
            setNotes(fetched);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setLoading(false);
        }
    }, [currentFolderId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const createNote = async (title: string = 'Untitled Note') => {
        const newNote: Note = {
            id: uuidv4(),
            title,
            folderId: currentFolderId,
            cells: [{ id: uuidv4(), type: 'markdown', content: '' }],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await db.notes.put(newNote);
        await fetchNotes(); // Refresh
        return newNote;
    };

    const updateNote = async (note: Note) => {
        const updated = { ...note, updatedAt: Date.now() };
        await db.notes.put(updated);
        setNotes(prev => prev.map(n => n.id === note.id ? updated : n));
    };

    const deleteNote = async (id: string) => {
        await db.notes.delete(id);
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return {
        notes,
        loading,
        createNote,
        updateNote,
        deleteNote,
        refresh: fetchNotes
    };
}
