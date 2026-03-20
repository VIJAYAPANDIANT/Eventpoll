import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ 
  config,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    masai: {
      50: "#ffe5e6",
      100: "#ffb3b4",
      200: "#ff8082",
      300: "#ff4d4f",
      400: "#ff1a1d",
      500: "#D71A20", // Main Masai Red
      600: "#b5161b",
      700: "#8e1115",
      800: "#670c0f",
      900: "#40080a",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "xl",
      },
    },
  },
});

export default theme;
