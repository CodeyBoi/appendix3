import { useRouter } from 'next/router';
import CorpsForm from '../../../../components/corps-form';
import SelectCorps from '../../../../components/select-corps';

const AdminCorps = () => {
  const router = useRouter();
  const corpsId = router.query.id as string;
  const creatingCorps = corpsId === 'new';
  const title = creatingCorps ? 'Skapa corpsmedlem' : 'Uppdatera corpsmedlem:';
  return (
    <>
      {corpsId && (
        <div className='flex flex-col max-w-3xl gap-2'>
          <div className='flex items-center gap-4'>
            <h2>{title}</h2>
            {!creatingCorps && (
              <SelectCorps
                placeholder='Välj corps...'
                onChange={(id) => router.push(`/admin/corps/${id}`)}
                defaultValue={corpsId}
              />
            )}
          </div>
          <CorpsForm corpsId={corpsId} />
        </div>
      )}
    </>
  );
};

export default AdminCorps;
