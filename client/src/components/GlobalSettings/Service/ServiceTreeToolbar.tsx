import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import ServiceFormPopover from "./ServiceFormPopover";

interface ServiceTreeToolbarProps {
  isAllExpanded: boolean;
  onToggleExpandCollapse: () => void;
}

const ServiceTreeToolbar: React.FC<ServiceTreeToolbarProps> = ({
  isAllExpanded,
  onToggleExpandCollapse,
}) => {
  return (
    <Flex justify="space-between" mb={4}>
      <Button
        variant="outline"
        colorScheme="gray"
        onClick={onToggleExpandCollapse}
        size="sm"
      >
        {isAllExpanded ? "Collapse All" : "Expand All"}
      </Button>
      <ServiceFormPopover />
    </Flex>
  );
};

export default ServiceTreeToolbar;
