import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Button,
  Box,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaTrash, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

interface DeleteIconProps {
  uuid: string;
  onSuccess?: () => void;
  onDelete: (uuid: string) => void; // Ensure this line is present
}

const DeleteIcon: React.FC<DeleteIconProps> = ({
  uuid,
  onSuccess,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    try {
      onDelete(uuid); // Call the onDelete callback
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="left">
      <PopoverTrigger>
        <Box
          as="span"
          color="gray.700"
          _hover={{ color: "red.500" }}
          _active={{ color: "red.600" }}
          fontSize="lg"
          cursor="pointer"
          onClick={onOpen}
        >
          <FaTrash />
        </Box>
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody m={2}>
          <Text align="center">
            Remove this <br />
            from GloDex?
          </Text>
        </PopoverBody>
        <PopoverFooter justifyContent="flex-end">
          <Flex justify="center">
            <Button mr={3} onClick={onClose}>
              <Box p={2}>
                <FaThumbsDown />
              </Box>
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              <Box p={2}>
                <FaThumbsUp />
              </Box>
            </Button>
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteIcon;
