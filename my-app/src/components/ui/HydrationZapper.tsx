"use client";

import React, { useState, useEffect } from 'react';

/**
 * HydrationZapper - A utility component that prevents hydration mismatches
 * by only rendering children after the component has mounted on the client.
 * Includes an optional loading state with a subtle animation.
 */
interface HydrationZapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function HydrationZapper({ children, fallback }: HydrationZapperProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return fallback ?? (
            <div className="flex items-center justify-center h-full w-full bg-[#050505]">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default HydrationZapper;
