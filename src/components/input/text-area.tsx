'use client';

import { TextareaHTMLAttributes, useEffect, useState } from 'react';
import { cn } from 'utils/class-names';

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
  autoSize = true,
  rightSection,
  placeholder,
  onFocus,
  onBlur,
  value: propValue,
  defaultValue,
  ...props
}: TextAreaProps) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
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
      element.style.height = `${element.scrollHeight + 8}px`;
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
    setValue(e.currentTarget.value);
    onChange?.(e.currentTarget.value);
    if (autoSize) {
      handleAutosize(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const floatingLabel = label ?? placeholder;

  return (
    <div className='flex flex-col'>
      <div className='relative flex '>
        <textarea
          className={cn(
            'h-20 flex-grow cursor-text resize-none rounded border bg-transparent pb-1 pt-5 font-display shadow-sm dark:border-neutral-800',
            rightSection ? ' pl-2 pr-9' : ' px-2',
          )}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <div className='pointer-events-none absolute left-0 flex pl-2 pt-3'>
          {floatingLabel && (
            <label
              className={cn(
                'flex origin-left cursor-text gap-1 transition-transform duration-100',
                focused || value !== ''
                  ? '-translate-y-2.5 scale-75'
                  : 'text-gray-500',
              )}
            >
              {label}
              {withAsterisk && <span className='text-red-600'>*</span>}
            </label>
          )}
        </div>
        {rightSection && (
          <div className='absolute right-0 top-0 p-2'>{rightSection}</div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
