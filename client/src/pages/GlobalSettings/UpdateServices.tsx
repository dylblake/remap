import React from "react";
import { Grid, GridItem, Box, Heading, Text, VStack } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import MenuLink from "../../components/MenuLink";
import { FaArrowRight } from "react-icons/fa";
import ServiceList from "../../components/ServiceList";

const UpdateServices: React.FC = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        md: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "240px 1fr",
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
            to="/UpdateServices"
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
              Global Service Settings
            </Heading>
            <Text fontSize="xl">Do some stuff below:</Text>
          </VStack>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default UpdateServices;
