'use client';

import { useEffect, useRef } from 'react';

import { cn } from '~/libs/utils';

import styles from './cursor-effect-3dot.module.css';

export default function CursorEffect() {
  const boxRef = useRef<HTMLDivElement>(null);

  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const updateDots = () => {
    dotsRef.current.forEach((dot) => {
      if (dot) {
        dot.style.left = `${cursorRef.current.x}px`;
        dot.style.top = `${cursorRef.current.y}px`;
      }
    });
  };

  const loop = () => {
    updateDots();
    animationRef.current = requestAnimationFrame(loop);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();

    cursorRef.current.x = e.clientX - rect.left;
    cursorRef.current.y = e.clientY - rect.top;
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    cursorRef.current = { x: width / 2, y: height / 2 };

    window.addEventListener('mousemove', onMouseMove);
    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      animationRef.current && cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={boxRef} className={cn(styles.box)}>
      <p>마우스를 박스 안에서 움직여 보세요.</p>
      <div
        ref={(el) => (dotsRef.current[0] = el)}
        className={cn(styles.dot, styles.d1)}
      />
      <div
        ref={(el) => (dotsRef.current[1] = el)}
        className={cn(styles.dot, styles.d2)}
      />
      <div
        ref={(el) => (dotsRef.current[2] = el)}
        className={cn(styles.dot, styles.d3)}
      />
    </div>
  );
}
