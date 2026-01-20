export type CellType = 'markdown' | 'code' | 'ai-prompt';

export interface Cell {
    id: string;
    type: CellType;
    content: string;
    metadata?: Record<string, any>;
}

export interface Note {
    id: string;
    title: string;
    folderId: string | null;
    cells: Cell[];
    createdAt: number;
    updatedAt: number;
}

export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: number;
}

export interface UserStats {
    id: 'current-user'; // Singleton
    streak: {
        current: number;
        max: number;
        lastLoginDate: string; // ISO Date string
    };
    activityLog: Record<string, number>; // Date string -> count
    totalNotes: number;
    totalWords: number;
}
