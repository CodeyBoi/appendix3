'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import { cn } from '../../utils/class-names';

type TabsProps = {
  options: ({ label: React.ReactNode; value: string } | string)[];
  name?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
};

const Tabs = ({
  defaultTab,
  onTabChange,
  options: optionsProp,
  name = 'tab',
}: TabsProps) => {
  const [tab, setTab] = useSearchParamsState(name, defaultTab);
  const options = optionsProp.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );
  return (
    <div className='flex flex-nowrap overflow-x-auto overflow-y-hidden px-2'>
      {options.map((o) => (
        <div
          key={o.value}
          className={cn(
            'h-9 w-36 whitespace-nowrap border-b-2 px-4 py-2 text-center',
            o.value === tab
              ? 'border-b-red-600'
              : 'cursor-pointer border-b-neutral-300 hover:bg-red-300/5 dark:border-b-neutral-700',
          )}
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
