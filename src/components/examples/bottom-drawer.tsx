'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { SearchIcon } from 'lucide-react';

import { cn } from '~/libs/utils';

export default function BottomDrawer() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
          Click
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent
          className={cn(
            'fixed bottom-0 left-[50%] right-0 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-full',
            'data-[state=open]:duration-150 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-0 data-[state=open]:slide-in-from-left-1/2',
            'data-[state=closed]:duration-100 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-left-1/2',
          )}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gray-75 p-6">
            <div className="absolute right-5 top-5 z-10 ">
              <DialogClose>
                <CloseButton />
              </DialogClose>
            </div>
            <div className="flex items-center">
              <div className="text-lg font-bold text-gray-700">초대장</div>
            </div>
            <div className="text-second">네트워킹 데이에 초대합니다.</div>
            <div className="mt-4 flex flex-col gap-2">
              <button className="flex items-center gap-2 rounded-2xl bg-gray-200 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
                <div>
                  <SearchIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div>자세히 보기</div>
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function CloseButton() {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-transform hover:scale-95 focus:scale-95 active:scale-75"
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
