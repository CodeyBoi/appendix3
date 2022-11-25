import { Stack, Title, Center, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import AccountPreferences from "../../components/account/preferences";
import CorpsStats from "../../components/account/stats";
import { trpc } from "../../utils/trpc";

const initialValues = {
  firstName: "",
  lastName: "",
  vegetarian: false,
  vegan: false,
  glutenIntolerant: false,
  lactoseIntolerant: false,
  drinksAlcohol: false,
  otherFoodRestrictions: "",
  email: "",
  mainInstrument: "",
  otherInstruments: [] as string[],
};

type FormValues = typeof initialValues;

const Account = () => {
  const { data: corps } = trpc.corps.getCorps.useQuery();
  const corpsName =
    corps?.number !== null
      ? "#" + corps?.number.toString()
      : "p.e. " + corps?.lastName;

  return (
    <Center>
      <Stack sx={{ width: "70%" }}>
        <Title>{`Välkommen, ${corpsName}!`}</Title>
        <Grid>
          <Grid.Col span={6}>
            <CorpsStats />
          </Grid.Col>
          <Grid.Col span={6}>
            <AccountPreferences />
          </Grid.Col>
        </Grid>
      </Stack>
    </Center>
  );
};

export default Account;
