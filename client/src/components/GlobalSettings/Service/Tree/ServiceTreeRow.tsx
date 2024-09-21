import { useState, forwardRef } from "react";
import { Tr, Td, Flex, Text, IconButton, Box } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DragHandleIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { Service } from "../../../../types/Service";
import DeleteIcon from "../DeleteIcon";

interface ServiceTreeRowProps {
  service: Service;
  hasChildren: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onDelete: (uuid: string) => void;
  onIndent: () => void;
  onOutdent: () => void;
  canIndent: boolean;
  canOutdent: boolean;
}

const ServiceTreeRow = forwardRef<HTMLTableRowElement, ServiceTreeRowProps>(
  (
    {
      service,
      hasChildren,
      isExpanded = false,
      onToggle,
      onDelete,
      onIndent,
      onOutdent,
      canIndent,
      canOutdent,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    // Indentation based on level
    const level =
      service.level === "upper" ? 0 : service.level === "middle" ? 1 : 2;
    const paddingLeft = `${level * 20}px`;

    return (
      <Tr bg="transparent" ref={ref}>
        <Td paddingLeft={paddingLeft}>
          <Flex align="center" justify="space-between">
            {/* Left Part */}
            <Flex align="center">
              {/* Drag handle icon */}
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
                  // Expand/collapse button
                  <IconButton
                    aria-label="Expand/Collapse"
                    icon={
                      isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
                    }
                    size="sm"
                    variant="ghost"
                    onClick={onToggle}
                    mr={2}
                  />
                ) : (
                  // Placeholder to align text
                  <Box width="32px" mr={2} />
                )}
                {/* Service name */}
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
            </Flex>
            {/* Right Part */}
            <Flex align="center">
              {/* Indent/Outdent buttons */}
              <Box
                borderColor="gray.800"
                outline="1px solid gray"
                borderRadius="8px"
                display="flex"
                alignItems="center"
                maxH="18px"
                mr={2}
              >
                <IconButton
                  aria-label="Outdent"
                  icon={<ChevronLeftIcon />}
                  size="xs"
                  variant="ghost"
                  borderLeftRadius="8px"
                  borderRightRadius="0px"
                  _hover={{ color: "white", bg: "green.500" }}
                  onClick={onOutdent}
                  maxH="18px"
                  isDisabled={!canOutdent}
                />
                <IconButton
                  aria-label="Indent"
                  icon={<ChevronRightIcon />}
                  size="xs"
                  variant="ghost"
                  borderRightRadius="8px"
                  borderLeftRadius="0px"
                  _hover={{ color: "white", bg: "green.500" }}
                  onClick={onIndent}
                  maxH="18px"
                  isDisabled={!canIndent}
                />
              </Box>
              {/* Delete icon */}
              <DeleteIcon uuid={service.uuid} onDelete={onDelete} />
            </Flex>
          </Flex>
        </Td>
      </Tr>
    );
  }
);

export default ServiceTreeRow;
