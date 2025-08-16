import { format } from 'date-fns';
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
    <div className="flex items-center gap-1.5">
      {isOpen && (
        <div
          className="text-disabled text-2xs"
          data-animate
          data-animate-speed="super-fast"
        >
          {format(time, 'yyyy.MM.dd HH:mm:ss')
            .split('')
            .map((char, index) => (
              <span key={index}>{char}</span>
            ))}
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)}>
        <Clock />
      </button>
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
