import Loading from '../../../components/loading';
import SelectCorps from '../../../components/select-corps';
import { trpc } from '../../../utils/trpc';

const AdminSection = () => {
  const utils = trpc.useContext();
  const { data: sections, isInitialLoading } =
    trpc.section.getSectionLeaders.useQuery();

  const setSectionLeader = trpc.section.setSectionLeader.useMutation({
    onSuccess: () => utils.section.getSectionLeaders.invalidate(),
  });

  return (
    <div className='flex flex-col gap-2'>
      <h2>Sektioner</h2>
      {isInitialLoading && <Loading msg='Hämtar sektioner...' />}
      {sections &&
        sections.map((section) => (
          <div className='flex flex-col' key={section.id}>
            <h4>{section.name}</h4>
            <div className='max-w-xs'>
              <SelectCorps
                onChange={(value) => {
                  if (!value) return;
                  setSectionLeader.mutate({
                    sectionId: section.id,
                    corpsId: value,
                  });
                }}
                defaultValue={section.leader?.id}
                placeholder='Välj sektionsledare...'
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminSection;
