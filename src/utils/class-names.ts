import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const tw = (strings: TemplateStringsArray, ...values: ClassValue[]) =>
  twMerge(String.raw(strings, values.map(clsx)));

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
    .split(' ')
    .join(' ');
};
