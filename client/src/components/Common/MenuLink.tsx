// Glodex/client/src/components/Main/MenuLink.tsx

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Text, HStack, useColorModeValue, Icon } from "@chakra-ui/react";

interface MenuLinkProps {
  to: string;
  label: string;
  icon?: React.ReactElement;
  hoverBg?: string; // Added hoverBg as an optional prop
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, label, icon, hoverBg }) => {
  // Define color variables based on color mode
  const linkColor = useColorModeValue("gray.700", "gray.200");
  const linkHoverColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Link
      as={RouterLink}
      to={to}
      _hover={{
        textDecoration: "none",
        bg: hoverBg || useColorModeValue("gray.100", "gray.700"),
      }}
      borderRadius="md"
      p={3}
      display="block"
      transition="background-color 0.2s ease"
    >
      <HStack spacing={3}>
        {icon && (
          <Icon
            as={() => icon}
            boxSize={5}
            color={linkColor}
            transition="color 0.2s ease"
            _groupHover={{ color: linkHoverColor }}
          />
        )}
        <Text
          fontSize="md"
          fontWeight="medium"
          color={linkColor}
          transition="color 0.2s ease"
          _groupHover={{ color: linkHoverColor }}
        >
          {label}
        </Text>
      </HStack>
    </Link>
  );
};

export default MenuLink;
