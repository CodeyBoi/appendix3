import React from "react";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import { useForm } from "@mantine/form";
// import { Box, Button, Checkbox, Grid, Group, NumberInput, Select, SimpleGrid, Skeleton, Textarea, TextInput, Title } from "@mantine/core";
// import { DatePicker } from "@mantine/dates";
// import { IconCalendar, IconClock } from "@tabler/icons";
// import AlertError from "../../../components/alert-error";
// import MultiSelectCorpsii from "../../../components/multi-select-corpsii";
// import dayjs from "dayjs";
// import { useRouter } from "next/router.js";
// import { trpc } from "../../../utils/trpc.js";

// type FormValues = Omit<Gig, "id" | "signupStatus" | "date" | "signupStart" | "signupEnd"> & { hiddenFor: string[], date: Date, signupStart: Date, signupEnd: Date };

// const AdminGig = ({ newGig }: { newGig: boolean }) => {

//   // The gig is saved in location.state when the user navigates to this page from the admin gig list.
//   // This is to avoid having to fetch the gig from the server again.
//   // const location = useLocation();
//   // const { gig } = location.state as { gig: Gig } ?? {};

//   const router = useRouter();
//   const gigId = parseInt(router.query.gigId as string ?? "0");

//   const { data: gig, status: gigStatus } =
//     trpc.gig.getWithId.useQuery({ gigId }, { enabled: !newGig && !!gigId });

//   // const { data: gig, status: gigStatus } = useQuery<Gig>(
//   //   [`gig`, gigId],
//   //   async () => (await axios.get(`/api/gig/${gigId}`)).data,
//   //   { enabled: !newGig && !!gigId }
//   // );

//   const [error, setError] = React.useState<string>('');
//   const [loading, setLoading] = React.useState<boolean>(true);
//   const [submittning, setSubmitting] = React.useState<boolean>(false);

//   const form = useForm<FormValues>({
//     initialValues: {
//       title: '',
//       type: '',
//       description: '',
//       location: '',
//       date: '' as unknown as Date,
//       meetup: '',
//       gigStart: '',
//       signupStart: '' as unknown as Date,
//       signupEnd: '' as unknown as Date,
//       isPublic: false,
//       gigPoints: 1,
//       countsPositively: false,
//       prompt1: '',
//       prompt2: '',
//       hiddenFor: [],
//     },
//     validate: {
//       title: (value) => value.length > 0 ? null : 'Titel måste vara ifylld',
//       type: (value) => GIG_TYPES.includes(value) ? null : 'Välj en spelningstyp',
//       date: (value) => value !== '' as unknown as Date ? null : 'Datum måste vara ifyllt',
//       gigPoints: (value) => value >= 0 ? null : 'Spelpoäng måste vara lika med eller större än 0',
//     },
//   });

//   // If the user navigates to this page directly, fetch the gig from the server.
//   React.useEffect(() => {

//     // Check if user is creating a new gig or if the gig is already saved in location.state.
//     if (newGig || gig) {
//       setLoading(false);
//       return;
//     }
//     // If not, fetch the gig from the server.
//     fetch(`http://localhost:5160/api/gig/${gigId}`)
//       .then(res => res.json())
//       .then((gigData: Gig) => {
//         // Save the gig
//         form.setValues({
//           title: gigData.title ?? '',
//           type: gigData.type ?? '',
//           description: gigData.description ?? '',
//           location: gigData.location ?? '',
//           date: dayjs(gigData.date).toDate(),
//           meetup: gigData.meetup ?? '',
//           gigStart: gigData.gigStart ?? '',
//           signupStart: gigData.signupStart ? dayjs(gigData.signupStart).toDate() : '' as unknown as Date,
//           signupEnd: gigData.signupEnd ? dayjs(gigData.signupEnd).toDate() : '' as unknown as Date,
//           isPublic: gigData.isPublic ?? false,
//           gigPoints: gigData.gigPoints ?? 1,
//           countsPositively: gigData.countsPositively ?? false,
//           prompt1: gigData.prompt1 ?? '',
//           prompt2: gigData.prompt2 ?? '',
//           hiddenFor: [],
//         });
//       })
//       .then(() => axios.get(`/api/gig/${gigId}/hidden`))
//       .then(res => {
//         form.setFieldValue('hiddenFor', res.data.map((corpsId: number) => corpsId.toString()))
//         setLoading(false);
//       })
//       .catch(err => console.error(`Error when fetching gig ${gigId}: ${err}`));
//   }, [newGig, gig, gigId, form.setValues, form.setFieldValue]);

//   const handleSubmit = (values: any) => {
//     setSubmitting(true);
//     const url = 'http://localhost:5160' + newGig ? '/api/gig' : `/api/gig/${gigId}`;
//     const method = newGig ? 'POST' : 'PUT';

//     values.date = dayjs(values.date).format('YYYY-MM-DD');

//     if (values.signupStart) {
//       values.signupStart = dayjs(values.signupStart).format('YYYY-MM-DD');
//     } else {
//       values.signupStart = dayjs().format('YYYY-MM-DD');
//     }

//     if (values.signupEnd) {
//       values.signupEnd = dayjs(values.signupEnd).format('YYYY-MM-DD');
//     } else {
//       values.signupEnd = values.date;
//     }

//     fetch(url, {
//       method,
//       body: JSON.stringify(values),
//       headers: { 'Content-Type': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(() => {
//         window.location.href = '/';
//       })
//       .catch(err => {
//         console.error(err);
//         setError(`Något gick fel när spelningen skulle ${newGig ? 'skapas' : 'uppdateras'}.`);
//       });
//   }

//   return (
//     <Box sx={{ maxWidth: 700 }} mx="auto">
//       {error && <AlertError msg={error} />}
//       {newGig ? <Title order={2}>Skapa spelning</Title> : <Title order={2}>Uppdatera spelning</Title>}
//       {!error &&
//         <Skeleton visible={loading}>
//           <form onSubmit={form.onSubmit(handleSubmit)}>
//             <SimpleGrid cols={2} mb="md" >
//               <TextInput
//                 label="Titel"
//                 placeholder="Titel"
//                 withAsterisk
//                 spellCheck="false"
//                 {...form.getInputProps('title')}
//               />
//               <Select
//                 withAsterisk
//                 label="Spelningstyp"
//                 placeholder="Välj typ..."
//                 data={GIG_TYPES}
//                 {...form.getInputProps('type')}
//               />
//               <DatePicker
//                 withAsterisk
//                 label="Spelningsdatum"
//                 placeholder="Välj datum..."
//                 icon={<IconCalendar />}
//                 clearable="false"
//                 {...form.getInputProps('date')}
//               />
//               <NumberInput
//                 withAsterisk
//                 label="Spelpoäng"
//                 {...form.getInputProps('gigPoints')}
//               />
//             </SimpleGrid>
//             <Grid mb="xs">
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Plats"
//                   placeholder="Plats"
//                   {...form.getInputProps('location')}
//                 />
//               </Grid.Col>
//               <Grid.Col span={3}>
//                 <TextInput
//                   icon={<IconClock />}
//                   label="Samlingstid"
//                   placeholder="Samlingstid"
//                   spellCheck="false"
//                   clearable="true"
//                   {...form.getInputProps('meetup')}
//                 />
//               </Grid.Col>
//               <Grid.Col span={3}>
//                 <TextInput
//                   icon={<IconClock />}
//                   label="Spelningstart"
//                   placeholder="Spelningstart"
//                   spellCheck="false"
//                   clearable="true"
//                   {...form.getInputProps('gigStart')}
//                 />
//               </Grid.Col>
//             </Grid>
//             <Textarea
//               mb="md"
//               autosize
//               label="Beskrivning"
//               placeholder="Beskrivning"
//               {...form.getInputProps('description')}
//             />
//             <MultiSelectCorpsii
//               mb="md"
//               maxDropdownHeight={260}
//               label="Dölj spelning"
//               disabled={form.values.isPublic}
//               description="Spelningsanmälan kommer inte att synas för dessa corps"
//               placeholder="Välj corps..."
//               {...form.getInputProps('hiddenFor')}
//             />
//             <SimpleGrid cols={2} mb="md" >
//               <DatePicker
//                 label="Anmälningsstart"
//                 description="Lämna tom för att tillåta anmälan omedelbart"
//                 placeholder="Välj datum..."
//                 icon={<IconCalendar />}
//                 clearable="true"
//                 {...form.getInputProps('signupStart')}
//               />
//               <DatePicker
//                 label="Anmälningsstopp"
//                 description="Lämna tom för att tillåta anmälan tills spelningen börjar"
//                 placeholder="Välj datum..."
//                 icon={<IconCalendar />}
//                 clearable="true"
//                 {...form.getInputProps('signupEnd')}
//               />
//               <TextInput
//                 label="Kryssruta 1"
//                 placeholder="Kryssruta 1"
//                 description="Lämna tom för att inte visa kryssruta"
//                 {...form.getInputProps('prompt1')}
//               />
//               <TextInput
//                 label="Kryssruta 2"
//                 placeholder="Kryssruta 2"
//                 description="Lämna tom för att inte visa kryssruta"
//                 {...form.getInputProps('prompt2')}
//               />
//             </SimpleGrid>
//             <Group position="apart">
//               <Group position="left">
//                 <Checkbox
//                   label="Allmän spelning?"
//                   radius="xl"
//                   {...form.getInputProps('isPublic', { type: "checkbox" })}
//                 />
//                 <Checkbox
//                   label="Räknas positivt?"
//                   radius="xl"
//                   {...form.getInputProps('countsPositively', { type: "checkbox" })}
//                 />
//               </Group>
//               <Group position="right">
//                 {!newGig &&
//                   <Button
//                     variant="outline"
//                     compact
//                     uppercase
//                     onClick={() => {
//                       if (window.confirm("Detta kommer att radera spelningen och går inte att ångra. Är du säker?")) {
//                         // TODO: Delete gig
//                         router.push('/');
//                       }
//                     }}>
//                     Radera spelning
//                   </Button>
//                 }
//                 <Button type="submit" loading={submittning}>
//                   {newGig ? 'Skapa spelning' : 'Spara ändringar'}
//                 </Button>
//               </Group>
//             </Group>
//           </form>
//         </Skeleton>
//       }
//     </Box>
//   );
// }

// export default AdminGig;
