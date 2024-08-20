import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Text, HStack } from "@chakra-ui/react";

interface MenuLinkProps {
  to: string;
  label: string;
  icon?: React.ReactElement; // Optional icon prop
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, label, icon }) => {
  return (
    <Box mb={4}>
      <Link as={RouterLink} to={to} _hover={{ textDecoration: "none" }}>
        <HStack spacing={2}>
          {icon && <Box>{icon}</Box>} {/* Render the icon if provided */}
          <Text fontSize="xl" fontWeight="bold">
            {label}
          </Text>
        </HStack>
      </Link>
    </Box>
  );
};

export default MenuLink;
