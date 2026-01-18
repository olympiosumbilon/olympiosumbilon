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

  const parseValue = (val: string) => {
    const prefix = val.match(/^[^0-9]*/)?.[0] || '';
    const numericMatch = val.match(/[\d,]+/);
    const numericStr = numericMatch ? numericMatch[0].replace(/,/g, '') : '0';
    const numericValue = parseInt(numericStr, 10) || 0;
    const afterNumber = val.substring(val.indexOf(numericStr) + numericStr.length);
    const suffix = afterNumber || '';
    
    return { prefix, numericValue, suffix, hasCommas: numericMatch ? numericMatch[0].includes(',') : false };
  };

  const formatNumber = (num: number, useCommas: boolean) => {
    if (useCommas) {
      return num.toLocaleString('en-US');
    }
    return num.toString();
  };

  const { prefix, numericValue, suffix, hasCommas } = parseValue(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue(0, numericValue, duration);
          } else {
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
      
      setDisplayValue(formatNumber(current, hasCommas));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(update);
      }
    };
    
    animationRef.current = requestAnimationFrame(update);
  };

  if (numericValue === 0 && value.toLowerCase().includes('hundred')) {
    return (
      <span ref={ref} className="tabular-nums">
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
}
