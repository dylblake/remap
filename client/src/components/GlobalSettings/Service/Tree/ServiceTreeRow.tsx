// /Users/dylanevans/GloDex/client/src/components/GlobalSettings/Service/Tree/ServiceTreeRow.tsx

import React, { useState, forwardRef } from "react";
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
  hoverBg: string; // Added hoverBg prop for styling
  children?: React.ReactNode; // Added children prop for additional cells
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
      hoverBg, // Receiving hoverBg prop
      children, // Receiving children prop
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    // Indentation based on level, using Chakra's spacing scale (e.g., 0, 6, 12)
    const level =
      service.level === "upper" ? 0 : service.level === "middle" ? 1 : 2;
    const paddingLeft = level * 6; // 6 * 4px = 24px per level

    // Placeholder width to match IconButton size
    const placeholderWidth = "32px"; // Match size="sm" IconButton

    // Determine text color based on hover state
    const serviceNameColor = isHovered ? "teal.500" : "inherit";

    // Define styles for the action buttons
    const actionButtonStyles = {
      size: "xs",
      variant: "ghost",
      _hover: { color: "white", bg: "teal.500" },
    };

    return (
      <Tr
        ref={ref}
        bg={isHovered ? hoverBg : "transparent"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition="background-color 0.2s ease"
        _hover={{ bg: hoverBg }}
      >
        {/* Service Name and Expand/Collapse Button */}
        <Td pl={paddingLeft} py={1}>
          <Flex align="center">
            {/* Drag Handle Icon */}
            <IconButton
              aria-label="Drag"
              icon={<DragHandleIcon />}
              size="sm" // Ensuring consistent size
              variant="ghost"
              mr={2}
              _hover={{ bg: "transparent" }}
              cursor="grab"
              onClick={(e) => e.stopPropagation()} // Prevent row toggle on drag
            />

            {/* Expand/Collapse Button */}
            {hasChildren ? (
              <IconButton
                aria-label="Expand/Collapse"
                icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row toggle on button click
                  onToggle && onToggle();
                }}
                mr={2}
              />
            ) : (
              // Placeholder to align text
              <Box width={placeholderWidth} mr={2} />
            )}

            {/* Service Name */}
            <Text
              fontSize="sm" // Reduced font size for compactness
              fontWeight="medium"
              color={serviceNameColor}
              noOfLines={1}
            >
              {service.name}
            </Text>
          </Flex>
        </Td>

        {/* Placeholder Columns */}
        {children}

        {/* Action Buttons: Indent, Outdent, Delete */}
        <Td py={1} textAlign="right">
          <Flex align="center" justify="flex-end">
            {/* Outdent Button */}
            <IconButton
              aria-label="Outdent"
              icon={<ChevronLeftIcon />}
              isDisabled={!canOutdent}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row toggle on button click
                onOutdent && onOutdent();
              }}
              {...actionButtonStyles}
              mr={1}
            />
            {/* Indent Button */}
            <IconButton
              aria-label="Indent"
              icon={<ChevronRightIcon />}
              isDisabled={!canIndent}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row toggle on button click
                onIndent && onIndent();
              }}
              {...actionButtonStyles}
              mr={1}
            />

            {/* Delete Icon */}
            <DeleteIcon
              uuid={service.uuid}
              onDelete={(uuid: string) => onDelete(uuid)}
            />
          </Flex>
        </Td>
      </Tr>
    );
  }
);

export default ServiceTreeRow;
