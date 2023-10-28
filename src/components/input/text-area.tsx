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
          className={
            'h-20 pt-5 pb-1 bg-transparent border rounded shadow-sm cursor-text font-display dark:border-neutral-800 flex-grow resize-none' +
            (rightSection ? ' pr-9 pl-2' : ' px-2')
          }
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <div className='absolute left-0 flex pt-3 pl-2 pointer-events-none'>
          {floatingLabel && (
            <label
              className={
                'flex gap-1 cursor-text transition-transform origin-left duration-100' +
                (focused || value !== ''
                  ? ' ' + 'scale-75 -translate-y-2.5'
                  : ' ' + 'text-gray-500')
              }
            >
              {label}
              {withAsterisk && <span className='text-red-600'>*</span>}
            </label>
          )}
        </div>
        {rightSection && (
          <div className='absolute top-0 right-0 p-2'>{rightSection}</div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
