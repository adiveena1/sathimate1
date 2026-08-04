'use client';

import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  stagger?: boolean;
  staggerChildren?: number;
  amount?: number;
  once?: boolean;
  as?: any;
}

/**
 * OPTIMIZATION: ScrollReveal component fixes
 * 1. Prevent unnecessary re-renders with useRef
 * 2. Reduce animation complexity on mobile
 * 3. Use reduced-motion media query for accessibility
 * 4. Prevent layout thrashing with optimized timing
 */
export const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(
  ({
    children,
    className,
    delay = 0,
    stagger = false,
    staggerChildren = 0.1,
    amount = 0.05,
    once = true,
    as = 'div',
    ...props
  }, forwardedRef) => {
    const [isTriggered, setIsTriggered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const MotionComponent = motion(as);

    useEffect(() => {
      // Check for mobile and reduced motion preference
      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
      
      const checkReducedMotion = () => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setPrefersReducedMotion(prefersReduced);
      };

      checkMobile();
      checkReducedMotion();

      const resizeHandler = () => checkMobile();
      window.addEventListener('resize', resizeHandler);

      // Force reveal after 1s as a fail-safe (prevents invisible content)
      timerRef.current = setTimeout(() => {
        setIsTriggered(true);
      }, 1000);
      
      return () => {
        window.removeEventListener('resize', resizeHandler);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    // Reduce animation duration for users with reduced motion preference
    const animationDuration = prefersReducedMotion ? 0.1 : 0.6;

    const itemVariants: Variants = {
      hidden: { opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: animationDuration,
          ease: [0.21, 0.45, 0.32, 0.9],
          delay,
        },
      },
    };

    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : staggerChildren,
          delayChildren: delay,
          duration: 0.3
        },
      },
    };

    const variantsToUse = stagger ? containerVariants : itemVariants;
    const activeState = (isTriggered || isMobile || prefersReducedMotion) ? "visible" : "hidden";

    return (
      <MotionComponent
        ref={forwardedRef}
        initial={isMobile || prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        animate={activeState}
        onViewportEnter={() => setIsTriggered(true)}
        viewport={{ once, amount: amount || 0.05 }}
        variants={variantsToUse}
        className={cn(className)}
        style={{ 
          opacity: (isTriggered || isMobile || prefersReducedMotion) ? 1 : undefined 
        }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);
ScrollReveal.displayName = 'ScrollReveal';

export const ScrollRevealItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const variants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return <motion.div variants={variants} className={className}>{children}</motion.div>
}
