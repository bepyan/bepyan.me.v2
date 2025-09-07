import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import Clock from '~/components/ui/clock';

function CurrentTime() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Clock />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="text-disabled text-2xs flex items-center overflow-hidden whitespace-pre"
            initial={{
              width: 0,
            }}
            animate={{
              width: 'auto',
              transition: { type: 'spring', bounce: 0 },
            }}
            exit={{
              width: 0,
              transition: { type: 'spring', bounce: 0, delay: 0.1 },
            }}
          >
            <span className="inline-block w-1 shrink-0"></span>
            {format(time, 'yyyy.MM.dd HH:mm:ss')
              .split('')
              .map((char, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    filter: 'blur(2px)',
                  }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: { delay: 0.1 + index * 0.01 },
                  }}
                  exit={{
                    opacity: 0,
                    filter: 'blur(2px)',
                    transition: { delay: 0.15 + (char.length - index) * 0.01 },
                  }}
                >
                  {char}
                </motion.span>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BrowserInfo() {
  const [browser, setBrowser] = useState('Unknown');

  const getBrowser = () => {
    const isArc =
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue('--arc-palette-focus')
        .trim() !== '';

    if (isArc) return 'Arc Browser';

    const ua = navigator.userAgent;

    switch (true) {
      case ua.includes('Firefox'):
        return 'Firefox';
      case ua.includes('Chrome') && !ua.includes('Edg'):
        return 'Chromium';
      case ua.includes('Safari') && !ua.includes('Chrome'):
        return 'Safari';
      case ua.includes('Edg'):
        return 'Edge';
      case ua.includes('Opera') || ua.includes('OPR'):
        return 'Opera';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    setBrowser(getBrowser());
  }, []);

  return <span>{browser}</span>;
}

function Dimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <span>
      {dimensions.width}x{dimensions.height}
    </span>
  );
}

function CursorPoint() {
  const [cursorPoint, setCursorPoint] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPoint({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span>
      ({cursorPoint.x}, {cursorPoint.y})
    </span>
  );
}

export default function UserMeta() {
  return (
    <div className="text-disabled flex items-center gap-2 text-xs">
      <BrowserInfo />
      <Dimensions />
      <CursorPoint />
      <div className="ml-auto flex items-center gap-2">
        <CurrentTime />
      </div>
    </div>
  );
}
