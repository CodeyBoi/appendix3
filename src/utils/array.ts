export const range = (startOrStop: number, stop?: number, step = 1) => {
  const [begin, end] =
    stop !== undefined ? [startOrStop, stop] : [0, startOrStop];
  return Array.from(
    { length: Math.ceil((end - begin) / step) },
    (_value, index) => begin + index * step,
  );
};

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
