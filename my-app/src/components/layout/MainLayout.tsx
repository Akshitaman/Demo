"use client";

import React from 'react';
import { Sidebar } from './Sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
