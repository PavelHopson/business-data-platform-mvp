import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return Math.floor(num / 1000000) + ' 000 000';
  }
  if (num >= 1000) {
    return Math.floor(num / 1000) + '+';
  }
  return num.toString();
};
