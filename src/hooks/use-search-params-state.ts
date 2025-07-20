import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type RefreshMethod = 'replace' | 'push'

interface SearchParamsStateOptions {
  defaultValue?: string;
  refreshMethod?: RefreshMethod;
}

export const useSearchParamsState = (name: string, opts?: SearchParamsStateOptions) => {
  const { defaultValue, refreshMethod} = opts ?? {};
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
    const url = `${pathname}?${newSearchParams.toString()}`
    if (refreshMethod === 'replace') {
    router.replace(url);
      
    } else {
      router.push(url)
    }
    setValue(newValue);
  };

  return [value, setSearchParam] as const;
};
