'use client';

import { TextareaHTMLAttributes, useEffect, useState } from 'react';

type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'defaultValue' | 'value'
> & {
  label?: string;
  onChange?: (value: string) => void;
  withAsterisk?: boolean;
  onDebounce?: (value: string) => void;
  debounceTime?: number;
  autoSize?: boolean;
  rightSection?: React.ReactNode;
  value?: string;
  defaultValue?: string;
};

const TextArea = ({
  label,
  onChange,
  withAsterisk = false,
  onDebounce,
  debounceTime = 200,
  autoSize = false,
  rightSection,
  value: propValue,
  defaultValue,
  ...props
}: TextAreaProps) => {
  const [value, setValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  if (defaultValue && value === '') {
    setValue(defaultValue);
    onChange?.(defaultValue);
  }

  useEffect(() => {
    if (propValue) {
      setValue(propValue);
    }
  }, [propValue]);

  const handleAutosize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoSize) {
      const element = e.currentTarget;
      element.style.height = 'inherit';
      element.style.height = `${element.scrollHeight + 16}px`;
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
      <div className='relative flex'>
        <textarea
          className={
            'h-16 bg-transparent border rounded shadow-sm cursor-text font-display dark:border-neutral-800 flex-grow resize-none' +
            (rightSection ? ' pr-9 py-2 pl-2' : ' p-2')
          }
          onChange={handleChange}
          {...props}
        />
        {rightSection && (
          <div className='absolute top-0 right-0 p-2'>{rightSection}</div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
