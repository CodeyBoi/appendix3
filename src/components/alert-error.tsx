import React from "react";
import { IconAlertTriangle } from "@tabler/icons";
import { Alert } from "@mantine/core";

const AlertError = ({ title = "Något gick fel!", withCloseButton, msg }: { title?: string, withCloseButton?: boolean, msg: string }) => {
  return (
    <Alert
      withCloseButton={withCloseButton}
      color="red"
      icon={<IconAlertTriangle />}
      title={title}
    >
      {msg}
    </Alert>
  );
}

export default AlertError;
