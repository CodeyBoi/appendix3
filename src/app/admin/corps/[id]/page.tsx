import CorpsForm from 'components/corps-form';
import CorpsFormSelect from './form-select';

const AdminCorps = ({ params }: { params: { id: string } }) => {
  const corpsId = params.id;
  const creatingCorps = corpsId === 'new';
  const title = creatingCorps ? 'Skapa corpsmedlem' : 'Uppdatera corpsmedlem:';
  return (
    corpsId && (
      <div className='flex max-w-3xl flex-col gap-2'>
        <div className='flex items-center gap-4'>
          <h2>{title}</h2>
          {!creatingCorps && <CorpsFormSelect />}
        </div>
        <CorpsForm corpsId={corpsId} />
      </div>
    )
  );
};

export default AdminCorps;
