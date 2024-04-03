export const range = (start: number, stop: number, step = 1) => Array.from(
  { length: Math.ceil((stop - start) / step) },
  (_value, index) => start + index * step,
);

