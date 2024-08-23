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
import NavBar from "../../components/NavBar";
import MenuLink from "../../components/MenuLink";
import { FaAngleRight, FaGlobe } from "react-icons/fa";
import ServiceList from "../../components/ServiceList";
import ServiceForm from "../../components/ServiceForm";

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
        <Flex direction="column" p={4} gap={6}>
          <VStack spacing={6}>
            <Heading as="h1" size="xl" pb={10}>
              Global Services Settings
            </Heading>
            <Text></Text>
          </VStack>
          <Flex direction="row" gap={6} align="flex-start">
            <Box flex="1">
              <Flex direction="column">
                <Text textAlign="center" mb={0}>
                  {" "}
                  Drag to reorder and indent to show correct relationship.
                </Text>
              </Flex>
              <ServiceList />
            </Box>
            <Box flex="1" mx={4}>
              <Flex direction="column">
                <Text textAlign="center" mb={3}>
                  {" "}
                  Use this form to add new services to the GloDex.
                </Text>
              </Flex>
              <ServiceForm />
            </Box>
            <Box flex="1">
              <Box />
            </Box>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default UpdateServices;
