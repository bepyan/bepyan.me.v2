'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '~/libs/utils';

export function DynamicMail() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState('idle');

  function submit() {
    // setFormState('loading');
    // setTimeout(() => {
    setFormState('success');
    // }, 1500);

    // setTimeout(() => {
    //   setOpen(false);
    // }, 3300);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter' &&
        open &&
        formState === 'idle'
      ) {
        submit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, formState]);

  return (
    <div className="flex h-[200px] items-center justify-center font-serif">
      <motion.button
        layoutId="wrapper"
        onClick={() => {
          setOpen(true);
          setFormState('idle');
        }}
        key="button"
        className="flex w-[100px] items-center justify-center gap-1 rounded-lg border border-border bg-page px-3 py-2 focus:outline-none"
      >
        <motion.span layoutId="title" className="font-bold text-heading">
          초대장
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.div
            layoutId="wrapper"
            className="absolute h-[180px] w-[300px] overflow-hidden rounded-xl border bg-gray-100 p-2"
          >
            <motion.span
              className={cn(
                'absolute left-5 top-4 z-10 text-lg font-bold text-heading',
                formState === 'success' && '!opacity-0',
              )}
              layoutId="title"
            >
              초대장
            </motion.span>
            <AnimatePresence mode="popLayout">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ y: -32, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  className="flex h-full flex-col items-center justify-center"
                >
                  <p className="font-bold text-heading">확인 되었습니다.</p>
                  <p>초대에 응해주셔서 감사합니다.</p>
                </motion.div>
              ) : (
                <motion.div
                  exit={{ y: 8, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  key="form"
                  className="relative h-full overflow-hidden rounded-lg bg-page pt-10"
                >
                  <svg
                    id="dotted-line"
                    className="absolute left-0 right-0 top-10 stroke-border"
                    width="300"
                    height="2"
                    viewBox="0 0 300 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 1H300" strokeDasharray="4 4" />
                  </svg>
                  <div className="p-3">
                    <div>FE 네트워킹 데이에 초대합니다.</div>
                    <div>24.06.03 17시 - 세미나홀</div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        className="transition-colors hover:text-heading focus:text-heading focus:outline-none"
                        onClick={() => setOpen(false)}
                      >
                        취소
                      </button>
                      <button
                        className="transition-colors hover:text-heading focus:text-heading focus:outline-none"
                        onClick={submit}
                      >
                        참석합니다.
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
