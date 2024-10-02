import React, { useMemo } from "react";
import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

const Home: React.FC = () => {
  const templateAreas = useMemo(
    () => ({
      base: `"nav" "main"`,
      md: `"nav nav" "main main"`,
    }),
    []
  );

  const templateColumns = useMemo(
    () => ({
      base: "1fr",
      md: "1fr",
    }),
    []
  );

  // Define color variables based on color mode
  const mainBg = useColorModeValue("gray.50", "gray.900"); // Page background

  return (
    <Box bg={mainBg} minH="100vh">
      <Grid
        templateAreas={templateAreas}
        templateColumns={templateColumns}
        gap={4}
        p={{ base: 2, md: 4 }}
      >
        {/* Nav Bar */}
        <GridItem area="nav"></GridItem>

        {/* Main Content */}
        <GridItem area="main"></GridItem>
      </Grid>
    </Box>
  );
};

export default Home;
