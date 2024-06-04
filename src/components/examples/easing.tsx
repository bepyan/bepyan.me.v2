'use client';

import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import useMeasure from 'react-use-measure';

import { cn } from '~/libs/utils';

const Wrapper = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(function Wrapper({ className, children }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative h-20 overflow-hidden rounded-lg border bg-page',
        className,
      )}
    >
      {children}
    </div>
  );
});

export function Easing() {
  const [ref, bounds] = useMeasure();
  const [on, setOn] = useState(false);

  const list = ['ease-in', 'ease-out', 'ease-in-out'] as const;

  return (
    <Wrapper ref={ref} className="flex h-40 flex-col justify-center gap-1">
      {list.map((item) => (
        <div key={item} className="flex items-center gap-2 px-5">
          <span className="w-20 text-xs">{item}</span>
          <button
            key={item}
            className={cn(
              'h-10 w-10 rounded-full bg-gray-200 transition duration-1000',
              item,
            )}
            style={{
              transform: `translateX(${on ? bounds.width - 170 : 0}px)`,
            }}
            onClick={() => setOn((prev) => !prev)}
          />
        </div>
      ))}
    </Wrapper>
  );
}

export function Linear() {
  return (
    <Wrapper>
      <Marquee className="flex h-full items-center" speed={20}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="mr-2">
            Linear
          </div>
        ))}
      </Marquee>
    </Wrapper>
  );
}
