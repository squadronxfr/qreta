"use client";

import {useRef, useState, MouseEvent, ReactNode} from "react";

export function Spotlight({children, className = ""}: { children: ReactNode, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({x: 0, y: 0});
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({x: e.clientX - rect.left, y: e.clientY - rect.top});
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
                    opacity,
                }}
            />
            {children}
        </div>
    );
}