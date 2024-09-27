import React, { useCallback } from "react";
import {
  Button,
  Flex,
  IconButton,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import ServiceFormPopover from "../ServiceFormPopover";
import { FaRedo, FaSave, FaUndo } from "react-icons/fa";
import { Service } from "../../../../types/Service";

interface ServiceTreeToolbarProps {
  isAllExpanded: boolean;
  onToggleExpandCollapse: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onServiceCreated: (newService: Service) => void;
}

const ServiceTreeToolbar: React.FC<ServiceTreeToolbarProps> = ({
  isAllExpanded,
  onToggleExpandCollapse,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving,
  onServiceCreated,
}) => {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const handleSave = useCallback(() => {
    onSave();
    toast({
      title: "Changes saved.",
      description: "Your changes have been successfully saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [onSave, toast]);

  // Configure styles based on color mode
  const toolbarBg = colorMode === "dark" ? "gray.700" : "gray.50";
  const borderColor = colorMode === "dark" ? "gray.600" : "gray.1000";
  const borderWidth = colorMode === "dark" ? "1px" : "3px";

  return (
    <Flex
      justify="space-between"
      align="center"
      bg={toolbarBg}
      borderColor={borderColor}
      borderWidth={borderWidth}
      p={2}
      height="50px"
    >
      <Flex gap={2} align="center">
        <Button
          variant="outline"
          colorScheme="teal"
          onClick={onToggleExpandCollapse}
          size="sm"
        >
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </Button>
        <ServiceFormPopover onServiceCreated={onServiceCreated} />
      </Flex>
      <Flex gap={1} align="center">
        <IconButton
          aria-label="Undo"
          icon={<FaUndo />}
          onClick={onUndo}
          variant="ghost"
          size="sm"
          isDisabled={!canUndo}
          _hover={canUndo ? { color: "green.500" } : {}}
        />
        <IconButton
          aria-label="Redo"
          icon={<FaRedo />}
          onClick={onRedo}
          variant="ghost"
          size="sm"
          isDisabled={!canRedo}
          _hover={canRedo ? { color: "green.500" } : {}}
        />
        <IconButton
          aria-label="Save"
          onClick={handleSave}
          icon={<FaSave />}
          variant="ghost"
          size="sm"
          isLoading={isSaving}
          _hover={{ color: "green.500" }}
        />
      </Flex>
    </Flex>
  );
};

export default React.memo(ServiceTreeToolbar);
