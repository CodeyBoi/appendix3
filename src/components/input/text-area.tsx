'use client';

import { TextareaHTMLAttributes, useCallback, useState } from 'react';
import { cn } from 'utils/class-names';

type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'defaultValue' | 'value' | 'placeholder'
> & {
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  withAsterisk?: boolean;
  autoSize?: boolean;
  rightSection?: React.ReactNode;
  value?: string;
  defaultValue?: string;
};

const TextArea = ({
  label,
  onChange,
  withAsterisk = false,
  autoSize = true,
  rightSection,
  onFocus,
  onBlur,
  value,
  ...props
}: TextAreaProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.currentTarget.value);
    },
    [autoSize, onChange],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const floatingLabel = label;
  const height = (Math.max(2, value?.split('\n').length ?? 0) + 1) * 24;

  return (
    <div className='mt-2 flex flex-col'>
      <div className='relative flex'>
        <textarea
          className={cn(
            'grow cursor-text resize-none rounded border bg-transparent py-2 font-display shadow-sm dark:border-neutral-800 dark:text-darkText',
            rightSection ? 'pl-2 pr-9' : 'px-2',
          )}
          style={{ height: autoSize ? `${height}px` : undefined }}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...props}
        />
        <div className='pointer-events-none absolute left-2.5 top-2 flex'>
          {floatingLabel && (
            <label
              className={cn(
                'flex origin-left cursor-text gap-1 bg-white px-1 text-sm text-gray-500 transition-transform duration-100 dark:bg-darkBg',
                (focused || value !== '') && '-translate-y-4',
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
