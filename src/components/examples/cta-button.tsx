import React, { useEffect, useRef } from 'react';

import { cn } from '~/libs/utils';

import styles from './cta-button.module.css';

export default function CTAButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let start = 0;

    const updateStart = () => {
      if (!ref.current) return;

      start += 1;
      ref.current.style.setProperty('--start', start.toString());

      requestAnimationFrame(updateStart);
    };

    updateStart();
  }, [ref]);

  return (
    <button
      {...props}
      ref={ref}
      className={cn(
        'relative inline-flex h-[40px] items-center justify-center gap-2 overflow-hidden px-4 font-serif font-bold',
        'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
        'transition-transform hover:scale-105 active:scale-95',
        styles.border_effect,
        className,
      )}
    >
      {children}
    </button>
  );
}
