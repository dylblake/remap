import { extendTheme } from "@chakra-ui/react";

import darkMode from "./darkMode";

//import fonts from "./fonts";
import '@fontsource/open-sans'
import '@fontsource/raleway'

const overrides = {
    darkMode,
    //fonts: fonts //BOOKMARK -> Return to this at a later time
};

export default extendTheme(overrides)