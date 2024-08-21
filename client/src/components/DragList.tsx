// DragList.tsx
import React from "react";
import { DragItem } from "./DragItem";
import { DragAndDropContainer } from "./DragAndDropContainer";
import { Service } from "../types/Service";

interface DragListProps {
  services: Service[];
  onUpdateServiceOrder: (updatedServices: Service[]) => void;
}

export const DragList: React.FC<DragListProps> = ({
  services,
  onUpdateServiceOrder,
}) => {
  const handleIndent = (serviceId: string, newIndentLevel: number) => {
    // Logic to handle indentation
  };

  const handleDragStart = (event: React.DragEvent, serviceId: string) => {
    // Logic to handle drag start
  };

  const handleDrop = (event: React.DragEvent, serviceId: string) => {
    // Logic to handle drop
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow dropping
  };

  const handleDragEnd = (event: React.DragEvent) => {
    // Logic to handle drag end
  };

  return (
    <DragAndDropContainer onUpdateServiceOrder={onUpdateServiceOrder}>
      {services.map((service) => (
        <DragItem
          key={service.uuid}
          service={service}
          onIndent={handleIndent}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />
      ))}
    </DragAndDropContainer>
  );
};
