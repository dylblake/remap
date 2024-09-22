import React, { useMemo } from "react";
import { Grid, GridItem, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import NavBar from "../../components/Common/NavBar";
import AsideLinks from "../../components/GlobalSettings/Service/AsideLinks";

const TreeTime: React.FC = () => {
  const templateAreas = useMemo(
    () => ({
      base: `"nav" "main"`,
      md: `"nav nav" "aside main"`,
    }),
    []
  );

  const templateColumns = useMemo(
    () => ({
      base: "1fr",
      md: "300px 1fr",
    }),
    []
  );

  return (
    <Grid templateAreas={templateAreas} templateColumns={templateColumns}>
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
        <AsideLinks />
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
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default React.memo(TreeTime);
