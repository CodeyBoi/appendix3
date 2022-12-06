import React from "react";
import { Loader, Center } from "@mantine/core";

interface LoadingProps {
  msg?: string;
}

const Loading = ({ msg }: LoadingProps) => {
  return (
    <div style={{ width: "fit-content", padding: "10px" }}>
      <p style={{ marginTop: 0 }}>{msg}</p>
      <Center>
        <Loader m="auto" />
      </Center>
    </div>
  );
}

export default Loading;
