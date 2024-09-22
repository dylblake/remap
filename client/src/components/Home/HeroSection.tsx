import React from "react";
import {
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

const HeroSection: React.FC = () => {
  // Define color variables based on color mode
  const sectionBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const buttonBg = useColorModeValue("green.500", "green.400");
  const buttonColor = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("green.600", "green.500");

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      bg={sectionBg}
      py={{ base: 10, md: 20 }}
      px={{ base: 4, md: 8 }}
      textAlign={{ base: "center", md: "left" }}
      boxShadow="md"
      borderRadius="md"
      mb={8}
    >
      {/* Hero Text */}
      <VStack spacing={6} align="center">
        <Heading as="h1" size="2xl" color={textColor}>
          Welcome to GloDex
        </Heading>
        <Text fontSize="xl" color={subTextColor}>
          Your one-stop global index of country feasibility and experience
          information for travel logistics in clinical trials.
        </Text>
        <Button
          rightIcon={<FaArrowRight />}
          colorScheme="green"
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          size="lg"
        >
          Get Started
        </Button>
      </VStack>
    </Flex>
  );
};

export default HeroSection;
