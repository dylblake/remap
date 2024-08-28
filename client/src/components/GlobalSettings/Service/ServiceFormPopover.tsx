import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useToast,
} from "@chakra-ui/react";
import useCreateService from "../../../hooks/useCreateService";
import { useServices } from "../../../hooks/useServices"; // Import useServices

const ServiceFormPopover: React.FC = () => {
  const [name, setName] = useState("");
  const { createService, error, isLoading, service } = useCreateService();
  const { refetch } = useServices(); // Get refetch function
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
        order: 1, // Assuming you have a default order
        type: "upper", // Default type; adjust based on your needs
      });

      await refetch(); // Trigger refetch after creation

      if (service) {
        toast({
          title: "Service created.",
          description: `Service ${service.name} was created successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setName(""); // Clear input after successful creation
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
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" size="sm">
          Add Service
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Create a new Service</PopoverHeader>
        <PopoverBody>
          <form onSubmit={handleSubmit}>
            <FormControl id="name" mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <PopoverFooter>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isLoading}
                size="sm"
              >
                Add Service
              </Button>
            </PopoverFooter>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceFormPopover;
