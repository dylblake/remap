import React, { useState, useEffect } from "react";
import { Tr, Td, Flex, Text, IconButton, Box } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import { useDrag } from "react-dnd";
import { Service } from "../../../types/Service";
import DeleteIcon from "./DeleteIcon";
import serviceItemTypes from "../../../types/serviceItemTypes";

interface ServiceTreeRowProps {
  service: Service;
  isExpanded?: boolean;
  onToggle?: () => void;
  level: "upper" | "middle" | "lower";
  allServices: Service[];
}

const ServiceTreeRow: React.FC<ServiceTreeRowProps> = ({
  service,
  isExpanded = false,
  onToggle,
  level,
  allServices,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);

  let paddingLeft;
  let fontSize;
  let shadow;

  useEffect(() => {
    if (level === "upper") {
      setHasChildren(
        allServices.some((s) => s.upper_service_id === service.uuid)
      );
    } else if (level === "middle") {
      setHasChildren(
        allServices.some((s) => s.middle_service_id === service.uuid)
      );
    }
  }, [allServices, level, service.uuid]);

  const [{ isDragging }, drag] = useDrag({
    type: serviceItemTypes.ROW,
    item: { id: service.uuid },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  switch (level) {
    case "upper":
      paddingLeft = "0px";
      fontSize = "lg";
      shadow = "lg";
      break;
    case "middle":
      paddingLeft = "20px";
      fontSize = "md";
      shadow = "md";
      break;
    case "lower":
      paddingLeft = "40px";
      fontSize = "sm";
      shadow = "sm";
      break;
  }

  return (
    <Tr boxShadow={shadow} bg="transparent">
      <Td
        paddingLeft={paddingLeft}
        opacity={isDragging ? 0.5 : 1}
        ref={drag} // Attach the drag source ref to the element
      >
        <Flex align="center">
          <IconButton
            aria-label="Drag"
            icon={<DragHandleIcon />}
            size="xs"
            mr={3}
            variant="ghost"
            _hover={{ bg: "transparent" }}
            cursor="grab"
            ref={drag} // Attach the drag source ref here as well
          />

          <Flex
            align="center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            cursor={onToggle ? "pointer" : "default"}
            onClick={onToggle}
          >
            <Text
              fontSize={fontSize}
              fontWeight="medium"
              color={isHovered ? "green.500" : "inherit"}
              display="inline-flex"
              alignItems="center"
            >
              {service.name}
            </Text>
            {onToggle && hasChildren ? (
              <IconButton
                aria-label="Expand/Collapse"
                icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                size="s"
                ml={2}
                variant="standard"
                color={isHovered ? "green.500" : "inherit"}
                _hover={{ bg: "green.500", color: "white" }}
              />
            ) : (
              <Box width="24px" />
            )}
          </Flex>
        </Flex>
      </Td>
      <Td textAlign="center">
        <Flex justify="center">
          <DeleteIcon uuid={service.uuid} />
        </Flex>
      </Td>
    </Tr>
  );
};

export default ServiceTreeRow;
