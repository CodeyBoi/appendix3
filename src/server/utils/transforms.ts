export const emptyToNull = (str: string | null) => {
  const trimmed = str?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
};
