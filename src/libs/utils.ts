import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV;

/** 연도별로 묶어 최신 연도부터 반환 */
export function groupByYear<T extends { date: string | Date | number }>(
  list: T[],
): [year: string, items: T[]][] {
  const groups = list.reduce<{ [year: string]: T[] }>((ac, v) => {
    const year = new Date(v.date).getFullYear();
    return { ...ac, [year]: [...(ac[year] ?? []), v] };
  }, {});

  return Object.entries(groups).sort(([yearA], [yearB]) => +yearB - +yearA);
}
