'use client';

import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { cn } from 'utils/class-names';

type WheelProps = {
  options: { label: React.ReactNode; value: string; color?: string }[];
  onChange?: (value: string) => void;
  value?: string;
};

const COLORS = [
  '#ff0000',
  '#ff8000',
  '#80ff00',
  '#00ff00',
  '#00ff80',
  '#00ffff',
  '#0080ff',
  '#0000ff',
  '#8000ff',
  '#ff00ff',
  '#ff0080',
];

const getRotation = (value: string, options: WheelProps['options']) => {
  const valueIndex = options.findIndex((o) => o.value === value);
  return valueIndex !== -1
    ? (360 - (valueIndex * 360 + 270)) / options.length
    : null;
};

const Wheel = ({ options, onChange, value }: WheelProps) => {
  const [finalRotation, setFinalRotation] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState(true);
  const [transition, setTransition] = useState('transition-all duration-[8s]');
  const isSpinning = finalRotation !== null;

  const router = useRouter();

  useEffect(() => {
    if (value) {
      const rotation = getRotation(value, options);
      setTransition('transition-none');
      setFinalRotation(rotation);
    }
  }, [value, options]);

  const wheelStyle = {
    background: `conic-gradient(${options
      .map(
        (option, i) =>
          `${option.color ?? COLORS[i % COLORS.length]} ${
            (i * 360) / options.length
          }deg ${((i + 1) * 360) / options.length}deg`,
      )
      .join(', ')})`,
    rotate: `${finalRotation ?? 0}deg`,
  };

  const handleClick = () => {
    const newValueIndex = Math.floor(Math.random() * options.length);
    const newValue = options[newValueIndex]?.value;
    if (!newValue) {
      return;
    }
    const rotation = (getRotation(newValue, options) ?? 0) + 360 * 60;
    setTransition('transition-all duration-[8s]');
    setFinalRotation(rotation);
    setShowSubmit(false);
    setTimeout(() => {
      if (newValue && onChange) {
        onChange(newValue);
      }
      setShowSubmit(true);
      router.refresh();
    }, 8000);
  };

  return (
    <div className='relative flex h-52 w-52 items-center justify-center rounded-full'>
      {showSubmit && (
        <div
          className='absolute z-10 flex h-12 w-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-white text-center text-xs font-bold uppercase'
          onClick={handleClick}
        >
          anmäl
        </div>
      )}
      <div
        className={cn(
          'relative flex h-52 w-52 transform-gpu items-center justify-center rounded-full ease-in-out',
          transition,
          !isSpinning && 'picker-wheel-idle',
        )}
        style={wheelStyle}
      >
        {options.map((option, i) => (
          <div
            className='fixed w-1/2 translate-x-1/2 pl-5 text-center'
            key={option.value}
            style={{
              rotate: `${
                (i * 360) / options.length - 90 + 360 / 2 / options.length
              }deg`,
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
      <div className='absolute z-10 flex translate-x-28 items-center justify-center text-red-600'>
        <IconChevronLeft />
      </div>
    </div>
  );
};

export default Wheel;
