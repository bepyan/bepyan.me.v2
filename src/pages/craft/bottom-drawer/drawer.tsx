import { CheckIcon, SearchIcon } from 'lucide-react';

export default function Drawer() {
  return (
    <div className="relative flex w-full max-w-[300px] flex-col overflow-hidden rounded-3xl bg-gray-50 p-6">
      <div className="absolute right-5 top-5 z-10 ">
        <CloseButton />
      </div>
      <div className="flex items-center">
        <div className="text-lg font-bold">초대장</div>
      </div>
      <div className="text-second">네트워킹 데이에 당신을 초대합니다.</div>
      <div className="mt-4 flex flex-col gap-2">
        <button className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
          <div>
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>자세히 보기</div>
        </button>
        <button className="bg-blue-100 text-blue-500 flex items-center gap-2 rounded-2xl px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
          <div>
            <CheckIcon className="h-5 w-5" />
          </div>
          <div>초대 수락하기</div>
        </button>
      </div>
    </div>
  );
}

function CloseButton() {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-transform focus:scale-95 active:scale-75"
      type="button"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.4854 1.99998L2.00007 10.4853"
          stroke="#999999"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M10.4854 10.4844L2.00007 1.99908"
          stroke="#999999"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
  );
}
