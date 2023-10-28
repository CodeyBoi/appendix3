'use client';

import TextInput from 'components/input/text-input';
import { useRouter } from 'next/navigation';

const CorpsFormSelect = () => {
  const router = useRouter();
  return (
    <TextInput onChange={(value) => router.push(`/admin/corps/${value}`)} />
  );
};

export default CorpsFormSelect;
