// Glodex/client/src/pages/GlobalSettings/Main.tsx

import React, { useMemo } from "react";
import {
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import NavBar from "../../components/Common/NavBar";
import AsideLinks from "../../components/GlobalSettings/AsideLinks";
import AboveLinks from "../../components/GlobalSettings/AboveLinks"; // Importing AboveLinks for small screens
import DomainTree from "@components/GlobalSettings/Domain/Tree/DomainTree";

const Domains: React.FC = () => {
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
      md: "250px 1fr", // Consistent width for AsideLinks
    }),
    []
  );

  // Define color variables based on color mode
  const mainBg = useColorModeValue("gray.50", "gray.900"); // Background for the main content
  const sectionBg = useColorModeValue("white", "gray.700"); // Background for sections
  const textColor = useColorModeValue("gray.800", "gray.100"); // Primary text color
  const subTextColor = useColorModeValue("gray.600", "gray.300"); // Subheading text color
  const boxShadow = useColorModeValue("md", "dark-lg"); // Box shadow for content containers
  const borderRadius = "md"; // Consistent border radius

  return (
    <Box bg={mainBg} minH="100vh">
      <Grid
        templateAreas={templateAreas}
        templateColumns={templateColumns}
        gap={4}
        p={{ base: 2, md: 4 }}
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
        >
          <AsideLinks />
        </GridItem>

        {/* Main Content Area */}
        <GridItem area="main">
          {/* Container Box */}
          <Box
            bg={sectionBg}
            borderRadius={borderRadius}
            boxShadow={boxShadow}
            p={{ base: 4, md: 6 }}
          >
            {/* Heading and Subheading */}
            <VStack spacing={3} mb={10} align="start">
              <Heading as="h1" size="xl" color={textColor}>
                Global Domain Settings
              </Heading>
              <Text fontSize="md" color={subTextColor}>
                Manage and configure your global governance domains here.
              </Text>
            </VStack>

            {/* Placeholder for Main Content */}
            <Box>
              {/* Add your main content here */}
              <Text fontSize="lg" color={textColor}>
                <DomainTree />
              </Text>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default React.memo(Domains);
