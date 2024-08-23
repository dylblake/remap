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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useDeleteService } from "../hooks/useDeleteService";

interface DeleteIconProps {
  uuid: string;
  onSuccess?: () => void;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({ uuid, onSuccess }) => {
  const { deleteService, isLoading, error } = useDeleteService();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    try {
      await deleteService(uuid);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
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
          {isLoading ? <Spinner size="sm" /> : <FaTrash />}
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          Are you sure you want to delete this service from GloDex?
        </PopoverBody>
        <PopoverFooter justifyContent="flex-end">
          <Button variant="outline" mr={3} onClick={onClose}>
            Nahh
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            LETS GOOOOO
          </Button>
        </PopoverFooter>
        {error && (
          <Box mt={4}>
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DeleteIcon;
