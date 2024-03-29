'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Button from 'components/input/button';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from 'trpc/react';
import { detailedName } from 'utils/corps';
import { lang } from 'utils/language';

type Role = {
  id: number;
  name: string;
  corpsii: {
    id: string;
    firstName: string;
    lastName: string;
    number: number | null;
    nickName: string | null;
  }[];
};

type AdminRoleHolderListProps = {
  role: Role;
};

const AdminRoleHolderList = ({ role }: AdminRoleHolderListProps) => {
  const router = useRouter();
  const [corpsId, setCorpsId] = useState<string | null>(null);
  const addRole = api.corps.addRole.useMutation({
    onSuccess: router.refresh,
  });
  const removeRole = api.corps.removeRole.useMutation({
    onSuccess: router.refresh,
  });

  return (
    <div className='flex max-w-md flex-col'>
      {role.corpsii.map((corps) => (
        <div key={corps.id}>
          <div className='flex gap-4'>
            <h5 className='grow'>{detailedName(corps)}</h5>
            <ActionIcon
              variant='subtle'
              onClick={async () => {
                if (
                  !confirm(
                    'Är du säker på att du vill ta bort behörighetsroll från corps?',
                  )
                ) {
                  return;
                }
                await removeRole.mutateAsync({
                  corpsId: corps.id,
                  roleId: role.id,
                });
              }}
            >
              <IconTrash />
            </ActionIcon>
          </div>
        </div>
      ))}
      <form
        className='flex items-end gap-4'
        onSubmit={async (e) => {
          e.preventDefault();
          if (!corpsId) {
            return;
          }
          await addRole.mutateAsync({
            corpsId,
            roleId: role.id,
          });
        }}
      >
        <SelectCorps
          label={lang('Lägg till corps', 'Add corps')}
          className='grow'
          onChange={(p) => setCorpsId(p)}
        />
        <Button type='submit'>{lang('Lägg till', 'Add')}</Button>
      </form>
    </div>
  );
};

export default AdminRoleHolderList;
