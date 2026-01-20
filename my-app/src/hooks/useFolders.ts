"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import { Folder } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';

export function useFolders() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFolders = useCallback(async () => {
        setLoading(true);
        try {
            const fetched = await db.folders.getAll();
            setFolders(fetched);
        } catch (error) {
            console.error("Failed to fetch folders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    const createFolder = async (name: string, parentId: string | null = null) => {
        const newFolder: Folder = {
            id: uuidv4(),
            name,
            parentId,
            createdAt: Date.now(),
        };
        await db.folders.put(newFolder);
        await fetchFolders();
        return newFolder;
    };

    return {
        folders,
        loading,
        createFolder,
        refresh: fetchFolders
    };
}
