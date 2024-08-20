import React from "react";
import {
  HStack,
  Image,
  Heading,
  Box,
  IconButton,
  useDisclosure,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import logo from "@assets/gp_logo.png";
import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";

const handleSearch = async (query: string) => {
  console.log("Searching for:", query);

  const response = await fetch(`https://api.example.com/search?q=${query}`);
  const data = await response.json();

  console.log("Search results:", data);
};

const NavBar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isXsScreen = useBreakpointValue({ base: true, sm: false }) ?? false;

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <HStack spacing={4} alignItems="center">
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="outline"
            colorScheme="gray"
          />
          <Image src={logo} boxSize="70px" padding="5px" />
          <Heading>GloDex</Heading>
        </HStack>

        {!isXsScreen && (
          <Box flex="1" maxW="100%" ml={4} mr={4}>
            <SearchBar onSearch={handleSearch} />
          </Box>
        )}
      </Flex>

      <SideMenu isOpen={isOpen} onClose={onClose} showSearchBar={isXsScreen} />
    </>
  );
};

export default NavBar;
