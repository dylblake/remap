import React from "react";
import { Grid, GridItem, Box, Heading, Text, VStack } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import MenuLink from "../../components/MenuLink";
import { FaArrowRight } from "react-icons/fa";

const GlobalSettings: React.FC = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        md: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr", // Single column on small screens
        md: "240px 1fr", // 240px for aside, remaining space for main on medium and larger screens
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="aside" display={{ base: "none", md: "block" }}>
        <Box p={4}>
          <Heading as="h2" size="md" padding={6}>
            Aside Section
          </Heading>
          <MenuLink
            to="/global-settings"
            label="Main Global"
            icon={<FaArrowRight />}
          />
          <MenuLink
            to="/global-service-settings"
            label="Update Services"
            icon={<FaArrowRight />}
          />
          <MenuLink to="/" label="...." icon={<FaArrowRight />} />
          <MenuLink to="/" label="...." icon={<FaArrowRight />} />
        </Box>
      </GridItem>
      <GridItem area="main">
        <Box p={8} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h1" size="2xl">
              Global Settings
            </Heading>
            <Text fontSize="xl">Do the first thing</Text>
          </VStack>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default GlobalSettings;
