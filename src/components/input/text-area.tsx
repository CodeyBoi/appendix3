'use client';

import { TextareaHTMLAttributes, useState } from 'react';

type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> & {
  label?: string;
  onChange?: (value: string) => void;
  withAsterisk?: boolean;
  onDebounce?: (value: string) => void;
  debounceTime?: number;
  autoSize?: boolean;
};

const TextArea = ({
  label,
  onChange,
  withAsterisk = false,
  onDebounce,
  debounceTime = 200,
  autoSize = false,
  ...props
}: TextAreaProps) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleAutosize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoSize) {
      const element = e.currentTarget;
      element.style.height = 'inherit';
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  const handleDebounce = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const value = e.currentTarget.value;
    const timeout = setTimeout(() => {
      onDebounce?.(value);
    }, debounceTime);
    setTimeoutId(timeout);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onDebounce) {
      handleDebounce(e);
    }
    onChange?.(e.currentTarget.value);
    if (autoSize) {
      handleAutosize(e);
    }
  };

  return (
    <div className='flex flex-col'>
      {label && (
        <label className='flex gap-1'>
          {label}
          {withAsterisk && <span className='text-red-600'>*</span>}
        </label>
      )}
      <textarea
        className='h-12 p-2 bg-transparent border rounded shadow-sm cursor-text font-display dark:border-neutral-800'
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default TextArea;
