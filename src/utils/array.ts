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

type MapValue<A, B, T> = undefined extends T ? B : A;

export const toMap = <T, V>(
  items: T[],
  keyName: keyof T,
  transform?: (arg0: T) => V,
) => {
  return items.reduce((acc, item) => {
    const value = transform ? transform(item) : item;
    acc.set(item[keyName], value as MapValue<T, V, typeof transform>);
    return acc;
  }, new Map<T[typeof keyName], MapValue<T, V, typeof transform>>());
};

export const intersection = <T>(a: T[], b: T[]) => {
  const bSet = new Set(b);
  const c = [];
  for (const v of a) {
    if (bSet.has(v)) {
      c.push(v);
    }
  }
  return c;
};
