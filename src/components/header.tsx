import React, { useState } from "react";
import { Header, Group, Burger, Drawer } from "@mantine/core";
import Logo from "./logo";
import NavbarContent from "./navbar";

const AppendixHeader = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <Header
      height={60}
      p="sm"
      sx={(theme) => ({
        backgroundColor: theme?.colors?.red?.[5],
        color: theme.white,
        zIndex: 516,
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
        border: 0,
      })}
    >
      <Group position="apart">
        <Logo />
        <Group>
          <Burger
            opened={navbarOpen}
            onClick={() => setNavbarOpen(!navbarOpen)}
            title="Open navigation menu"
            sx={(theme) => ({
              color: theme.white,
              [theme.fn.largerThan("sm")]: {
                display: "none",
              },
            })}
          />
        </Group>
      </Group>
      <Drawer
        withCloseButton={false}
        size={300}
        opened={navbarOpen}
        onClose={() => setNavbarOpen(false)}
        position="right"
        sx={(theme) => ({
          [theme.fn.largerThan("sm")]: {
            display: "none",
          },
        })}
        styles={{
          drawer: {
            paddingTop: "var(--mantine-header-height) !important",
          },
        }}
      >
        <NavbarContent onLinkClicked={() => setNavbarOpen(false)} />
      </Drawer>
    </Header>
  );
};

export default AppendixHeader;
