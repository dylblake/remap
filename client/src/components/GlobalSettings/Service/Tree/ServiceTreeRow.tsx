import React, { useState } from "react";
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
  allServices: Service[]; // allServicesState from the tree
  onDelete: (uuid: string) => void;
  onIndent: (uuid: string) => void;
  onOutdent: (uuid: string) => void;
}

const ServiceTreeRow: React.FC<ServiceTreeRowProps> = ({
  service,
  isExpanded = false,
  onToggle,
  allServices,
  onDelete,
  onIndent,
  onOutdent,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if the service has children
  const hasChildren = allServices.some(
    (s) =>
      (service.level === "upper" &&
        s.level === "middle" &&
        s.upper_service_id === service.uuid) ||
      (service.level === "middle" &&
        s.level === "lower" &&
        s.middle_service_id === service.uuid)
  );

  // Indentation based on level
  const level =
    service.level === "upper" ? 0 : service.level === "middle" ? 1 : 2;
  const paddingLeft = `${level * 20}px`;

  // Determine the level as a string
  const levelStr = service.level || "upper";

  // Use utility functions to determine if the service can be indented or outdented
  const canIndentState = canIndent(service, levelStr, allServices);
  const canOutdentState = canOutdent(levelStr);

  return (
    <Tr bg="transparent">
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
            >
              {hasChildren ? (
                <IconButton
                  aria-label="Expand/Collapse"
                  icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={onToggle}
                  mr={2}
                />
              ) : (
                // Add a placeholder to align the text
                <Box width="32px" mr={2} />
              )}
              <Text
                fontSize="md"
                fontWeight="medium"
                color={isHovered ? "green.500" : "inherit"}
                display="inline-flex"
                alignItems="center"
              >
                {service.name}
              </Text>
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
                onClick={() => canOutdentState && onOutdent(service.uuid)}
                maxH="18px"
                isDisabled={!canOutdentState}
              />
              <IconButton
                aria-label="indent"
                icon={<ChevronRightIcon />}
                size="xs"
                variant="ghost"
                borderRightRadius="8px"
                borderLeftRadius="0px"
                _hover={{ color: "white", bg: "green.500" }}
                onClick={() => canIndentState && onIndent(service.uuid)}
                maxH="18px"
                isDisabled={!canIndentState}
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
