import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import useCreateService from "../hooks/useCreateService";

const ServiceForm: React.FC = () => {
  const [name, setName] = useState("");
  const { createService, error, isLoading, service } = useCreateService();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for the service.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await createService({
        name,
      });

      if (service) {
        toast({
          title: "Service created.",
          description: `Service ${service.name} was created successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setName("");
      }
    } catch (err) {
      toast({
        title: "Error creating service.",
        description: error || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isRequired>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color="gray.400"
            textTransform="uppercase"
            letterSpacing="wider"
            lineHeight="1.2"
            marginBottom={0}
          >
            Name
          </FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            borderRadius="md"
            borderColor="gray.300"
            boxShadow="sm"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={isLoading}>
          Create Service
        </Button>
      </form>
    </Box>
  );
};

export default ServiceForm;
