export type ClassProperties<C> = {
  [Key in keyof C as C[Key] extends (...args: unknown[]) => unknown
    ? never
    : Key]: C[Key];
};
