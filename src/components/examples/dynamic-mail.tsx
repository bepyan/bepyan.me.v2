'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import Spinner from '~/components/ui/spinner';
import { cn } from '~/libs/utils';

type FormState = 'idle' | 'loading' | 'success';

export function DynamicMail() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    if (formState === 'loading') return;
    setOpen(false);
  });

  function submit() {
    if (formState === 'success') return;

    setFormState('loading');

    setTimeout(() => {
      setFormState('success');
    }, 1500);

    setTimeout(() => {
      setOpen(false);
    }, 3300);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (formState === 'loading') return;
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, formState]);

  return (
    <div className="flex h-50 items-center justify-center font-serif">
      <motion.button
        layoutId="wrapper"
        onClick={() => {
          setOpen(true);
          setFormState('idle');
        }}
        key="button"
        className="border-border bg-page flex w-25 items-center justify-center gap-1 rounded-lg border px-3 py-2 focus:outline-hidden"
      >
        <motion.span layoutId="title" className="text-heading font-bold">
          초대장
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={ref}
            layoutId="wrapper"
            className="absolute h-45 w-75 overflow-hidden rounded-xl border bg-gray-100 p-2"
          >
            <motion.span
              className={cn(
                'text-heading absolute top-4 left-5 z-10 text-lg font-bold',
                formState === 'success' && 'opacity-0!',
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
                  <p className="text-heading font-bold">확인 되었습니다.</p>
                  <p>초대에 응해주셔서 감사합니다.</p>
                </motion.div>
              ) : (
                <motion.div
                  exit={{ y: 8, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  key="form"
                  className="bg-page relative h-full overflow-hidden rounded-lg pt-10"
                >
                  <DotLine className="stroke-border absolute top-10 right-0 left-0" />
                  <div className="p-3">
                    <div>FE 네트워킹 데이에 초대합니다.</div>
                    <div>24.06.03 17시 - 세미나홀</div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        className="hover:text-heading focus:text-heading transition-colors focus:outline-hidden"
                        onClick={() => setOpen(false)}
                      >
                        취소
                      </button>
                      <button
                        className="hover:text-heading focus:text-heading h-7.5 w-20 overflow-hidden transition-colors focus:outline-hidden"
                        onClick={submit}
                        disabled={formState === 'loading'}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            transition={{
                              type: 'spring',
                              duration: 0.3,
                              bounce: 0,
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            key={formState}
                            className="inline-flex h-full w-full items-center justify-center"
                          >
                            {formState === 'idle' ? (
                              '참석합니다'
                            ) : (
                              <Spinner size={16} />
                            )}
                          </motion.span>
                        </AnimatePresence>
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

function DotLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="300"
      height="2"
      viewBox="0 0 300 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 1H300" strokeDasharray="4 4" />
    </svg>
  );
}
