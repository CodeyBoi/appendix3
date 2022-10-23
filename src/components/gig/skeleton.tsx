import { Group, Skeleton, Stack } from "@mantine/core";
import React from "react";

const GigSkeleton = () => {

  const titleWidth = Math.floor(Math.random() * 120) + 170;
  const typeWidth = Math.floor(Math.random() * 70) + 70;
  const meetupWidth = 76;
  const timeWidth = 83;

  return (
    <Group position="left">
      <Skeleton height={50} width={40} />
      <Stack spacing={6}>
        <Skeleton height={20} width={titleWidth} />
        <Skeleton height={10} width={typeWidth} />
        <Skeleton height={10} width={meetupWidth} />
        <Skeleton height={10} width={timeWidth} />
      </Stack>
    </Group>
  );
}

export default GigSkeleton;