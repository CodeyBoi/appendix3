import { LoadingOverlay } from "@mantine/core";
import React from "react";

interface FormLoadingOverlayProps {
  children: React.ReactNode;
  visible: boolean;
}

const FormLoadingOverlay = (props: FormLoadingOverlayProps) => {
  return (
    <div style={{ position: "relative", padding: "8px" }}>
      <LoadingOverlay radius="md" visible={props.visible} />
      {props.children}
    </div>
  );
}

export default FormLoadingOverlay;
