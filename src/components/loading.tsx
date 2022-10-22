import React from "react";
import { Loader, Center, Text, Stack } from "@mantine/core";

interface LoadingProps {
  msg?: string;
}

const Loading = ({ msg }: LoadingProps) => {
  return (
    <Center sx={{ width: "100%", height: "100%" }}>
      <Stack>
        <Text>{msg}</Text>
        <Loader m="auto" />
      </Stack>
    </Center>
  );
}

export default Loading;
