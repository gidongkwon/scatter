import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimTrailingZero(
  value: number,
  fractionDigits: number,
): string {
  return String(Number.parseFloat(value.toFixed(fractionDigits)));
}
