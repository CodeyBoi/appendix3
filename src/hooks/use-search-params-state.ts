import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useSearchParamsState = (name: string, defaultValue?: string) => {
  const [value, setValue] = useState<string>(defaultValue ?? '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams?.get(name);
  const pathname = usePathname();
  useEffect(() => {
    if (searchParam) {
      setValue(searchParam);
    } else if (defaultValue) {
      setValue(defaultValue);
    }
  }, [searchParam, defaultValue]);

  const setSearchParam = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
    if (newValue === '') {
      newSearchParams.delete(name);
    } else {
      newSearchParams.set(name, newValue);
    }
    router.replace(`${pathname}?${newSearchParams.toString()}`);
    setValue(newValue);
  };

  return [value, setSearchParam] as const;
};
