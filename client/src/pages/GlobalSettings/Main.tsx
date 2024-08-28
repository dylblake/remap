import React from "react";
import {
  Grid,
  GridItem,
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import NavBar from "../../components/Main/NavBar";
import MenuLink from "../../components/Main/MenuLink";
import { FaAngleRight, FaGlobe } from "react-icons/fa";

const GlobalSettings: React.FC = () => {
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
      <GridItem
        area="aside"
        display={{ base: "none", md: "block" }}
        position="relative"
      >
        <Box p={4}>
          <Box position="absolute" top={6} left={6}>
            <Flex align="center">
              <Icon as={FaGlobe} boxSize="36px" mr="12px" />
              <Heading as="h2" size="lg">
                Global Settings
              </Heading>
            </Flex>
          </Box>
          <Box mt={16} pl={3}>
            {" "}
            <MenuLink
              to="/global-settings"
              label="Main Global"
              icon={<FaAngleRight />}
            />
            <MenuLink
              to="/global-service-settings"
              label="Update Services"
              icon={<FaAngleRight />}
            />
            <MenuLink to="/" label="...." icon={<FaAngleRight />} />
            <MenuLink to="/" label="...." icon={<FaAngleRight />} />
          </Box>
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
