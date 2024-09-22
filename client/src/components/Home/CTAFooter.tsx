// /Users/dylanevans/GloDex/client/src/components/Home/CTAFooter.tsx

import React from "react";
import {
  Flex,
  VStack,
  Heading,
  Button,
  Image,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import banner from "@assets/banner.png"; // Using path alias

const CTAFooter: React.FC = () => {
  // Define color variables based on color mode
  const sectionBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const buttonBg = useColorModeValue("green.500", "green.400");
  const buttonColor = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("green.600", "green.500");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={sectionBg}
      py={{ base: 10, md: 20 }}
      px={{ base: 4, md: 8 }}
      boxShadow="md"
      borderRadius="md"
      mx={{ base: 2, md: 8 }}
      mb={8}
    >
      <Box mt={8} w="100%" textAlign="center">
        <Image
          src={banner}
          alt="GloDex Banner Logo"
          maxW="100%"
          height="auto"
          objectFit="contain"
          mb={10}
        />
      </Box>
      <VStack spacing={6}>
        <Heading as="h2" size="xl" color={textColor}>
          You Think Cool Stuff Is In Here?
        </Heading>
        <Button
          rightIcon={<FaArrowRight />}
          colorScheme="green"
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          size="lg"
        >
          You bet there is! Let's get going.
        </Button>
      </VStack>
    </Flex>
  );
};

export default CTAFooter;
