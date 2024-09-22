import React from "react";
import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import bannerLogo from "../../assets/gp_logo.png";

const BannerFooter: React.FC = () => {
  // Define color variables based on color mode
  const sectionBg = useColorModeValue("white", "gray.700");

  return (
    <Box
      bg={sectionBg}
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8 }}
      textAlign="center"
    >
      <Image
        src={bannerLogo}
        alt="GloDex Banner Logo"
        maxW="100%"
        height="auto"
        objectFit="contain"
      />
    </Box>
  );
};

export default BannerFooter;
