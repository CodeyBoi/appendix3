import { Indicator } from "@mantine/core";
import { IconMusic, IconPlus } from "@tabler/icons";
import React from "react";

const IconMusicPlus = () => (
  <Indicator label={<IconPlus style={{ width: "17px", height: "17px" }} />} color="#00000000">
    <IconMusic />
  </Indicator>
);

export default IconMusicPlus;
