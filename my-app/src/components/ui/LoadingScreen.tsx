"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
    const [progress, setProgress] = useState(0);

    // Smooth spring animation for the numbers
    // rapid start, easing out at the end
    const springValue = useSpring(0, {
        stiffness: 30, // Lower stiffness for slower/more visible start
        damping: 15,
        mass: 1
    });

    const displayValue = useTransform(springValue, (latest) => Math.round(latest));

    useEffect(() => {
        // Ensure we start at 0
        springValue.jump(0);

        // Phase 1: Animate to 99%
        const startTimer = setTimeout(() => {
            springValue.set(99);
        }, 100);

        // Phase 2: Wait at 99% then finish to 100%
        // This gives the "hang" effect requested
        const finishTimer = setTimeout(() => {
            springValue.set(100);
        }, 3000); // 3 seconds total wait before completing

        return () => {
            clearTimeout(startTimer);
            clearTimeout(finishTimer);
        };
    }, [springValue]);

    // Force re-render to update the text content from the motion value
    const [displayNumber, setDisplayNumber] = useState("000");
    useEffect(() => {
        const unsubscribe = displayValue.on("change", (latest) => {
            const val = Math.round(latest);
            // Format as 3 digits: 005, 068, 100
            setDisplayNumber(val.toString().padStart(3, '0'));

            if (val === 100 && onComplete) {
                // Add a small delay for impact before triggering completion
                setTimeout(onComplete, 500);
            }
        });
        return unsubscribe;
    }, [displayValue, onComplete]);


    return (
        <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center overflow-hidden cursor-wait font-sans">
            {/* Centered Logo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    // Subtle breathing effect
                    transition: {
                        opacity: { duration: 0.8, ease: "easeOut" },
                        scale: { duration: 0.8, ease: "easeOut" }
                    }
                }}
                className="flex items-center tracking-tighter"
            >
                {/* "Klaer" - Solid Black, Heavy */}
                <h1 className="text-[10rem] leading-none font-black text-black tracking-tighter">
                    Klaer
                </h1>

                {/* "Notebook" - Hollow/Stroke Effect */}
                {/* Using WebkitTextStroke for the outline effect */}
                <h1
                    className="text-[10rem] leading-none font-black text-transparent tracking-tighter ml-4"
                    style={{
                        WebkitTextStroke: '3px black'
                    }}
                >
                    Notebook
                </h1>
            </motion.div>

            {/* Bottom Right Progress Indicator */}
            <div className="absolute bottom-12 right-12 flex items-baseline gap-4">
                {/* Label */}
                <span className="text-black font-extrabold italic text-sm tracking-[0.2em] mb-1">
                    LOADING
                </span>

                {/* Percentage - Hollow Style */}
                <div className="flex items-baseline">
                    <motion.span
                        className="text-6xl font-black text-transparent tabular-nums leading-none font-mono"
                        style={{
                            WebkitTextStroke: '1.5px black'
                        }}
                    >
                        {displayNumber}
                    </motion.span>
                    <span
                        className="text-2xl font-black text-transparent ml-1"
                        style={{
                            WebkitTextStroke: '1px black'
                        }}
                    >
                        %
                    </span>
                </div>
            </div>

            {/* Optional: Simple breathing overlay to keep it alive once 100% is reached (if it stays) */}
            <motion.div
                className="absolute inset-0 pointer-events-none bg-white"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
