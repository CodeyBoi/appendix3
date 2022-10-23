import { MantineThemeOverride } from '@mantine/core';

const GLOBAL_THEME: MantineThemeOverride = {
  // colorScheme: 'dark',
  primaryColor: 'red',
  primaryShade: 5,
  white: '#FAFFFC',
  colors: {
    red: [
      '#ffe3e0',
      '#ffb5b1',
      '#ff867f',
      '#ff564c',
      '#ff271a',
      '#ce0c00',
      '#b40700',
      '#810300',
      '#500000',
      '#210000',
    ],
    orange: [
      "#FFF4E5",
      "#FFE1B8",
      "#FFCE8A",
      "#FFBB5C",
      "#FFA72E",
      "#FF9400",
      "#CC7600",
      "#995900",
      "#663B00",
      "#331E00",
    ],
  },
  fontFamily: 'Bahnschrift, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  headings: {
    sizes: {
      h1: {
        fontSize: 32,
      },
      h2: {
        fontSize: 24,
      },
      h3: {
        fontSize: 18,
      },
      h4: {
        fontSize: 14,
      },
      h5: {
        fontSize: 12,
      },
    },
    fontWeight: 500,
    fontFamily: 'Bahnschrift, sans-serif',
  },
  loader: "dots",
  dateFormat: "D MMMM, YYYY",
  datesLocale: "sv",
  other: {
    fontWeights: {
      regular: 400,
      semibold: 600,
      bold: 700,
      extraBold: 900,
    },
  },
  components: {
    Button: {
      styles: {
        root: {
          variant: "outline",
        },
      },
    },
    Select: {
      defaultProps: {
        dropdownComponent: "div",
      },
    },
    Checkbox: {
      defaultProps: {
        radius: "xl",
      }
    }
  }
};

export { GLOBAL_THEME };
