import { Box, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import MenuLink from "../Common/MenuLink";
import { FaAnglesRight } from "react-icons/fa6";

const AboveLinks = () => {
  // Define color variables based on color mode
  const bgColor = useColorModeValue("transparent", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={0} bg={bgColor} width="100%" mb={-3}>
      {/* Navigation Links */}
      <Flex align="center" justify="flex-start">
        <HStack spacing={2}>
          <MenuLink
            to="/global-settings/main"
            label="Main"
            icon={<FaAnglesRight />}
            hoverBg={hoverBg}
          />
          <MenuLink
            to="/global-settings/services"
            label="Update Services"
            icon={<FaAnglesRight />}
            hoverBg={hoverBg}
          />
          <MenuLink
            to="/global-settings/domains"
            label="Update Domains"
            icon={<FaAnglesRight />}
            hoverBg={hoverBg}
          />
          <MenuLink
            to="/global-settings/other"
            label="Other Settings"
            icon={<FaAnglesRight />}
            hoverBg={hoverBg}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default AboveLinks;
