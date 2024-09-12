import { Box, Flex, Heading, Icon } from "@chakra-ui/react";
import MenuLink from "../../../components/Main/MenuLink";
import { FaAngleRight, FaGlobe } from "react-icons/fa";

const AsideLinks = () => {
  return (
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
          to="/global-settings/main"
          label="Main"
          icon={<FaAngleRight />}
        />
        <MenuLink
          to="/global-settings/services"
          label="Update Services"
          icon={<FaAngleRight />}
        />
        <MenuLink
          to="/global-settings/tree-time"
          label="Tree Time"
          icon={<FaAngleRight />}
        />
        <MenuLink to="/" label="...." icon={<FaAngleRight />} />
      </Box>
    </Box>
  );
};

export default AsideLinks;
