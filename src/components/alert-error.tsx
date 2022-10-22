import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert } from "@mantine/core";

const AlertError = ({ title, withCloseButton, msg }: { title?: string, withCloseButton?: boolean, msg: string }) => {
  return (
      <Alert
        withCloseButton={withCloseButton}
        color="red"
        icon={<ExclamationTriangleIcon />}
        title={title}
      >
        {msg}
      </Alert>
  );
}

export default AlertError;
