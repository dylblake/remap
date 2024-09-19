import React, { useState, useEffect } from "react";
import { Tr, Td, Flex, Text, IconButton, Box } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DragHandleIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { Service } from "../../../../types/Service";
import DeleteIcon from "../DeleteIcon";
import {
  canIndent,
  canOutdent,
} from "../../../../utils/serviceIndentOutdentUtils";

interface ServiceTreeRowProps {
  service: Service;
  isExpanded?: boolean;
  onToggle?: () => void;
  level: "upper" | "middle" | "lower";
  allServices: Service[];
  onDelete: (uuid: string) => void;
  onIndent: (uuid: string) => void;
  onOutdent: (uuid: string) => void;
}

const ServiceTreeRow: React.FC<ServiceTreeRowProps> = ({
  service,
  isExpanded = false,
  onToggle,
  level,
  allServices,
  onDelete,
  onIndent,
  onOutdent,
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

  switch (level) {
    case "upper":
      paddingLeft = "0px";
      fontSize = "lg";
      shadow = "lg";
      break;
    case "middle":
      paddingLeft = "25px";
      fontSize = "md";
      shadow = "md";
      break;
    case "lower":
      paddingLeft = "50px";
      fontSize = "sm";
      shadow = "sm";
      break;
  }

  return (
    <Tr boxShadow={shadow} bg="transparent">
      <Td paddingLeft={paddingLeft}>
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <IconButton
              aria-label="Drag"
              icon={<DragHandleIcon />}
              size="xs"
              mr={3}
              variant="ghost"
              _hover={{ bg: "transparent" }}
              cursor="grab"
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
                  onClick={onToggle}
                />
              ) : undefined}
            </Flex>

            <Box
              borderColor="gray.800"
              outline="1px solid gray"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              maxH="18px"
              ml={3}
            >
              <IconButton
                aria-label="outdent"
                icon={<ChevronLeftIcon />}
                size="xs"
                variant="ghost"
                borderLeftRadius="8px"
                borderRightRadius="0px"
                _hover={{ color: "white", bg: "green.500" }}
                onClick={() => canOutdent(level) && onOutdent(service.uuid)}
                maxH="18px"
                isDisabled={!canOutdent(level)}
              />
              <IconButton
                aria-label="indent"
                icon={<ChevronRightIcon />}
                size="xs"
                variant="ghost"
                borderRightRadius="8px"
                borderLeftRadius="0px"
                _hover={{ color: "white", bg: "green.500" }}
                onClick={() =>
                  canIndent(service, level, allServices) &&
                  onIndent(service.uuid)
                }
                maxH="18px"
                isDisabled={!canIndent(service, level, allServices)}
              />
            </Box>
          </Flex>
          <DeleteIcon uuid={service.uuid} onDelete={onDelete} />
        </Flex>
      </Td>
    </Tr>
  );
};

export default ServiceTreeRow;
