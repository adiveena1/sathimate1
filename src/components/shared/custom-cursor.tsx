'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const isMobile = useIsMobile();
    const animationFrameId = useRef<number>();
    const lastPosition = useRef({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(45);

    useEffect(() => {
        if (isMobile) {
            document.body.classList.remove('cursor-none');
            return;
        }

        document.body.classList.add('cursor-none');

        const onMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(animationFrameId.current!);
            animationFrameId.current = requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                if (cursorRef.current) {
                    cursorRef.current.style.left = `${clientX}px`;
                    cursorRef.current.style.top = `${clientY}px`;
                }

                // Calculate rotation based on movement direction
                const dx = clientX - lastPosition.current.x;
                const dy = clientY - lastPosition.current.y;
                
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    setRotation(angle);
                }

                lastPosition.current = { x: clientX, y: clientY };
            });
        };

        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button, [data-magnetic], [data-interactive]')) {
                setIsHovering(true);
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button, [data-magnetic], [data-interactive]')) {
                setIsHovering(false);
            }
        };
        
        lastPosition.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        return () => {
            document.body.classList.remove('cursor-none');
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isMobile]);

    if (isMobile) return null;

    const cursorStyle = {
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    };
    
    const ArrowIcon = () => (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-200 ease-out"
      >
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

    return (
        <div
            ref={cursorRef}
            className={cn(
                'custom-cursor',
                { 'is-hovering': isHovering }
            )}
            style={cursorStyle}
        >
          <ArrowIcon />
        </div>
    );
}
