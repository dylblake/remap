import React, { useCallback } from "react";
import { Button, Flex, IconButton, useToast } from "@chakra-ui/react";
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
  onServiceCreated: (newService: Service) => void; // Add this line
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

  return (
    <Flex justify="space-between" mb={4} align="center">
      <Flex gap={2} align="center">
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={onToggleExpandCollapse} // This button toggles expand/collapse
          size="sm"
        >
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </Button>
        <ServiceFormPopover onServiceCreated={onServiceCreated} />{" "}
        {/* Pass the prop */}
      </Flex>
      <Flex gap={0} align="center">
        <IconButton
          aria-label="Undo"
          icon={<FaUndo />}
          onClick={onUndo}
          variant="ghost"
          size="lg"
          isDisabled={!canUndo}
          _hover={canUndo ? { color: "green.500" } : {}}
        />
        <IconButton
          aria-label="Redo"
          icon={<FaRedo />}
          onClick={onRedo}
          variant="ghost"
          size="lg"
          isDisabled={!canRedo}
          _hover={canRedo ? { color: "green.500" } : {}}
        />
        <IconButton
          aria-label="save"
          onClick={handleSave}
          icon={<FaSave />}
          variant="ghost"
          size="lg"
          isLoading={isSaving}
          _hover={{ color: "green.500" }}
        />
      </Flex>
    </Flex>
  );
};

export default React.memo(ServiceTreeToolbar);
