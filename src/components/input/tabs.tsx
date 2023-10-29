'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import { cn } from '../../utils/class-names';

type TabsProps = {
  options: { label: string; value: string }[];
  name?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
};

const translateX = ['translate-x-0', 'translate-x-36', 'translate-x-72'];

const Tabs = ({
  defaultTab,
  onTabChange,
  options,
  name = 'tab',
}: TabsProps) => {
  const [tab, setTab] = useSearchParamsState(name, defaultTab);
  const tabIndex = options.findIndex((o) => o.value === tab);
  return (
    <div className='relative flex flex-nowrap border-b-2 border-b-neutral-300 px-2 dark:border-b-neutral-700'>
      <div
        className={cn(
          'absolute my-0.5 h-full w-36 border-b-2 border-b-red-600 transition-transform duration-200',
          translateX[tabIndex],
        )}
      />
      {options.map((o) => (
        <div
          key={o.value}
          className='h-9 w-36 cursor-pointer whitespace-nowrap px-4 py-2 text-center hover:bg-red-300/5'
          onClick={() => {
            setTab(o.value);
            onTabChange?.(o.value);
          }}
        >
          {o.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
