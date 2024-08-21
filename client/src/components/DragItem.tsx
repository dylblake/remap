import React from "react";
import { Box } from "@chakra-ui/react";
import { IndentationControls } from "./IndentationControls";
import { Service } from "../types/Service";

interface DragItemProps {
  service: Service;
  onIndent: (serviceId: string, newIndentLevel: number) => void;
  onDragStart: (event: React.DragEvent, serviceId: string) => void;
  onDrop: (event: React.DragEvent, serviceId: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragEnd: (event: React.DragEvent) => void;
}

export const DragItem: React.FC<DragItemProps> = ({
  service,
  onIndent,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnd,
}) => {
  return (
    <Box
      draggable
      onDragStart={(e) => onDragStart(e, service.uuid)}
      onDrop={(e) => onDrop(e, service.uuid)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.50"
      ml={service.indentLevel * 4}
    >
      <Box mb={2}>{service.name}</Box>
      <IndentationControls
        indentLevel={service.indentLevel}
        onIndentUp={() => onIndent(service.uuid, service.indentLevel + 1)}
        onIndentDown={() => onIndent(service.uuid, service.indentLevel - 1)}
      />
    </Box>
  );
};
