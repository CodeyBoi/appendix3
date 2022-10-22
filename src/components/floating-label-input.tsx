import React from "react";
import { TextInput, createStyles, PasswordInput } from "@mantine/core";

/**
 * StyledTextInput taken from https://ui.mantine.dev/category/inputs
 */
const useStyles = createStyles((theme, { floating }: { floating: boolean }) => ({
  root: {
    position: 'relative',
  },

  label: {
    position: 'absolute',
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: 'none',
    color: floating
      ? theme.colorScheme === 'dark'
        ? theme.white
        : theme.black
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
    transition: 'transform 150ms ease, color 150ms ease, font-size 150ms ease',
    transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : 'none',
    fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
    fontWeight: floating ? 500 : 400,
  },

  required: {
    transition: 'opacity 150ms ease',
    opacity: floating ? 1 : 0,
  },

  input: {
    '&::placeholder': {
      transition: 'color 150ms ease',
      color: !floating ? 'transparent' : undefined,
    },
  },
}));

interface FloatingLabelInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  [key: string]: any;
}

export function FloatingLabelInput({ label, required, placeholder, type }: FloatingLabelInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { classes } = useStyles({ floating: value.trim().length !== 0 || focused });

  if (type === "password") {
    return (
      <PasswordInput
        label={label}
        placeholder={placeholder}
        required={required}
        classNames={classes}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        mt="md"
        autoComplete="nope"
      />
    );
  }

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required={required}
      classNames={classes}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
    />
  );
}

export default FloatingLabelInput;
