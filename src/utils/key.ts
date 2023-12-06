export const getKeyCode = (event: KeyboardEvent) => {
  const { altKey, ctrlKey, shiftKey } = event;
  const modifiers = [];
  if (altKey && event.key !== 'Alt') modifiers.push('alt');
  if (ctrlKey && event.key !== 'Control') modifiers.push('ctrl');
  if (shiftKey && event.key !== 'Shift') modifiers.push('shift');
  const keyCode =
    modifiers.length > 0 ? `${modifiers.join('+')}+${event.key}` : event.key;
  return keyCode.toLowerCase();
};
