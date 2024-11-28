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
      const handleAutosize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoSize) {
          const element = e.currentTarget;
          element.style.height = 'inherit';
          element.style.height = `${element.scrollHeight + 8}px`;
        }
      };
      onChange?.(e.currentTarget.value);
      if (autoSize) {
        handleAutosize(e);
      }
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

  return (
    <div className='flex flex-col'>
      <div className='relative flex '>
        <textarea
          className={cn(
            'h-50 grow cursor-text resize-none rounded border bg-transparent pb-1 pt-5 font-display shadow-sm dark:border-neutral-800',
            rightSection ? ' pl-2 pr-9' : ' px-2',
          )}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
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
