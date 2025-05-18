import { motion, MotionValue } from 'motion/react';

import { cn } from '~/libs/utils';

export default function ProgressCircular(props: {
  progress: MotionValue<number>;
  strokeWidth?: number;
  className?: string;
}) {
  const { progress, strokeWidth = 4, className } = props;
  return (
    <span className={cn('relative rounded-full', className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="10"
          cy="10"
          r="8"
          strokeWidth={strokeWidth}
          stroke="var(--gray-400)"
          fill="none"
          strokeLinecap="round"
        />
        <motion.circle
          cx="10"
          cy="10"
          r="8"
          strokeWidth={strokeWidth}
          stroke="var(--gray-700)"
          fill="none"
          strokeDasharray="50"
          strokeLinecap="round"
          style={{
            pathLength: progress,
          }}
        />
      </svg>
    </span>
  );
}
