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

    // BOOKMARK
    const response = await fetch(`https://thing.com/search?q=${query}`);
    const data = await response.json();

    console.log("Search results:", data);
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading>Menu</Heading>
            <Flex alignItems="center">
              <Link to="/user-profile">
                <IconButton
                  aria-label="Go to user profile"
                  icon={<FaUser />}
                  variant="ghost"
                  colorScheme="gray"
                  size="lg"
                  mr={-2.5}
                />
              </Link>
              <Link to="/settings">
                <IconButton
                  aria-label="Go to settings"
                  icon={<SettingsIcon />}
                  variant="ghost"
                  colorScheme="gray"
                  size="lg"
                  mr={2}
                />
              </Link>
              <DrawerCloseButton position="relative" top="0" />
            </Flex>
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          {showSearchBar && (
            <Box mb={4}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          )}
          <MenuLink to="/" label="Home" icon={<FaHome />} />
          <MenuLink
            to="/"
            label="Feasibility Sheets"
            icon={<FaBalanceScaleLeft />}
          />
          <MenuLink to="/" label="Grids" icon={<FaTable />} />
          <MenuLink to="/" label="Reporting" icon={<FaFileAlt />} />
          <MenuLink
            to="/global-settings"
            label="Global Settings"
            icon={<FaGlobe />}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideMenu;
