// Glodex/client/src/pages/GlobalSettings/Services.tsx

import React, { useMemo } from "react";
import {
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Box,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import NavBar from "../../components/Common/NavBar";
import AsideLinks from "../../components/GlobalSettings/AsideLinks";
import AboveLinks from "../../components/GlobalSettings/AboveLinks";
import ServiceTree from "../../components/GlobalSettings/Service/Tree/ServiceTree";

const Services: React.FC = () => {
  const templateAreas = useMemo(
    () => ({
      base: `"nav" "above" "main"`,
      md: `"nav nav" "aside main"`,
    }),
    []
  );

  const templateColumns = useMemo(
    () => ({
      base: "1fr",
      md: "250px 1fr", // Increased from 200px to 250px
    }),
    []
  );

  // Define color variables based on color mode
  const mainBg = useColorModeValue("gray.50", "gray.900"); // Background for the main content
  const sectionBg = useColorModeValue("white", "gray.700"); // Background for sections
  const sectionShadow = useColorModeValue("sm", "sm-dark"); // Shadow for sections
  const subheadingColor = useColorModeValue("gray.600", "gray.400"); // Color for subheadings

  return (
    <Grid
      templateAreas={templateAreas}
      templateColumns={templateColumns}
      minH="100vh"
      bg={mainBg}
    >
      {/* Nav Bar */}
      <GridItem area="nav">
        <NavBar />
      </GridItem>

      {/* AboveLinks for Small Screens */}
      <GridItem
        area="above"
        display={{ base: "block", md: "none" }} // Show only on small screens
      >
        <AboveLinks />
      </GridItem>

      {/* Side Panel */}
      <GridItem
        area="aside"
        display={{ base: "none", md: "block" }} // Hide on small screens
        position="relative"
        borderRadius="md"
        mt={6}
      >
        <AsideLinks />
      </GridItem>

      {/* Main */}
      <GridItem area="main" p={{ base: 4, md: 6 }}>
        {/* Container Box */}
        <Box
          bg={sectionBg}
          borderRadius="md"
          boxShadow={sectionShadow}
          p={{ base: 4, md: 6 }}
        >
          {/* Heading and Subheading */}
          <VStack spacing={3} mb={10} align="start">
            <Heading as="h1" size="xl">
              Global Services Settings
            </Heading>
            <Text fontSize="md" color={subheadingColor}>
              Manage and configure your global service here.
            </Text>
          </VStack>

          {/* Main Section */}
          <Stack spacing={6}>
            <ServiceTree />
          </Stack>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default React.memo(Services);
