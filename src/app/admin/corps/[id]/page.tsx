import CorpsForm from 'components/corps-form';

const AdminCorps = ({ params }: { params: { id: string } }) => {
  const corpsId = params.id;
  const creatingCorps = corpsId === 'new';
  const title = creatingCorps ? 'Skapa corpsmedlem' : 'Uppdatera corpsmedlem';
  return (
    corpsId && (
      <div className='flex max-w-3xl flex-col gap-2'>
        <h2>{title}</h2>
        <CorpsForm corpsId={corpsId} />
      </div>
    )
  );
};

export default AdminCorps;
