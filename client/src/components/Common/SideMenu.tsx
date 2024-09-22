import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Box,
  IconButton,
  Flex,
  Heading,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBalanceScaleLeft,
  FaTable,
  FaFileAlt,
  FaGlobe,
} from "react-icons/fa";
import { SettingsIcon } from "@chakra-ui/icons";
import SearchBar from "./SearchBar";
import MenuLink from "./MenuLink";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  showSearchBar: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  showSearchBar,
}) => {
  const handleSearch = async (query: string) => {
    console.log("Searching for:", query);

    // Replace with your actual search API endpoint
    const response = await fetch(`https://thing.com/search?q=${query}`);
    const data = await response.json();

    console.log("Search results:", data);
  };

  // Define color variables based on color mode
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("teal.600", "teal.800");
  const headerTextColor = useColorModeValue("white", "white");
  const iconColor = useColorModeValue("white", "gray.300"); // White in light mode, gray in dark
  const iconHoverColor = useColorModeValue("teal.300", "teal.500");

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={bgColor} boxShadow="lg" borderRadius="md">
        <DrawerHeader
          bg={headerBg}
          color={headerTextColor}
          borderBottomWidth="1px"
          px={4}
          height="60px" // Set a fixed height for consistent alignment
        >
          <Flex
            alignItems="center" // Vertically center the items
            justifyContent="space-between" // Distribute space between sections
            height="100%"
          >
            {/* Left Section: Menu Heading and Icons */}
            <HStack spacing={3} alignItems="center">
              <Heading size="md" ml={1}>
                Menu
              </Heading>
              <HStack spacing={2}>
                <Link to="/user-profile">
                  <IconButton
                    aria-label="Go to user profile"
                    icon={<FaUser />}
                    variant="ghost"
                    color={iconColor}
                    size="md"
                    _hover={{ color: iconHoverColor }}
                  />
                </Link>
                <Link to="/settings">
                  <IconButton
                    aria-label="Go to settings"
                    icon={<SettingsIcon />}
                    variant="ghost"
                    color={iconColor}
                    size="md"
                    _hover={{ color: iconHoverColor }}
                    ml={-4}
                  />
                </Link>
              </HStack>
            </HStack>

            {/* Right Section: Close Button */}
            <DrawerCloseButton size="md" />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          {showSearchBar && (
            <Box mb={6}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          )}
          {/* Navigation Links */}
          <MenuLink to="/" label="Home" icon={<FaHome />} />
          <MenuLink
            to="/feasibility-sheets"
            label="Feasibility Sheets"
            icon={<FaBalanceScaleLeft />}
          />
          <MenuLink to="/grids" label="Grids" icon={<FaTable />} />
          <MenuLink to="/reporting" label="Reporting" icon={<FaFileAlt />} />
          <MenuLink
            to="/global-settings/main"
            label="Global Settings"
            icon={<FaGlobe />}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideMenu;
