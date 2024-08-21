import React, { useState, useCallback } from "react";
import { Service } from "../types/Service";

interface DragAndDropContainerProps {
  children: React.ReactNode;
  onUpdateServiceOrder: (updatedServices: Service[]) => void;
}

export const DragAndDropContainer: React.FC<DragAndDropContainerProps> = ({
  children,
  onUpdateServiceOrder,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [items, setItems] = useState<Service[]>([]);

  const handleDragStart = useCallback(
    (event: React.DragEvent, serviceId: string) => {
      setDraggedItem(serviceId);
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); // Allow dropping
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent, targetServiceId: string) => {
      event.preventDefault();

      if (draggedItem) {
        // Logic to reorder items
        const updatedItems = reorderItems(draggedItem, targetServiceId);
        setItems(updatedItems);
        onUpdateServiceOrder(updatedItems);
        setDraggedItem(null);
      }
    },
    [draggedItem, onUpdateServiceOrder]
  );

  const reorderItems = (draggedId: string, targetId: string): Service[] => {
    return [...items];
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, "")} // Adjust as needed
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement<any>, {
          onDragStart: handleDragStart,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
        })
      )}
    </div>
  );
};
