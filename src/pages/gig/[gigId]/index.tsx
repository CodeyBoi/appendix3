import { Box, Space, Title, Center, Group, Select, Button } from '@mantine/core';
import React, { useMemo } from 'react';
import GigInfo from '../../../components/gig/info';
import Loading from '../../../components/loading';
import SignupList, { SignupInfo } from '../../../components/signup-list';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AlertError from '../../../components/alert-error';
import { useForm } from '@mantine/form';
import { IconUser } from '@tabler/icons';
import { CorpsSelectData } from '../../../components/multi-select-corpsii';
import { useRouter } from 'next/router';

const LIST_WIDTH = "800px";

const WhosComing = ({ isAdmin }: { isAdmin: boolean }) => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const gigId = parseInt(router.query.gigId as string ?? "0");

  const fetchSignups = async () => {
    const data = await fetch(`http://localhost:5160/api/gig/${gigId}/signups`);
    return data.json();
  }
  const { data: signups, status: signupsStatus } = useQuery<SignupInfo[]>([`signup`, gigId], fetchSignups, {
    enabled: !!gigId,
    cacheTime: 0,
  });

  const [queryName, setQueryName] = React.useState<string>("");

  const getCorpsii = async () => {
    const corpsiiFetch = await fetch(`http://localhost:5160/api/corps?name=${queryName}`);
    const corpsii = await corpsiiFetch.json();
    for (const corps of await corpsii) {
      corps.value = corps.id.toString();
      corps.label = `${corps.number ? '#' + corps.number : 'p.e.'} ${corps.firstName} ${corps.lastName}`;
    }
    return corpsii;
  }

  const { data: corpsiiSelect, status: corpsiiStatus } = useQuery<CorpsSelectData[]>([`corpsii`], getCorpsii);

  const postSignup = (signup: { corpsId: string, status: string }) => {
    return fetch(`http://localhost:5160/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gigId,
        corpsId: signup.corpsId,
        status: signup.status,
      })
    });
  }

  const { mutate: addSignup } = useMutation(postSignup, {
    onSuccess: () => {
      queryClient.invalidateQueries(['signup']);
      form.setValues({ corpsId: "" });
      setQueryName("");
    }
  })

  // Divide the list of corpsii into people who answered yes and people who answered maybe
  const { yesList, maybeList } = useMemo(() => signups?.reduce((acc, signup) => {
    if (signup.status === 'Ja') {
      acc.yesList.push(signup);
    } else if (signup.status === 'Kanske') {
      acc.maybeList.push(signup);
    }
    return acc;
  }, { yesList: [] as SignupInfo[], maybeList: [] as SignupInfo[] }) ?? { yesList: [], maybeList: [] }, [signups]);

  const form = useForm({
    initialValues: { corpsId: '' },
    validate: {
      corpsId: (value) => !!value ? null : 'Du måste välja ett corps  ',
    }
  });

  const loading = signupsStatus === 'loading' || corpsiiStatus === 'loading';

  if (signupsStatus === "error") {
    return <AlertError msg='Något gick fel vid hämtning av anmälningslistan.' />
  }

  return (
    <Center>
      <Box sx={{ minWidth: LIST_WIDTH, maxWidth: LIST_WIDTH, fontSize: "xs" }}>
        <Title order={1}>Anmälningar till:</Title>
        <GigInfo gigId={gigId} />
        {loading && <Box sx={{ maxWidth: "fit-content" }}><Loading msg='Laddar anmälningar...' /></Box>}
        {!loading &&
          <Box>
            {isAdmin &&
              <form onSubmit={form.onSubmit((values) => addSignup({ ...values, status: 'Ja' }))}>
                <Space h="sm" />
                <Group position='apart'>
                  <Select
                    placeholder='Lägg till anmälning...'
                    searchable
                    limit={30}
                    maxDropdownHeight={350}
                    onSearchChange={setQueryName}
                    data={corpsiiSelect?.filter((corps) => !signups?.some((signup) => signup.corpsId === corps.id))
                      .map(corps => {
                        return { label: corps.label, value: corps.value };
                      }) ?? []}
                    nothingFound="Inget corps hittades"
                    clearable
                    icon={<IconUser />}
                    {...form.getInputProps('corpsId')}
                  />
                  <Button type="submit">Lägg till anmälan</Button>
                </Group>
              </form>
            }
            <Space h="sm" />
            <Title order={3}>{yesList.length > 0 ? 'Dessa är anmälda:' : <i>Ingen är anmäld än. Kanske kan du bli den första?</i>}</Title>
            <SignupList signups={yesList} isAdmin={isAdmin} gigId={gigId} />
            <br />
            {maybeList.length > 0 && <Title order={3}>Dessa kanske kommer:</Title>}
            <SignupList signups={maybeList} isAdmin={isAdmin} gigId={gigId} />
          </Box>
        }
      </Box>
    </Center>
  );

}

export default WhosComing;
