import { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  }

  return {
    colorScheme,
    toggleColorScheme,
  };
}

export default useColorScheme;
