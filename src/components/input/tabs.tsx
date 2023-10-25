'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';

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
    <div className='relative flex px-2 border-b-2 flex-nowrap border-b-neutral-300'>
      <div
        className={`absolute w-36 h-full my-0.5 duration-200 transition-transform border-b-2 border-b-red-600 ${translateX[tabIndex]}`}
      />
      {options.map((o) => (
        <div
          key={o.value}
          className='px-4 py-2 text-center cursor-pointer h-9 w-36 hover:bg-red-300/5 whitespace-nowrap'
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
