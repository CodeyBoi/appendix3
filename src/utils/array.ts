export const range = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_value, index) => start + index * step,
  );

export const initObject = <K extends string | number | symbol, V>(
  keys: K[],
  initialValue: V,
) =>
  keys.reduce(
    (acc, key) => {
      acc[key] = initialValue;
      return acc;
    },
    {} as Record<K, V>,
  );

export const sum = (list: number[]) => list.reduce((acc, n) => +n + acc, 0);
