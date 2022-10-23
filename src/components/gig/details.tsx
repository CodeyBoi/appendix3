import React from "react";
import { Text } from "@mantine/core";

interface GigDetailsProps {
  description?: string;
}

const GigDetails = ({ description }: GigDetailsProps) => {

  return (
      <Text>{description}</Text>
  );
}

export default GigDetails;
