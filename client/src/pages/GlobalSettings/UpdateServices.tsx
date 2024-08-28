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
import ServiceTree from "../../components/GlobalSettings/Service/ServiceTree";

const UpdateServices: React.FC = () => {
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
      {/* Nav Bar */}
      <GridItem area="nav">
        <NavBar />
      </GridItem>

      {/* Side Panel */}
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

      {/* Main */}
      <GridItem area="main">
        {/* Heading */}
        <Flex direction="column" p={4} gap={6}>
          <VStack spacing={3} mb={10}>
            <Heading as="h1" size="xl" pt={5} pb={0}>
              Global Services Settings
            </Heading>
            <Text size="s">Subheading text here</Text>
          </VStack>
          {/* Main Section */}
          <ServiceTree />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default UpdateServices;
