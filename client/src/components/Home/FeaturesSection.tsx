import React from "react";
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheckCircle, FaUsers, FaChartLine } from "react-icons/fa";

const FeaturesSection: React.FC = () => {
  // Define color variables based on color mode
  const mainBg = useColorModeValue("gray.50", "gray.900");
  const sectionBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const featureIconColor = useColorModeValue("green.500", "green.300");

  return (
    <Box bg={mainBg} py={{ base: 10, md: 20 }} px={{ base: 4, md: 8 }}>
      <VStack spacing={8} align="center">
        <Heading as="h2" size="xl" color={textColor}>
          Key Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
          {/* Feature 1 */}
          <Flex
            direction="column"
            align="center"
            bg={sectionBg}
            p={6}
            borderRadius="md"
            boxShadow="sm"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
          >
            <Icon
              as={FaCheckCircle}
              w={12}
              h={12}
              color={featureIconColor}
              mb={4}
            />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              Data
            </Heading>
            <Text fontSize="md" color={subTextColor} textAlign="center">
              Access detailed country feasibility and experience data to make
              informed decisions.
            </Text>
          </Flex>

          {/* Feature 2 */}
          <Flex
            direction="column"
            align="center"
            bg={sectionBg}
            p={6}
            borderRadius="md"
            boxShadow="sm"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
          >
            <Icon as={FaUsers} w={12} h={12} color={featureIconColor} mb={4} />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              Users
            </Heading>
            <Text fontSize="md" color={subTextColor} textAlign="center">
              We got different folks who can get in here and see things.
            </Text>
          </Flex>

          {/* Feature 3 */}
          <Flex
            direction="column"
            align="center"
            bg={sectionBg}
            p={6}
            borderRadius="md"
            boxShadow="sm"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
          >
            <Icon
              as={FaChartLine}
              w={12}
              h={12}
              color={featureIconColor}
              mb={4}
            />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              Client Data
            </Heading>
            <Text fontSize="md" color={subTextColor} textAlign="center">
              We can tell clients some stuff that will help them.
            </Text>
          </Flex>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default FeaturesSection;
