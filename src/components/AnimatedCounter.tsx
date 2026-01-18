'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animation when visible
            animateValue(0, numericValue, duration);
          } else {
            // Reset to 0 when leaving viewport
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
            setDisplayValue('0');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [numericValue, duration]);

  const animateValue = (start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setDisplayValue(current.toString());
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(update);
      }
    };
    
    animationRef.current = requestAnimationFrame(update);
  };

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
}
