import { Gig } from '@prisma/client';
import { IconUsers, IconEdit, IconApple } from '@tabler/icons-react';
import Button from 'components/input/button';
import Divider from 'components/divider';
import { lang } from 'utils/language';
import Restricted from 'components/restricted/server';

interface GigMenuContentProps {
  gig: Gig & { type: { name: string } };
}

const GigMenuContent = ({ gig }: GigMenuContentProps) => {
  return (
    <div className='flex flex-col'>
      <Button
        href={`/gig/${gig.id}`}
        fullWidth
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
      >
        <IconUsers />
        {lang('Se anmälningar', 'View signups')}
      </Button>
      <Restricted permissions={['manageGigs', 'viewFoodPrefs']}>
        <div className='-mx-1'>
          <Divider />
        </div>
        <div className='px-3 py-1 text-xs text-gray-500'>Admin</div>
      </Restricted>
      <Restricted permissions='manageGigs'>
        <Button
          fullWidth
          href={`/admin/gig/${gig.id}`}
          className='flex justify-start hover:bg-red-600/10'
          color='transparent'
        >
          <IconEdit />
          {lang('Redigera', 'Edit')}
        </Button>
      </Restricted>
      <Restricted permissions='viewFoodPrefs'>
        <Button
          fullWidth
          href={`/admin/gig/${gig.id}/info`}
          className='flex justify-start hover:bg-red-600/10'
          color='transparent'
        >
          <IconApple />
          {lang('Matpreferenser', 'Food preferences')}
        </Button>
      </Restricted>
    </div>
  );
};

export default GigMenuContent;
