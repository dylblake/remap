import React from "react";
import { Button, HStack } from "@chakra-ui/react";

interface IndentationControlsProps {
  indentLevel: number;
  onIndentUp: () => void;
  onIndentDown: () => void;
}

export const IndentationControls: React.FC<IndentationControlsProps> = ({
  indentLevel,
  onIndentUp,
  onIndentDown,
}) => {
  return (
    <HStack spacing={2}>
      <Button onClick={onIndentDown} isDisabled={indentLevel === 0}>
        Indent Down
      </Button>
      <Button onClick={onIndentUp} isDisabled={indentLevel === 2}>
        Indent Up
      </Button>
    </HStack>
  );
};
