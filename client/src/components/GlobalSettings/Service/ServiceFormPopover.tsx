import React, { useState, useRef, useEffect } from "react";
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

interface ServiceFormPopoverProps {
  onServiceCreated: (service: any) => void;
}

const ServiceFormPopover: React.FC<ServiceFormPopoverProps> = ({
  onServiceCreated,
}) => {
  const [name, setName] = useState("");
  const toast = useToast();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    const newService = {
      uuid: Date.now().toString(), // Generate a temporary UUID
      name,
      order: 1,
      type: "upper",
    };

    onServiceCreated(newService);

    setName("");
  };

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, []);

  return (
    <Popover initialFocusRef={initialFocusRef}>
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
                ref={initialFocusRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <PopoverFooter>
              <Button type="submit" colorScheme="teal" size="sm">
                Create
              </Button>
            </PopoverFooter>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceFormPopover;
