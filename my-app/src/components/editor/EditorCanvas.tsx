"use client";

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Note, Cell } from '@/store/types';
import { EditorCell } from './EditorCell';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EditorCanvasProps {
    note: Note;
    onUpdate: (note: Note) => void;
}

export function EditorCanvas({ note, onUpdate }: EditorCanvasProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = note.cells.findIndex((c) => c.id === active.id);
            const newIndex = note.cells.findIndex((c) => c.id === over.id);

            const newCells = arrayMove(note.cells, oldIndex, newIndex);
            onUpdate({ ...note, cells: newCells });
        }
    };

    const handleCellChange = (id: string, newContent: string) => {
        const newCells = note.cells.map(c => c.id === id ? { ...c, content: newContent } : c);
        onUpdate({ ...note, cells: newCells });
    };

    const handleDeleteCell = (id: string) => {
        const newCells = note.cells.filter(c => c.id !== id);
        onUpdate({ ...note, cells: newCells });
    };

    const addCell = () => {
        const newCell: Cell = {
            id: uuidv4(),
            type: 'markdown',
            content: ''
        };
        onUpdate({ ...note, cells: [...note.cells, newCell] });
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 pb-32">
            <div className="mb-8">
                <input
                    type="text"
                    value={note.title}
                    onChange={(e) => onUpdate({ ...note, title: e.target.value })}
                    className="text-4xl font-bold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground"
                    placeholder="Untitled Note"
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={note.cells.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {note.cells.map(cell => (
                        <EditorCell
                            key={cell.id}
                            cell={cell}
                            onChange={(content) => handleCellChange(cell.id, content)}
                            onDelete={() => handleDeleteCell(cell.id)}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <div className="mt-4 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="ghost" onClick={addCell} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Cell
                </Button>
            </div>

            {/* Helper to always have at least one cell or button if empty */}
            {note.cells.length === 0 && (
                <div className="mt-8 flex justify-center">
                    <Button onClick={addCell}>Start Writing</Button>
                </div>
            )}
        </div>
    );
}
