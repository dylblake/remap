import React from "react";
import { useDragLayer } from "react-dnd";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DragHandleIcon } from "@chakra-ui/icons";

const ServiceTreeCustomDragLayer: React.FC = () => {
  const { item, isDragging, initialClientOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(), // The item being dragged, including its level
      isDragging: monitor.isDragging(),
      initialClientOffset: monitor.getInitialClientOffset(), // Capture initial X position
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  if (!isDragging || !currentOffset || !initialClientOffset) {
    return null;
  }

  let paddingLeft, fontSize, shadow;

  // Switch logic based on the level
  switch (
    item.level // Assuming the item includes a 'level' property
  ) {
    case "upper":
      paddingLeft = "0px";
      fontSize = "xl";
      shadow = "lg";
      break;
    case "middle":
      paddingLeft = "25px";
      fontSize = "lg";
      shadow = "md";
      break;
    case "lower":
      paddingLeft = "50px";
      fontSize = "md";
      shadow = "sm";
      break;
    default:
      paddingLeft = "0px";
      fontSize = "md";
      shadow = "md";
      break;
  }

  // Use the initial X position for the transform and the current Y position
  const style: React.CSSProperties = {
    transform: `translate(${initialClientOffset.x}px, ${currentOffset.y}px)`,
    position: "fixed",
    pointerEvents: "none",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "300px", // Adjust the width to match your table row
  };

  return (
    <div style={style}>
      <Box
        boxShadow={shadow} // Apply shadow based on the level
        bg="gray.600" // Make the background transparent
        opacity="0.5"
        borderRadius="md" // Match the border radius if you have one
        ml={-1.9}
        display="flex"
        alignItems="center"
        paddingLeft={paddingLeft} // Apply padding based on the level
      >
        <Flex align="center">
          <DragHandleIcon boxSize={4} mr={3} color="gray.900" />
          <Text fontWeight="medium" color="gray.900" fontSize={fontSize}>
            {" "}
            {/* Apply font size based on the level */}
            {item.name} {/* Render the service name */}
          </Text>
        </Flex>
      </Box>
    </div>
  );
};

export default ServiceTreeCustomDragLayer;
