import React from "react";
import { Grid, GridItem, Box, Heading, Text, VStack } from "@chakra-ui/react";
import NavBar from "../components/Main/NavBar";
import ColorModeSwitch from "../components/Settings/ColorModeSwitch";

const Settings: React.FC = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        md: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "300px 1fr",
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="aside" display={{ base: "none", md: "block" }}>
        <Box p={4}>
          <Heading as="h2" size="md">
            Aside Section
          </Heading>
          <Text>This is where AsideLinks will go.</Text>
        </Box>
      </GridItem>
      <GridItem area="main">
        <Box p={8} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h1" size="2xl">
              Settings
            </Heading>
          </VStack>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Settings;
