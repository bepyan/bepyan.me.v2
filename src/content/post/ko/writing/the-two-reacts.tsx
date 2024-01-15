import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      className="rounded-lg bg-gray-700 px-2 py-1 font-sans font-semibold text-gray-50 transition focus:ring focus:ring-gray-400 active:bg-gray-600"
      onClick={() => setCount(count + 1)}
    >
      저를 {count}번 클릭 했습니다
    </button>
  );
}
