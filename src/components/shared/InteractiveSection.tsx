'use client';

import React, { useRef, useState, useEffect, MouseEventHandler } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface InteractiveSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function InteractiveSection({ children, className }: InteractiveSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties & Record<string, any>>({});
  const isMobile = useIsMobile();
  const animationFrameId = useRef<number>();

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMobile || !cardRef.current) return;

    cancelAnimationFrame(animationFrameId.current!);

    animationFrameId.current = requestAnimationFrame(() => {
      const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const rotateX = (y / height - 0.5) * -15;
      const rotateY = (x / width - 0.5) * 15;
      
      const glareX = (x / width) * 100;
      const glareY = (y / height) * 100;

      setStyle({
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
        transition: 'transform 0.1s ease-out',
        '--glare-x': `${glareX}%`,
        '--glare-y': `${glareY}%`,
      });
    });
  };

  const onMouseLeave = () => {
    if (isMobile) return;
    cancelAnimationFrame(animationFrameId.current!);
    setStyle({
      transform: 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
      '--glare-x': '50%',
      '--glare-y': '50%',
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={cardRef}
      className={cn("interactive-section", className)}
      style={{ transformStyle: 'preserve-3d', ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-interactive="true"
    >
      {children}
    </div>
  );
}
