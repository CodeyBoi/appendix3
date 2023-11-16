export const hashString = (input: string) => {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) + hash + char;
  }
  return Math.abs(hash);
};
