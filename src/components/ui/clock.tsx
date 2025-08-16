import { useEffect, useState } from 'react';

import { cn } from '~/libs/utils';

export default function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // 각도 계산 (12시 방향을 0도로 하여 시계방향으로 회전)
  const hourAngle = hours * 30 + minutes * 0.5; // 시침: 30도/시간 + 0.5도/분
  const minuteAngle = minutes * 6; // 분침: 6도/분
  const secondAngle = seconds * 6; // 초침: 6도/초

  return (
    <div
      className={cn('relative size-4 rounded-full border', className)}
      style={{ borderWidth: 1.5 }}
    >
      {/* 시침 */}
      <div
        className="absolute z-1 origin-bottom bg-current"
        style={{
          width: '1px',
          height: '25%',
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)`,
        }}
      />

      {/* 분침 */}
      <div
        className="absolute z-1 origin-bottom bg-current"
        style={{
          width: '1px',
          height: '35%',
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)`,
        }}
      />

      {/* 초침 */}
      <div
        className="absolute z-10 origin-bottom bg-red-500"
        style={{
          width: '0.5px',
          height: '40%',
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) translateY(-100%) rotate(${secondAngle}deg)`,
        }}
      />
    </div>
  );
}
