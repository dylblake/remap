import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: 'dark'
}

const darkMode = extendTheme({ config });

export default darkMode;