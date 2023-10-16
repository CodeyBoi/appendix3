import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../../../components/button';
import SelectCorps from '../../../components/select-corps';

const ViewCorps = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-4'>
        <h2>Uppdatera corpsmedlem:</h2>
        <SelectCorps
          placeholder='Välj corps...'
          onChange={(id) => router.push(`/admin/corps/${id}`)}
        />
        <Link href='/admin/corps/new'>
          <Button>Skapa corps</Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewCorps;
