import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import MenuLink from "../../Common/MenuLink";
import { FaGlobe } from "react-icons/fa";
import { FaAnglesRight } from "react-icons/fa6";

const AsideLinks = () => {
  // Define color variables based on color mode
  const headingColor = useColorModeValue("green.600", "green.300");
  const iconColor = useColorModeValue("green.600", "green.300");
  const bgColor = useColorModeValue("transparent", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={6} bg={bgColor} height="100%" position="relative">
      {/* Header Section */}
      <Flex align="center" mb={6}>
        <Icon as={FaGlobe} boxSize="28px" color={iconColor} mr={3} />
        <Heading as="h2" size="md" color={headingColor}>
          Global Settings
        </Heading>
      </Flex>

      {/* Navigation Links */}
      <VStack align="stretch" spacing={2}>
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
          to="/global-settings/tree-time"
          label="Tree Time"
          icon={<FaAnglesRight />}
          hoverBg={hoverBg}
        />
        <MenuLink
          to="/global-settings/other"
          label="Other Settings"
          icon={<FaAnglesRight />}
          hoverBg={hoverBg}
        />
      </VStack>
    </Box>
  );
};

export default AsideLinks;
