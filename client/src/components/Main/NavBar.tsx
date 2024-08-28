import React from "react";
import { Link } from "react-router-dom";
import {
  HStack,
  Image,
  Heading,
  Box,
  IconButton,
  useDisclosure,
  Flex,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import logo from "@assets/gp_logo.png";
import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";

const handleSearch = async (query: string) => {
  console.log(query);
};

const NavBar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isXsScreen = useBreakpointValue({ base: true, sm: false }) ?? false;

  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg="white.200"
        boxShadow="xl"
        borderRadius="lg"
        opacity="0.9"
      >
        <HStack spacing={2} alignItems="center">
          <IconButton
            aria-label="Open menu"
            size="lg"
            icon={<FaBars />}
            onClick={onOpen}
            variant="ghost"
            color="white"
            _hover={{ color: "green.500" }}
            boxShadow="xl"
          />
          <Link to="/">
            <Image
              src={logo}
              boxSize="50px"
              padding="5px"
              borderRadius="full"
              boxShadow="sm"
            />
          </Link>
          <Link to="/">
            <Heading size="xl">GloDex</Heading>
          </Link>
        </HStack>

        {!isXsScreen && (
          <Box flex="1" maxW="100%" ml={4} mr={4}>
            <SearchBar onSearch={handleSearch} />
          </Box>
        )}

        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          variant="outline"
          _hover={{ bg: "green.500" }}
          boxShadow="xl"
          size="lg"
        />
      </Flex>

      <SideMenu isOpen={isOpen} onClose={onClose} showSearchBar={isXsScreen} />
    </>
  );
};

export default NavBar;
