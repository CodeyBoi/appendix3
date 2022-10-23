import React from "react";
import { Text } from "@mantine/core";
import { NextLink } from "@mantine/next";

const Logo = () => {
  return (
    <Text
      sx={{
        fontSize: "1.5rem",
        fontFamily: "Castellar",
      }}
      component={NextLink}
      href="/"
    >Blindtarmen</Text>
  );
}

export default Logo;
