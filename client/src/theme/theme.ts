import { extendTheme } from "@chakra-ui/react";

import darkMode from "./darkMode";

const overrides = {
    ...darkMode,
};

export default extendTheme(overrides)