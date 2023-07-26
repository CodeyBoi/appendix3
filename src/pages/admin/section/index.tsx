import { Group, Stack, Title } from '@mantine/core';
import React from 'react';
import { trpc } from '../../../utils/trpc';
import Loading from '../../../components/loading';
import SelectCorps from '../../../components/select-corps';

const AdminSection = () => {
  const utils = trpc.useContext();
  const { data: sections, isInitialLoading } =
    trpc.section.getSectionLeaders.useQuery();

  const setSectionLeader = trpc.section.setSectionLeader.useMutation({
    onSuccess: () => utils.section.getSectionLeaders.invalidate(),
  });

  return (
    <Stack>
      <Title order={2}>Sektioner</Title>
      {isInitialLoading && <Loading msg='Hämtar sektioner...' />}
      {sections && (
        <Stack>
          {sections.map((section) => (
            <Group key={section.id}>
              <Title order={4}>{section.name}</Title>
              <SelectCorps
                onChange={(value) => {
                  if (!value) return;
                  setSectionLeader.mutate({
                    sectionId: section.id,
                    corpsId: value,
                  });
                }}
                defaultValue={section.leader?.id}
                placeholder='Välj sektionsledare'
              />
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default AdminSection;
