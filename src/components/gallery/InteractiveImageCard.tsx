'use client';

import React,
{
  useRef,
  useState,
  useEffect,
  MouseEventHandler
} from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface InteractiveImageCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  width: number;
  height: number;
  dataAiHint: string;
}

export function InteractiveImageCard({
  src,
  alt,
  title,
  description,
  width,
  height,
  dataAiHint,
}: InteractiveImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  const isMobile = useIsMobile();
  const animationFrameId = useRef<number>(0);

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMobile || !cardRef.current) return;

    cancelAnimationFrame(animationFrameId.current!);

    animationFrameId.current = requestAnimationFrame(() => {
      const {
        left,
        top,
        width,
        height
      } = cardRef.current!.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = (y / height - 0.5) * -20; // Max rotation 10 degrees
      const rotateY = (x / width - 0.5) * 20; // Max rotation 10 degrees

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: 'transform 0.1s ease-out',
      });
    });
  };

  const onMouseLeave = () => {
    if (isMobile) return;
    cancelAnimationFrame(animationFrameId.current!);
    setStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    });
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={cardRef}
      className="group relative rounded-lg overflow-hidden transition-transform duration-500 ease-out"
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ transformStyle: 'preserve-3d' }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ transform: 'translateZ(20px)' }}
          data-ai-hint={dataAiHint}
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "p-6 flex flex-col justify-end",
            "bg-gradient-to-t from-black/80 via-transparent to-transparent",
            "backdrop-blur-sm"
          )}
          style={{ transform: 'translateZ(50px) scale(0.95)' }}
        >
          <h3 className="text-2xl font-bold text-white font-headline">{title}</h3>
          <p className="text-sm text-white/80 mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
