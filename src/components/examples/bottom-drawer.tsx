'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import useMeasure from 'react-use-measure';

import { cn } from '~/libs/utils';

export function BottomDrawerDemo() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <BottomDrawer />
    </div>
  );
}

export function BottomDrawer() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
          Click
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-gray-900 opacity-50 dark:bg-gray-200" />
        <DialogContent
          className={cn(
            'fixed bottom-0 left-[50%] right-0 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-20',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-0 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:duration-150',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:duration-100',
          )}
        >
          <Card />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function Card() {
  const [elementRef, bounds] = useMeasure();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-75 p-6">
      <div className="absolute right-5 top-5 z-10">
        <DialogClose>
          <CloseButton />
        </DialogClose>
      </div>
      <motion.div animate={{ height: bounds.height }}>
        <div ref={elementRef} className="flex flex-col gap-2">
          <AnimatePresence>
            {showDetail ? (
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
              >
                <div>
                  <div className="mt-3 text-xl font-bold text-gray-700">
                    FE 네트워킹 데이 초대장
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-second">
                  <div>
                    행사에서 다양한 커리어 고민들을 나누고, 네트워킹으로 미래에
                    좋은 영향을 줄 수 있는 동료가 되어봅시다!
                  </div>
                  <div>
                    <div>장소: 세미나홀</div>
                    <div>일시: 2024년 06월 04일 화요일 오후 5시</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-6">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-200 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95"
                    onClick={() => setShowDetail((b) => !b)}
                  >
                    <div>취소</div>
                  </button>
                  <DialogClose asChild>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-200 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95">
                      <div>확인</div>
                    </button>
                  </DialogClose>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-lg font-bold text-gray-700">초대장</div>
                </div>
                <div className="text-second">
                  FE 네트워킹 데이에 초대합니다.
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    className="flex items-center gap-2 rounded-2xl bg-gray-200 px-3 py-2 font-bold transition-transform focus:scale-95 active:scale-95"
                    onClick={() => setShowDetail((b) => !b)}
                  >
                    <div>
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>자세히 보기</div>
                  </button>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function CloseButton() {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-transform hover:scale-95 focus:scale-95 active:scale-75"
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
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M10.4854 10.4844L2.00007 1.99908"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
  );
}
